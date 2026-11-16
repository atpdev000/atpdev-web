import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://masteratpdf.atpdev.dev"),
  alternates: {
    canonical: "/",
  },
  title: "MasterAtPDF Pro • Herramientas PDF Profesionales Online | ATP DEV",
  description: "Suite definitiva de herramientas PDF de alto rendimiento: unir, dividir, organizar, rotar, comprimir y convertir documentos con máxima privacidad en tu navegador.",
  keywords: "PDF tools, unir PDF, dividir PDF, comprimir PDF, organizar PDF, reemplazar pagina PDF, PDF a Word, Word a PDF, PDF a JPG, ATP DEV",
  authors: [{ name: "ATP DEV Ecosystem" }],
  openGraph: {
    title: "MasterAtPDF Pro • Herramientas PDF Profesionales Online",
    description: "Suite definitiva de herramientas PDF con procesamiento local privado y alta fidelidad visual.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script
          id="google-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-indigo-500 selection:text-white`}>
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
