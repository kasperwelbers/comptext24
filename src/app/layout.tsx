import { absoluteUrl } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "CompText 2024",
    template: "%s | CompText 2024",
  },
  description: "Website for the CompText 2024 Conference",
  openGraph: {
    title: "CompText 2024",
    description: "Website for the CompText 2024 Conference",
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
