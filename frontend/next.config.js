/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  // output: "export",
  // compiler: {
  //   removeConsole: true,
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        port: "",
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        port: "",
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

module.exports = nextConfig;
