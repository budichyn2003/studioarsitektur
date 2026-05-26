'use client';
import Link from 'next/link';
import Image from 'next/image'; // <-- TAMBAHAN IMPORT UNTUK LOGO
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// ==========================================
// CUSTOM SVG ICONS (Aman dari error versi lama)
// ==========================================
const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socials, setSocials] = useState<any>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  // Fetch data social media icon
  useEffect(() => {
    fetch('/api/social-client')
      .then(res => res.json())
      .then(res => { if (res.success && res.data) setSocials(res.data); })
      .catch(() => {}); // Abaikan jika error agar tidak merusak layout
  }, []);

  const navItems = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Project', path: '/project' },
    { name: 'News', path: '/news' },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div id="sidebar-root" className="relative z-50" suppressHydrationWarning>
      
      {/* ========================================= */}
      {/* 1. VERSI DESKTOP (Sidebar Kiri)           */}
      {/* ========================================= */}
      <aside className="hidden lg:flex w-[300px] h-screen fixed left-0 top-0 flex-col pt-12 pb-10 px-12 bg-white border-r border-gray-50">
        
        {/* LOGO (Di Atas) - SUDAH DIGANTI LOGO GIGIH */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
          <Image 
            src="/studiogigih.png" 
            alt="Studio Gigih Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-arch-black font-medium text-[15px] tracking-wide">Studio Gigih</span>
        </Link>

        {/* MENU NAVIGASI (Flex-grow memastikan dia selalu di tengah-tengah layar) */}
        <nav className="flex-grow flex flex-col justify-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === '/' && item.path === '/about-us' ? false : pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                href={item.path}
                // Font dikecilkan menjadi 18px
                className={`text-[18px] transition-colors duration-300 ${
                  isActive ? 'text-arch-black font-medium' : 'text-arch-grayMenu hover:text-arch-black'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* SOCIAL MEDIA ICONS (Di Bawah) */}
        {socials && (
          <div className="flex items-center gap-4 text-[#999999] flex-shrink-0 pt-4">
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><InstagramIcon size={18} /></a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><YoutubeIcon size={20} /></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><LinkedinIcon size={18} /></a>}
          </div>
        )}
      </aside>

      {/* ========================================= */}
      {/* 2. VERSI MOBILE (Header Atas & Burger)    */}
      {/* ========================================= */}
      <header className="lg:hidden fixed top-0 left-0 w-full h-[80px] bg-white/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-100 z-[60]">
        
        {/* LOGO MOBILE - SUDAH DIGANTI LOGO GIGIH */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <Image 
            src="/gigih.png" 
            alt="Studio Gigih Logo" 
            width={36} 
            height={36} 
            className="object-contain"
          />
          <span className="text-arch-black font-medium text-[15px] tracking-wide">Studio Gigih</span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-arch-black hover:opacity-70 transition-opacity focus:outline-none relative z-[70]"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          )}
        </button>
      </header>

      {/* ========================================= */}
      {/* 3. MOBILE MENU OVERLAY                    */}
      {/* ========================================= */}
      <div 
        className={`lg:hidden fixed inset-0 w-full h-[100dvh] bg-white flex flex-col pt-[100px] px-8 pb-10 z-[55] transform transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex-grow flex flex-col gap-8 mt-10">
          {navItems.map((item) => {
            const isActive = pathname === '/' && item.path === '/about-us' ? false : pathname.startsWith(item.path);
            return (
              <div key={item.name}>
                <Link
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  // Font mobile dikecilkan jadi 22px
                  className={`text-[22px] transition-colors duration-300 block ${
                    isActive ? 'text-arch-black font-medium' : 'text-arch-grayMenu hover:text-arch-black'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* SOCIAL MEDIA ICONS (Mobile - Di Bawah) */}
        {socials && (
          <div className="flex items-center gap-6 text-[#999999] mt-auto">
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><InstagramIcon size={22} /></a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><YoutubeIcon size={24} /></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><LinkedinIcon size={22} /></a>}
          </div>
        )}
      </div>

    </div>
  );
}