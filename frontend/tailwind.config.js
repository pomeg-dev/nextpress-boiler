/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./themes/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      transparent: "transparent",
      current: "currentColor",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#F6F7F9",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      tertiary: "var(--color-tertiary)",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        sm: "20px",
        lg: "40px",
        xl: "70px",
      },
      screens: {
        DEFAULT: "1340px",
      },
    },
    screens: {
      xs: "440px",
      sm: "640px",
      md: "768px",
      lg: "1320px",
      xl: "1390px",
      "2xl": "1482px",
      "3xl": "1922px",
    },
    fontFamily: {
      opensans: ["Open Sans", "sans-serif"],
      inter: ["Inter", "sans-serif"],
      merriweather: ["Cal Sans", "Inter", "sans-serif"],
    },
    extend: {
      // borderRadius: {
      //   xl: "var(--border-radius-xlarge)",
      //   lg: "var(--border-radius-large)",
      //   md: "var(--border-radius-medium)",
      //   sm: "var(--border-radius-small)",
      // },
      borderRadius: {
        xl: "60px",
        lg: "50px",
        md: "20px",
        sm: "10px",
      },
    },
  },
  plugins: [],
};
