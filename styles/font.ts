import localFont from "next/font/local";

export const suisse = localFont({
  src: "./fonts/SuisseIntl-Book.woff",
  display: "swap",
  style: "normal",
  weight: "500",
});

export const roobert = localFont({
  src: [
    {
      path: "./fonts/RoobertBC-Medium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/RoobertBC-Regular.otf",
      weight: "300",
      style: "normal",
    },
  ],
});

export const neue = localFont({
  src: "./fonts/NeueMontreal-Medium.woff2",
  display: "swap",
  style: "normal",
  weight: "500",
});
