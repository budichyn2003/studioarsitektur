'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { setLanguage } from '@/app/actions/language';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State untuk menyimpan bahasa aktif (Default: ENG)
  const [activeLang, setActiveLang] = useState<'ENG' | 'IND'>('ENG');

  // Baca cookie di sisi klien saat pertama kali load
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      const lang = localeCookie.split('=')[1] as 'ENG' | 'IND';
      setActiveLang(lang);
    }
  }, []);

  const handleLanguageChange = async (lang: 'ENG' | 'IND') => {
    setActiveLang(lang);
    await setLanguage(lang);
    // Refresh halaman agar Server Components mengambil data bahasa yang baru
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
    <aside className="w-[300px] h-screen fixed left-0 top-0 flex flex-col pt-12 pb-10 px-12 bg-white z-50">
      
      {/* Logo Section (Sudah dibungkus dengan Link menuju Homepage /) */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="w-[42px] h-[42px] bg-arch-black text-white flex items-center justify-center font-bold text-2xl tracking-tighter">
          N
        </div>
        <span className="text-arch-black font-medium text-[16px] tracking-wide">Architecture</span>
      </Link>

      {/* Main Navigation */}
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

      {/* Language Switcher Dinamis */}
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
  );
}
