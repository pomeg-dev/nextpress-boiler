import { Archivo, Geist_Mono } from "next/font/google";

// Display + body. Variable weight and width: headings use the expanded widths.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-archivo",
});

// Codes, labels, data and code samples.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const fonts = {
  archivo,
  geistMono,
};

export const fontVariables = [archivo.variable, geistMono.variable].join(" ");
