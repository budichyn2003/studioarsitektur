'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { setLanguage } from '@/app/actions/language';

// PERHATIKAN: Kita sudah membuang import 'framer-motion' sepenuhnya!

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeLang, setActiveLang] = useState<'ENG' | 'IND'>('ENG');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      const lang = localeCookie.split('=')[1] as 'ENG' | 'IND';
      setActiveLang(lang);
    }
  }, []);

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

  const handleLanguageChange = async (lang: 'ENG' | 'IND') => {
    setActiveLang(lang);
    await setLanguage(lang);
    router.refresh(); 
  };

  const navItems = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Project', path: '/project' },
    { name: 'News', path: '/news' },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    // Tambahkan suppressHydrationWarning untuk membungkam peringatan sisa Next.js DevTools
    <div id="sidebar-root" className="relative z-50" suppressHydrationWarning>
      
      {/* ========================================= */}
      {/* 1. VERSI DESKTOP (Sidebar Kiri)           */}
      {/* ========================================= */}
      <aside className="hidden lg:flex w-[300px] h-screen fixed left-0 top-0 flex-col pt-12 pb-10 px-12 bg-white">
        {/* Perbaikan HTML Nesting: Gunakan Link dan tag span */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="w-[42px] h-[42px] bg-arch-black text-white flex items-center justify-center font-bold text-2xl tracking-tighter">
            N
          </span>
          <span className="text-arch-black font-medium text-[16px] tracking-wide">Architecture</span>
        </Link>

        <nav className="flex-grow flex flex-col justify-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === '/' && item.path === '/about-us' ? false : pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-[24px] transition-colors duration-300 ${
                  isActive ? 'text-arch-black font-medium' : 'text-arch-grayMenu hover:text-arch-black'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <svg className="w-5 h-5 text-arch-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex gap-3 text-[14px]">
            <button 
              onClick={() => handleLanguageChange('ENG')}
              className={`transition-colors ${activeLang === 'ENG' ? 'text-arch-black font-medium' : 'text-arch-grayMenu font-light hover:text-arch-black'}`}
            >
              ENG
            </button>
            <button 
              onClick={() => handleLanguageChange('IND')}
              className={`transition-colors ${activeLang === 'IND' ? 'text-arch-black font-medium' : 'text-arch-grayMenu font-light hover:text-arch-black'}`}
            >
              IND
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================= */}
      {/* 2. VERSI MOBILE (Header Atas & Burger)    */}
      {/* ========================================= */}
      <header className="lg:hidden fixed top-0 left-0 w-full h-[80px] bg-white/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-100 z-[60]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="w-[36px] h-[36px] bg-arch-black text-white flex items-center justify-center font-bold text-xl tracking-tighter">
            N
          </span>
          <span className="text-arch-black font-medium text-[15px] tracking-wide">Architecture</span>
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
      {/* 3. MOBILE MENU OVERLAY (PURE CSS TAILWIND)*/}
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
                  className={`text-[28px] transition-colors duration-300 block ${
                    isActive ? 'text-arch-black font-medium' : 'text-arch-grayMenu hover:text-arch-black'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-auto">
          <div className="flex items-center gap-3 text-arch-grayMenu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[15px]">Language</span>
          </div>
          <div className="flex gap-4 text-[16px] bg-gray-50 px-4 py-2 rounded-full">
            <button
              onClick={() => handleLanguageChange('ENG')}
              className={`transition-colors ${activeLang === 'ENG' ? 'text-arch-black font-medium' : 'text-arch-grayMenu font-light hover:text-arch-black'}`}
            >
              ENG
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleLanguageChange('IND')}
              className={`transition-colors ${activeLang === 'IND' ? 'text-arch-black font-medium' : 'text-arch-grayMenu font-light hover:text-arch-black'}`}
            >
              IND
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}