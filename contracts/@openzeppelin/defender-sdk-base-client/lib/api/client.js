"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentialDelay = exports.BaseApiClient = void 0;
const api_1 = require("./api");
const auth_1 = require("./auth");
const time_1 = require("../utils/time");
const auth_v2_1 = require("./auth-v2");
class BaseApiClient {
    constructor(params) {
        if (!params.apiKey)
            throw new Error(`API key is required`);
        if (!params.apiSecret)
            throw new Error(`API secret is required`);
        this.apiKey = params.apiKey;
        this.apiSecret = params.apiSecret;
        this.httpsAgent = params.httpsAgent;
        this.retryConfig = { retries: 3, retryDelay: exports.exponentialDelay, ...params.retryConfig };
        this.authConfig = params.authConfig ?? { useCredentialsCaching: false, type: 'admin' };
    }
    async getAccessToken() {
        const userPass = { Username: this.apiKey, Password: this.apiSecret };
        const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
        const auth = await (0, auth_1.authenticate)(userPass, poolData);
        return auth.getAccessToken().getJwtToken();
    }
    async getAccessTokenV2() {
        if (!this.authConfig.type)
            throw new Error('Auth type is required to authenticate in auth v2');
        const credentials = {
            apiKey: this.apiKey,
            secretKey: this.apiSecret,
            type: this.authConfig.type,
        };
        this.sessionV2 = await (0, auth_v2_1.authenticateV2)(credentials, this.getApiUrl('admin'));
        return this.sessionV2.accessToken;
    }
    async refreshSession() {
        if (!this.session)
            return this.getAccessToken();
        const userPass = { Username: this.apiKey, Password: this.apiSecret };
        const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
        this.session = await (0, auth_1.refreshSession)(userPass, poolData, this.session);
        return this.session.getAccessToken().getJwtToken();
    }
    async refreshSessionV2() {
        if (!this.authConfig.type)
            throw new Error('Auth type is required to refresh session in auth v2');
        if (!this.sessionV2)
            return this.getAccessTokenV2();
        const credentials = {
            apiKey: this.apiKey,
            secretKey: this.apiSecret,
            refreshToken: this.sessionV2.refreshToken,
            type: this.authConfig.type,
        };
        const auth = await (0, auth_v2_1.refreshSessionV2)(credentials, this.getApiUrl('admin'));
        return auth.accessToken;
    }
    async init() {
        if (!this.api) {
            const accessToken = this.authConfig.useCredentialsCaching
                ? await this.getAccessTokenV2()
                : await this.getAccessToken();
            this.api = (0, api_1.createAuthenticatedApi)(this.apiKey, accessToken, this.getApiUrl(), this.httpsAgent);
        }
        return this.api;
    }
    async refresh(overrides) {
        if (!this.session && !this.sessionV2) {
            return this.init();
        }
        try {
            const accessToken = this.authConfig.useCredentialsCaching
                ? await this.refreshSessionV2()
                : await this.refreshSession();
            this.api = (0, api_1.createAuthenticatedApi)(this.apiKey, accessToken, this.getApiUrl(), this.httpsAgent, overrides?.headers);
            return this.api;
        }
        catch (e) {
            return this.init();
        }
    }
    async withRetry(axiosInstance, apiFunction, { retryCount, retryDelay } = { retryCount: 0, retryDelay: 0 }) {
        try {
            await (0, time_1.sleep)(retryDelay);
            return await apiFunction(axiosInstance);
        }
        catch (error) {
            // this means ID token has expired so we'll recreate session and try again
            if (isAuthenticationError(error)) {
                this.api = undefined;
                const api = await this.refresh();
                return await this.withRetry(api, apiFunction, { retryCount, retryDelay });
            }
            const updatedRetryState = {
                retryCount: retryCount + 1,
                retryDelay: this.retryConfig.retryDelay(retryCount + 1, error),
            };
            if (updatedRetryState.retryCount > this.retryConfig.retries)
                throw error;
            if (isCloudFlareError(error)) {
                const apiWithUpgradeHeaders = await this.refresh({
                    headers: {
                        Connection: 'upgrade',
                        Upgrade: 'HTTP/2.0',
                    },
                });
                return await this.withRetry(apiWithUpgradeHeaders, apiFunction, updatedRetryState);
            }
            if (await (this.retryConfig?.retryCondition?.(error) ?? true))
                await this.withRetry(axiosInstance, apiFunction, updatedRetryState);
            throw error;
        }
    }
    // prettier-ignore
    async apiCall(apiFunction) {
        const api = await this.init();
        return this.withRetry(api, apiFunction);
    }
}
exports.BaseApiClient = BaseApiClient;
const isAuthenticationError = (axiosError) => axiosError.response?.status === 401 && axiosError.response?.statusText === 'Unauthorized';
const isCloudFlareError = (axiosError) => axiosError.response?.status === 520 && (axiosError.response?.data).includes('Cloudflare');
const exponentialDelay = (retryNumber = 0, _error = undefined, delayFactor = 100) => {
    const delay = 2 ** retryNumber * delayFactor;
    const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
    return delay + randomSum;
};
exports.exponentialDelay = exponentialDelay;
