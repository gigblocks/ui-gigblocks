import type { Metadata } from "next";
import { headers } from 'next/headers'
import { Inter } from "next/font/google";
import { config } from "./config";
import { cookieToInitialState } from 'wagmi'
import AppKitProvider from "./context/AppKitProvider";
import ToastProvider from "./context/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GigBlocks",
  description: "Revolutionize Freelancing with Scroll-Powered Decentralization`",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AppKitProvider initialState={initialState}>{children}</AppKitProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
