import React from "react";
import "../index.css";

export const metadata = {
  title: "Smart Money - Personal Wealth Workspace",
  description: "Dynamic micro-spending meters, simulated timelines, and multi-mind specialist councils",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FBFBFD] text-[#1D1D1F]">
        {children}
      </body>
    </html>
  );
}
