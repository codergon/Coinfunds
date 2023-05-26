import dayjs from "dayjs";
import "@/styles/index.scss";
import { Metadata } from "next";
import { roobert } from "@/styles/font";

import "@/utils/axios";

import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const metadata: Metadata = {
  title: "Coinfunds",
  description: "Coinfunds - Efficient Crowdfunding powered by Circle",
  twitter: {
    card: "summary_large_image",
    title: "Coinfunds - Efficient Crowdfunding powered by Circle",
    description:
      "Coinfunds is a crowdfunding platform powered by Circle that allows you to raise funds for your projects and ideas.",
    creator: "@thealpha_knight",
    images: [
      {
        url: "https://coinfunds.vercel.app/images/og.png",
      },
    ],
  },
  metadataBase: new URL("https://coinfunds.vercel.app"),
  themeColor: "#FFF",
  openGraph: {
    title: "Coinfunds - Efficient Crowdfunding powered by Circle",
    description:
      "Coinfunds is a crowdfunding platform powered by Circle that allows you to raise funds for your projects and ideas.",
    url: "https://coinfunds.vercel.app",
    type: "website",
    images: [
      {
        url: "https://coinfunds.vercel.app/images/og.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roobert.className}>
        <main className="">{children}</main>
      </body>
    </html>
  );
}
