import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOXA — AI agents that close the loop",
  description: "Voice and chat agents built for every revenue team."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
