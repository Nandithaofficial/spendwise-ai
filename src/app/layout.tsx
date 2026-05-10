import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendWise AI — Free AI Tool Spend Audit",
  description: "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
  openGraph: {
    title: "SpendWise AI — Free AI Tool Spend Audit",
    description: "Find out exactly where your team is overspending on AI tools. Free instant audit. No login required.",
    url: "https://spendwise-ai.vercel.app",
    siteName: "SpendWise AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SpendWise AI" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendWise AI — Free AI Tool Spend Audit",
    description: "Find out exactly where your team is overspending on AI tools.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}