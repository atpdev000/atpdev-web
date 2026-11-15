import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: '--font-hanken' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: "ATP DEV | Admin CMS",
  description: "Premium Headless CMS Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${hanken.variable} ${inter.variable} ${jetbrains.variable} font-sans bg-[#1A1A1A] text-gray-200 antialiased h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
