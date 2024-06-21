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
        success: {
          100: "#BCFAD3",
          200: "#DCFCE7",
          300: "#BBF7D0",
          500: "#86EFAC",
          600: "#4ADE80",
          700: "#166534",
        },
        danger: {
          100: "#FEF2F2",
          200: "#FFD4D4",
          300: "#EF4444",
          500: "#DC2626",
          600: "#B91C1C",
          700: "#991B1B",
        },
        warning: {
          100: "#FFF4E5",
          200: "#FFCE9A",
          300: "#F97316",
          500: "#C2410C",
          600: "#7C2D12",
          700: "#431407",
        },
        neutral: {
          50: "#F9F9F9",
          100: "#DCDCDC",
          200: "#BDBDBD",
          300: "#989898",
          500: "#7C7C7C",
          600: "#525252",
          700: "#000000",
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
