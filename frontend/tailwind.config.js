/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
	content: [
		// Core app and API routes
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/lib/**/*.{js,ts,jsx,tsx}",
		"./src/ui/**/*.{js,ts,jsx,tsx}",
		// Theme blocks (exclude JSON field files)
		"./themes/**/index.{js,ts,jsx,tsx}",
		// UI components (exclude Storybook stories)
		"./ui/components/**/*.{js,ts,jsx,tsx}",
		"./ui/animations/**/*.{js,ts,jsx,tsx}",
		"./ui/fonts/*.{js,ts}",
		"./ui/icons/*.{js,ts,jsx,tsx}",
		"./ui/utils/*.{js,ts}",
	],
	safelist: [
		// Spacing - keep pattern for dynamic usage
		{
			pattern:
				/^(!)??(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-(0|xs|sm|md|lg|xl|margin)$/,
		},
		// Grid columns - only used values
		"grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-6", 
		"grid-cols-12", "grid-cols-16", "grid-cols-18", "grid-cols-20", 
		"grid-cols-22", "grid-cols-24",
		// Responsive grid columns - most common
		"sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3",
		"md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-6",
		"lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-6", "lg:grid-cols-12",
		"xl:grid-cols-3", "xl:grid-cols-6", "xl:grid-cols-12",
		// Typography - specific used sizes
		"text-heading-xs", "text-heading-sm", "text-heading-md", 
		"text-heading-lg", "text-heading-xl",
		"text-card-lg",
		// Column spans - only used values
		"col-span-1", "col-span-2", "col-span-3", "col-span-4", 
		"col-span-6", "col-span-8", "col-span-12", "col-span-14",
		// Row spans - commonly used
		"row-span-1", "row-span-2", "row-span-3", "row-span-4",
		// Max widths - only used col values
		"max-w-col-4", "max-w-col-5", "max-w-col-6", "max-w-col-7", 
		"max-w-col-8", "max-w-col-9", "max-w-col-10", "max-w-col-11", 
		"max-w-col-12", "max-w-col-13", "max-w-col-14", "max-w-col-15", 
		"max-w-col-16", "max-w-col-17", "max-w-col-18", "max-w-col-20",
		// Responsive max-widths - most common
		"sm:max-w-col-8", "sm:max-w-col-10", "sm:max-w-col-14",
		"md:max-w-col-8", "md:max-w-col-10", "md:max-w-col-11", "md:max-w-col-14", "md:max-w-col-16",
		"lg:max-w-col-10", "lg:max-w-col-14", "lg:max-w-col-16",
		"xl:max-w-col-14", "xl:max-w-col-16",
		// Flexbox directions
		"flex-row", "flex-col", "flex-row-reverse",
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
			primary: "rgb(var(--color-primary-rgb, 9 62 111) / <alpha-value>)",
			"primary-dark": "var(--color-primary-dark, 0 0 0)",
			secondary:
				"rgb(var(--color-secondary-rgb, 0 32 61) / <alpha-value>)",
			"secondary-dark": "var(--color-secondary-dark, 0 0 0)",
			tertiary: "var(--color-tertiary, 0 0 0)",
			quaternary: "var(--color-quaternary, 0 0 0)",
			smoke: "rgb(var(--color-smoke, 9 62 111) / <alpha-value>)",
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
			sm: "390px",
			md: "720px",
			lg: "1080px",
			xl: "1440px",
			"2xl": "1720px",
			"3xl": "2000px",
		},
		fontSize: {
			xs: "12px",
			sm: [
				"var(--body-sm-font-size, 14px)",
				{
					lineHeight: "var(--body-sm-line-height, 22px)",
					letterSpacing: "var(--body-sm-letter-spacing, -0.12px)",
					marginBottom: "var(--body-sm-margin-bottom, 1rem)",
				},
			],
			base: [
				"var(--body-md-font-size, 16px)",
				{
					lineHeight: "var(--body-md-line-height, 24px)",
					letterSpacing: "var(--body-md-letter-spacing, -0.15px)",
					marginBottom: "var(--body-md-margin-bottom, 1rem)",
				},
			],
			lg: [
				"var(--body-lg-font-size, 18px)",
				{
					lineHeight: "var(--body-lg-line-height, 24px)",
					letterSpacing: "var(--body-lg-letter-spacing, -0.17px)",
					marginBottom: "var(--body-lg-margin-bottom, 1rem)",
				},
			],
			"heading-3xl": [
				"var(--heading-3xl-font-size, 92px)",
				{
					lineHeight: "var(--heading-3xl-line-height, 135px)",
					letterSpacing: "var(--heading-3xl-letter-spacing, -4.5px)",
					marginBottom: "var(--heading-3xl-margin-bottom, 1rem)",
				},
			],
			"heading-2xl": [
				"var(--heading-2xl-font-size, 72px)",
				{
					lineHeight: "var(--heading-2xl-line-height, 80px)",
					letterSpacing: "var(--heading-2xl-letter-spacing, -3px)",
					marginBottom: "var(--heading-2xl-margin-bottom, 1rem)",
				},
			],
			"heading-xl": [
				"var(--heading-xl-font-size, 52px)",
				{
					lineHeight: "var(--heading-xl-line-height, 70px)",
					letterSpacing: "var(--heading-xl-letter-spacing, -2.46px)",
					marginBottom: "var(--heading-xl-margin-bottom, 1rem)",
				},
			],
			"heading-lg": [
				"var(--heading-lg-font-size, 42px)",
				{
					lineHeight: "var(--heading-lg-line-height, 60px)",
					letterSpacing: "var(--heading-lg-letter-spacing, -1.68px)",
					marginBottom: "var(--heading-lg-margin-bottom, 1rem)",
				},
			],
			"heading-md": [
				"var(--heading-md-font-size, 32px)",
				{
					lineHeight: "var(--heading-md-line-height, 50px)",
					letterSpacing: "var(--heading-md-letter-spacing, -1.08px)",
					marginBottom: "var(--heading-md-margin-bottom, 1rem)",
				},
			],
			"heading-sm": [
				"var(--heading-sm-font-size, 26px)",
				{
					lineHeight: "var(--heading-sm-line-height, 40px)",
					letterSpacing: "var(--heading-sm-letter-spacing, -1.08px)",
					marginBottom: "var(--heading-sm-margin-bottom, 1rem)",
				},
			],
			"heading-xs": [
				"var(--heading-xs-font-size, 21px)",
				{
					lineHeight: "var(--heading-xs-line-height, 30px)",
					letterSpacing: "var(--heading-xs-letter-spacing, -0.84px)",
					marginBottom: "var(--heading-xs-margin-bottom, 1rem)",
				},
			],
			"card-lg": [
				"var(--card-lg-font-size, 34px)",
				{
					lineHeight: "var(--card-lg-line-height, 40px)",
					letterSpacing: "var(--card-lg-letter-spacing, -1px)",
					marginBottom: "var(--card-lg-margin-bottom, 1rem)",
				},
			],
			"card-md": [
				"var(--card-md-font-size, 26px)",
				{
					lineHeight: "var(--card-md-line-height, 34px)",
					letterSpacing: "var(--card-md-letter-spacing, -0.77px)",
					marginBottom: "var(--card-md-margin-bottom, 1rem)",
				},
			],
			"card-sm": [
				"var(--card-sm-font-size, 21px)",
				{
					lineHeight: "var(--card-sm-line-height, 30px)",
					letterSpacing: "var(--card-sm-letter-spacing, 0px)",
					marginBottom: "var(--card-sm-margin-bottom, 1rem)",
				},
			],
		},
		extend: {
			gridTemplateColumns: {
				16: "repeat(16, minmax(0, 1fr))",
				18: "repeat(18, minmax(0, 1fr))",
				20: "repeat(20, minmax(0, 1fr))",
				22: "repeat(22, minmax(0, 1fr))",
				24: "repeat(24, minmax(0, 1fr))",
			},
			gridColumn: {
				"span-13": "span 13 / span 13",
				"span-14": "span 14 / span 14",
				"span-15": "span 15 / span 15",
				"span-16": "span 16 / span 16",
				"span-17": "span 17 / span 17",
				"span-18": "span 18 / span 18",
				"span-19": "span 19 / span 19",
				"span-20": "span 20 / span 20",
				"span-21": "span 21 / span 21",
				"span-22": "span 22 / span 22",
				"span-23": "span 23 / span 23",
				"span-24": "span 24 / span 24",
			},
			fontFamily: {
				primary: [
					"var(--font-helvetica-neue)",
					"Helvetica Neue",
					"Helvetica",
					"Arial",
					"Lucida Grande",
					"sans-serif",
				],
				secondary: ["var(--font-playfair-display)", "serif"],
				tertiary: ["var(--font-red-velvet)", "serif"],
			},
			borderRadius: {
				xl: "var(--border-radius-x-large, 16px)",
				lg: "var(--border-radius-large, 12px)",
				md: "var(--border-radius-medium, 8px)",
				sm: "var(--border-radius-small, 5px)",
				xs: "var(--border-radius-x-small, 3px)",
			},
			gap: {
				xs: "8px",
				sm: "24px",
				md: "var(--section-padding-slim, 32px)",
				lg: "var(--section-padding-default, 48px)",
			},
			padding: {
				xs: "8px",
				sm: "24px",
				md: "var(--section-padding-slim, 32px)",
				lg: "var(--section-padding-default, 48px)",
				margin: "var(--margin, 48px)",
			},
			margin: {
				xs: "8px",
				sm: "24px",
				md: "var(--section-padding-slim, 32px)",
				lg: "var(--section-padding-default, 48px)",
				margin: "var(--margin, 48px)",
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities, theme, e }) {
			const colUtilities = {};
			Array.from({ length: 24 }, (_, i) => i + 1).forEach((cols) => {
				colUtilities[`.${e(`max-w-col-${cols}`)}`] = {
					"max-width": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`w-col-${cols}`)}`] = {
					width: `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`min-w-col-${cols}`)}`] = {
					"min-width": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`gap-col-${cols}`)}`] = {
					gap: `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`gap-x-col-${cols}`)}`] = {
					"column-gap": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`gap-y-col-${cols}`)}`] = {
					"row-gap": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`ml-col-${cols}`)}`] = {
					"margin-left": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`mr-col-${cols}`)}`] = {
					"margin-right": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`mx-col-${cols}`)}`] = {
					"margin-left": `calc(var(--col-size) * ${cols})`,
					"margin-right": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`pl-col-${cols}`)}`] = {
					"padding-left": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`pr-col-${cols}`)}`] = {
					"padding-right": `calc(var(--col-size) * ${cols})`,
				};
				colUtilities[`.${e(`px-col-${cols}`)}`] = {
					"padding-left": `calc(var(--col-size) * ${cols})`,
					"padding-right": `calc(var(--col-size) * ${cols})`,
				};
			});

			addUtilities(colUtilities, {
				variants: ["responsive"],
			});
		}),
	],
};
