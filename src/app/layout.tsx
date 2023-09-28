import { absoluteUrl } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Societal Analytics Lab",
    template: "%s | Societal Analytics Lab",
  },
  description:
    "We are the Societal Analytics Lab of the Faculty of Social Science at the Vrije Universiteit Amsterdam",
  openGraph: {
    title: "Societal Analytics Lab",
    description:
      "We are the Societal Analytics Lab of the Faculty of Social Science at the Vrije Universiteit Amsterdam",
    url: absoluteUrl("/"),
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon/favicon-32x32.png" }],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
