const errorMessages = [
  {
    name: "ContractFunctionExecutionError",
    message:
      "An error occurred during the execution of a smart contract function. Please try again. If the error persists, contact support.",
  },
  {
    name: "ConnectorNotConnectedError",
    message:
      "No connection to the blockchain connector. Please ensure your wallet is connected and try again.",
  },
  {
    name: "ConnectorAccountNotFoundError",
    message:
      "No account found for the connected wallet. Please check your wallet and try again.",
  },
  {
    name: "ConnectorChainMismatchError",
    message:
      "The blockchain network selected in your wallet does not match the application's network. Please switch to the correct network and try again.",
  },
  {
    name: "TransactionExecutionError",
    message:
      "An error has occurred during transaction execution. Please check your wallet connections and try again. If the error persists, contact support.",
  },
  {
    name: "IntegerOutOfRangeError",
    message:
      "The value entered is invalid. Please enter a valid number and try again.",
  },
  {
    name: "SizeOverflowError",
    message:
      "An error has occurred due to size overflow. Please try again. If the error persists, contact support.",
  },
  {
    name: "InternalRpcError",
    message:
      "The application failed to communicate with your wallet. Please check your wallet connections and try again. If the error persists, contact support.",
  },
  {
    name: "HttpRequestError",
    message:
      "A problem occurred while connecting to the server. Please try again. If the error persists, contact support.",
  },
];

export default errorMessages;
