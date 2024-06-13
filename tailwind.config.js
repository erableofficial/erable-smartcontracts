/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-primary": "#98F9CF",
        surface: {
          100: "#FFFFFF",
          200: "#FFFFF8",
          300: "#FFFEE9",
          500: "#FFFBA0",
        },
        primary: "#1F1F1F",
      },
      fontFamily: {
        NeueHaas: ["NeueHaasGroteskDisplayPro", "sans-serif"],
        friends: ["Friends", "sans-serif"],
      },
      boxShadow: {
        custom: "0px 0px 0px 3px #000000", // Custom drop shadow for border
      },
    },
  },
  plugins: [],
};
