import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import Providers from "@/lib/providers/Providers";
import { Toaster } from "sonner";
import Header from "@/components/shared/header/Header";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildora-frontend-xi.vercel.app"),
  title: "Buildora - Construction Workforce Management Platform",
  description:
    "Connect skilled construction workers with project managers. Streamline hiring, manage teams, and scale your construction projects efficiently with Buildora.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "construction",
    "workforce management",
    "hiring",
    "project management",
    "construction workers",
    "labor marketplace",
  ],
  authors: [{ name: "Buildora" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Buildora - Construction Workforce Management Platform",
    description:
      "Connect skilled construction workers with project managers. Streamline hiring, manage teams, and scale your construction projects efficiently.",
    siteName: "Buildora",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Buildora - Construction Workforce Management",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildora - Construction Workforce Management Platform",
    description:
      "Connect skilled construction workers with project managers. Streamline hiring, manage teams, and scale your construction projects efficiently.",
    images: ["/og-image.jpg"],
    creator: "@buildora",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo9.png" />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            
            <Toaster />
            <div className="min-h-[100vh] bg-[#f8f8f8]">
              <Header></Header>
              <div>{children}</div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
