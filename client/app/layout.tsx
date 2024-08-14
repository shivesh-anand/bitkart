import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ClientProvider from "@/components/client-provider"; // Import your client provider
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

const dmsans = DM_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          dmsans.className
        )}
      >
        <ClientProvider>
          {" "}
          {/* Use the client provider here */}
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mt-16 mx-auto w-full pt-16 px-6 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <Footer />
              </footer>
            </div>
          </Providers>
        </ClientProvider>
      </body>
    </html>
  );
}
