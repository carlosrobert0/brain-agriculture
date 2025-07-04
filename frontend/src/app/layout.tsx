import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AppProvider } from "@/context/app-context";
import { MobileMenu } from "@/components/mobile-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brain Agriculture - Gestão de Produtores Rurais",
  description: "Sistema de cadastro e gestão de produtores rurais, fazendas, safras e culturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <AppProvider>
          <div className="flex h-screen bg-gray-50 w-screen">
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            <div className="flex md:hidden">
              <MobileMenu />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              <Header />
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
