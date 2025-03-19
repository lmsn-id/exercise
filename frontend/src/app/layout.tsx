import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "~/context/SessionProvider";
import { SessionData } from "@/auth";
import Navbar from "~/components/Navbar";
import "./globals.css";
import AutoRefreshTokenWrapper from "~/context/AutoRefreshTokenWrapper";
import { QueryProviders } from "~/context/QueryClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Of Technoprenuer Nusantara",
  description: "Lazer Multifunction",
  icons: {
    icon: "/image/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Session = await SessionData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={Session}>
          <AutoRefreshTokenWrapper />
          <ToastContainer />
          <QueryProviders>
            <Navbar session={Session} />
            <main className="w-full h-full bg-gray-100">{children}</main>
          </QueryProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
