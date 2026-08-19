import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("http://127.0.0.1:3000"),
  title: {
    default: "Trade Wave Capital | TWC Academy",
    template: "%s | Trade Wave Capital"
  },
  description:
    "Trade Wave Capital teaches Gold, Forex, Crypto, and Indices through TWC Academy curriculum, live mentorship, risk management, and disciplined market application.",
  openGraph: {
    title: "Trade Wave Capital | TWC Academy",
    description: "Unleash your potential with structured learning, live sessions, mentorship, and risk-first trading education.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050403"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" data-theme="dark" lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{document.documentElement.dataset.theme=localStorage.getItem('twc-theme')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})();"
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
