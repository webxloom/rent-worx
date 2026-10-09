import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rentworx.co.nz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rent Worx | Property Management | Auckland, New Zealand",
  description:
    "Boutique residential property management across Auckland, New Zealand. Rigorous tenant selection, Healthy Homes compliance, and transparent reporting. Led by Rajiv Kumar.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning on <body>: extensions like Grammarly inject
          attributes (data-gr-ext-installed, data-new-gr-c-s-check-loaded) onto
          the body before React hydrates, which would otherwise be flagged.
          Only the body's own attributes are ignored — children are still checked. */}
      <body suppressHydrationWarning>
        <ThemeScript />
        <TopBanner />
        <Navbar />
        <WhatsAppFab />
        <main id="app-root">{children}</main>
        <Footer />
        <div id="toast-container" />
      </body>
    </html>
  );
}
