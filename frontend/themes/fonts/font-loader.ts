import localFont from "next/font/local";
import {
  Inter,
  Roboto,
  Open_Sans,
  Playfair_Display,
  DM_Sans,
  Outfit,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

//playfai display
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

//Paralex
const paralex = localFont({
  src: [
    {
      path: "../../public/fonts/Paralex.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-paralex",
});

//dm_sans
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
export const fonts = {
  inter,
  playfairDisplay,
  dmSans,
  paralex,
  outfit,
};

export const fontVariables = [
  inter.variable,
  playfairDisplay.variable,
  dmSans.variable,
  paralex.variable,
  outfit.variable,
].join(" ");
