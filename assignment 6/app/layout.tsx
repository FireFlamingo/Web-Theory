import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClassForge — UML to Java",
  description: "Design UML class diagrams visually and generate Java source code instantly.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
