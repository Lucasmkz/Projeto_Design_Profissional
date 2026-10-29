import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OrdensProvider } from "@/context/OrdensContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Center Veloz",
  description:
    "Acompanhe o conserto do seu carro, veja fotos das peças e aprove o orçamento item por item.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrdensProvider>{children}</OrdensProvider>
      </body>
    </html>
  );
}
