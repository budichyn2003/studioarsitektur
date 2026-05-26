import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RightClickProtector from "@/components/layout/RightClickProtector";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata = {
  title: 'Studio Gigih | Architecture Portfolio',
  description: 'Portfolio of Studio Gigih Architecture',
  // TAMBAHKAN KODE INI UNTUK MENGGANTI LOGO TAB BROWSER:
  icons: {
    icon: '/gigih.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} text-arch-grayText bg-white antialiased min-h-screen`}>
        {/* Komponen pelindung klik kanan berjalan secara diam-diam di background */}
        <RightClickProtector />
        {children}
      </body>
    </html>
  );
}