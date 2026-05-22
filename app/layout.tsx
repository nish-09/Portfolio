import type { Metadata, Viewport } from "next";
import { Bruno_Ace_SC, Frijole, Rubik_Dirt } from "next/font/google";
import "./globals.css";
import ClickSpark from "./components/ClickSpark";
import CustomCursor from "./components/CustomCursor";
import GitHubPrefetch from "./components/GitHubPrefetch";
import SitePreloader from "./components/SitePreloader";
import PortfolioPillNav from "./components/PortfolioPillNav";
import SmoothScroll from "./components/SmoothScroll";

const brunoAce = Bruno_Ace_SC({
  variable: "--font-bruno",
  weight: "400",
  subsets: ["latin"],
});

const frijole = Frijole({
  variable: "--font-frijole",
  weight: "400",
  subsets: ["latin"],
});

const rubikDirt = Rubik_Dirt({
  variable: "--font-rubik",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nishit Parikh",
  description: "Portfolio Website",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${brunoAce.variable} ${frijole.variable} ${rubikDirt.variable} bg-[#101010] text-[#fcfcfc] antialiased overflow-x-clip`}
    >
      <body className="min-h-full min-h-[100dvh] w-full min-w-0 flex flex-col font-sans selection:bg-white/30 selection:text-white overflow-x-clip">
        <SmoothScroll>
          <GitHubPrefetch />
          <CustomCursor />
          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={32}
            sparkRadius={70}
            sparkCount={12}
            duration={650}
            easing="ease-out"
            extraScale={1}
          />
          <SitePreloader>{children}</SitePreloader>
          <PortfolioPillNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
