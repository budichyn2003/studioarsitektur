import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RightClickProtector from "@/components/layout/RightClickProtector";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ==========================================
// KODE SEO BARU YANG SUDAH DIGABUNGKAN
// ==========================================
export const metadata: Metadata = {
  title: {
    // REVISI: Update SEO Title sesuai request
    default: 'Studio Gigih | Architecture, Interior, Landscape Design',
    template: '%s | Studio Gigih' 
  },
  description: 'Portfolio of Studio Gigih, specializing in residential, public, and installation architecture.',
  keywords: ['Architecture', 'Studio Gigih', 'Architect Jakarta', 'Desain Interior', 'Arsitektur Indonesia', 'Jasa Arsitek'],
  authors: [{ name: 'Studio Gigih' }],
  creator: 'Studio Gigih',
  metadataBase: new URL('https://www.studiogigih.com'),
  
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://www.studiogigih.com',
    // REVISI: Update OG Title juga agar sinkron saat di-share
    title: 'Studio Gigih | Architecture, Interior, Landscape Design',
    description: 'Explore the architectural masterpieces and innovative designs by Studio Gigih.',
    siteName: 'Studio Gigih',
    images: [
      {
        url: '/gigih.png',
        width: 1200,
        height: 630,
        alt: 'Studio Gigih Architecture',
      },
    ],
  },
  
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