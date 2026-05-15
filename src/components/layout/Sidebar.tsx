'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Project', path: '/project' },
    { name: 'News', path: '/news' },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <aside className="w-[300px] h-screen fixed left-0 top-0 flex flex-col pt-12 pb-10 px-12 bg-white z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] bg-arch-black text-white flex items-center justify-center font-bold text-2xl tracking-tighter">
          N
        </div>
        <span className="text-arch-black font-medium text-[16px] tracking-wide">Architecture</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-6 mt-[120px]">
        {navItems.map((item) => {
          // Highlight menu jika sedang aktif
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

      {/* Language Switcher */}
      <div className="flex items-center gap-4 mt-auto">
        <svg className="w-5 h-5 text-arch-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex gap-3 text-[14px]">
          <button className="text-arch-black font-medium">ENG</button>
          <span className="text-arch-grayMenu font-light">IND</span>
        </div>
      </div>
    </aside>
  );
}