import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import Providers from "@/lib/providers/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/shared/header/Header";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buildora - Construction Workforce Management Platform",
  description:
    "Connect skilled construction workers with project managers. Streamline hiring, manage teams, and scale your construction projects efficiently with Buildora.",
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
    url: "https://buildora-frontend-xi.vercel.app",
    title: "Buildora - Construction Workforce Management Platform",
    description:
      "Connect skilled construction workers with project managers. Streamline hiring, manage teams, and scale your construction projects efficiently.",
    siteName: "Buildora",
    images: [
      {
        url: "https://api.zenexcloud.com/emdadullah/uploads/projects/profileImage/1777956435205-7jmrdclhbdh.jpg",
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
    images: [
      "https://api.zenexcloud.com/emdadullah/uploads/projects/profileImage/1777956435205-7jmrdclhbdh.jpg",
    ],
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
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ToastContainer position="top-right" autoClose={3000} />
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
