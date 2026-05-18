'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <aside className="hidden lg:flex w-[300px] h-screen fixed left-0 top-0 flex-col pt-12 pb-10 px-12 bg-white">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="w-[40px] h-[40px] bg-arch-black text-white flex items-center justify-center font-bold text-xl tracking-tighter">
            N
          </span>
          <span className="text-arch-black font-medium text-[15px] tracking-wide">Architecture</span>
        </Link>

        <nav className="flex-grow flex flex-col justify-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === '/' && item.path === '/about-us' ? false : pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                href={item.path}
                // Font dikecilkan menjadi 18px (sebelumnya 24px)
                className={`text-[18px] transition-colors duration-300 ${
                  isActive ? 'text-arch-black font-medium' : 'text-arch-grayMenu hover:text-arch-black'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
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
      </div>

    </div>
  );
}