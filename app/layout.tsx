import type { ReactNode } from "react";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ME",
  description: "ME | Modular Store Operations Platform",
  applicationName: "ME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="bright" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
