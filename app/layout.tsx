import type { Metadata } from "next";
import { Geist_Mono, Epilogue } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});
const sans = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Intelligent Computing & Machine Learning Lab",
  description: "ICMLL — Intelligent Computing & Machine Learning Lab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        {/* returning visitors: hide the loader before first paint */}
        <Script id="loader-seen" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem("icmll-loader-seen")==="1")document.documentElement.dataset.seen="1"}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
