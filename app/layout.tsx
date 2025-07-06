import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eldeep TODO App",
  description: "Eldeep TODO App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Nav/>
            <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <ToastProvider/>
      </body>
    </html>
    </ClerkProvider>
  );
}
