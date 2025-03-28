/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./themes/**/*.{js,ts,jsx,tsx}", "./ui/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-(xs|sm|md|lg|xl)$/,
    },
    {
      pattern: /^(sm|md|lg|xl)?:?grid-cols-\d+$/,
    },
    {
      pattern: /^text-heading-[a-z]+$/,
    },
    'flex-row',
    'flex-col',
    'flex-row-reverse',
  ],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      red: "#F00",
      green: "#00B21C",
      transparent: "transparent",
      current: "currentColor",
      dark: "rgb(var(--black-base, 0 0 0) / <alpha-value>)",
      primary: "rgb(var(--color-primary, 9 62 111) / <alpha-value>)",
      "primary-dark": "rgb(var(--color-primary-dark, 7 50 89) / <alpha-value>)",
      secondary: "rgb(var(--color-secondary, 0 32 61) / <alpha-value>)",
      tertiary: "rgb(var(--color-tertiary, 244 127 47) / <alpha-value>)",
      quaternary: "rgb(var(--color-quaternary, 36 75 146) / <alpha-value>)",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "var(--margin, 48px)",
      },
      screens: {
        DEFAULT: "var(--pagewidth, 1440px)",
      },
    },
    screens: {
      xs: "320px",
      sm: "400px",
      md: "720px",
      lg: "980px",
      xl: "1440px",
      "2xl": "1720px",
      "3xl": "2000px",
    },
    fontSize: {
      xs: "var(--body-xs, 12px)",
      sm: "var(--body-sm, 14px)",
      base: "var(--body-md, 16px)",
      lg: "var(--body-lg, 18px)",
      "heading-3xl": [
        "var(--heading-3xl-size, 92px)", 
        {
          lineHeight: "var(--heading-3xl-line-height, 1.3)", 
          letterSpacing: "var(--heading-3xl-letter-spacing, normal)"
        }
      ],
      "heading-2xl": [
        "var(--heading-2xl-size, 72px)", 
        {
          lineHeight: "var(--heading-2xl-line-height, 1.3)", 
          letterSpacing: "var(--heading-2xl-letter-spacing, normal)"
        }
      ],
      "heading-xl": [
        "var(--heading-xl-size, 52px)", 
        {
          lineHeight: "var(--heading-xl-line-height, 1.3)", 
          letterSpacing: "var(--heading-xl-letter-spacing, normal)"
        }
      ],
      "heading-lg": [
        "var(--heading-lg-size, 42px)", 
        {
          lineHeight: "var(--heading-lg-line-height, 1.3)", 
          letterSpacing: "var(--heading-lg-letter-spacing, normal)"
        }
      ],
      "heading-md": [
        "var(--heading-md-size, 32px)", 
        {
          lineHeight: "var(--heading-md-line-height, 1.3)", 
          letterSpacing: "var(--heading-md-letter-spacing, normal)"
        }
      ],
      "heading-sm": [
        "var(--heading-sm-size, 26px)", 
        {
          lineHeight: "var(--heading-sm-line-height, 1.3)", 
          letterSpacing: "var(--heading-sm-letter-spacing, normal)"
        }
      ],
      "heading-xs": [
        "var(--heading-xs-size, 21px)", 
        {
          lineHeight: "var(--heading-xs-line-height, 1.3)", 
          letterSpacing: "var(--heading-xs-letter-spacing, normal)"
        }
      ],
    },
    extend: {
      borderRadius: {
        xl: "var(--border-radius-x-large, 16px)",
        lg: "var(--border-radius-large, 12px)",
        md: "var(--border-radius-medium, 8px)",
        sm: "var(--border-radius-small, 5px)",
        xs: "var(--border-radius-x-small, 3px)",
      },
      gap: {
        xs: "6px",
        sm: "24px",
        md: "var(--section-spacer-small, 32px)",
        lg: "var(--section-spacer-medium, 48px)",
        xl: "var(--section-spacer-large, 64px)",
      },
      padding: {
        xs: "6px",
        sm: "24px",
        md: "var(--section-spacer-small, 32px)",
        lg: "var(--section-spacer-medium, 48px)",
        xl: "var(--section-spacer-large, 64px)",
      },
      margin: {
        xs: "6px",
        sm: "24px",
        md: "var(--section-spacer-small, 32px)",
        lg: "var(--section-spacer-medium, 48px)",
        xl: "var(--section-spacer-large, 64px)",
      },
    },
  },
  plugins: [],
};
