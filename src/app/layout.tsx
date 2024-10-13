import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import SidebarNav from "@/components/SidebarNav";
import HeaderNav from "@/components/HeaderNav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full bg-[#FAFAFA] text-black flex ",
          inter.className,
          { "debug-screens": process.env.NODE_ENV === "development" }
        )}
      >
        <Toaster />
        <aside className="hidden min-h-screen bg-[#F7F8FA] md:block border-r md:w-[80px] transition-all duration-300">
          <SidebarNav />
        </aside>
        <main className="flex-1">
          <HeaderNav />
          {children}
        </main>
      </body>
    </html>
  );
}
