'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Briefcase,
  LogOut
} from 'lucide-react';

import { logoutAdmin } from '@/app/actions/auth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/login');
    router.refresh();
  };

  const adminMenu = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },

    {
      name: 'Manage Projects',
      path: '/admin/projects',
      icon: <FolderKanban size={20} />
    },

    {
      name: 'Manage News',
      path: '/admin/news',
      icon: <Newspaper size={20} />
    },

    {
      name: 'Manage Careers',
      path: '/admin/careers',
      icon: <Briefcase size={20} />
    },
  ];

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col py-8 px-6 z-50">

      {/* Logo Admin */}
      <div className="flex items-center gap-3 mb-12 px-4">
        <div className="w-10 h-10 bg-arch-black text-white flex items-center justify-center font-bold text-xl">
          N
        </div>

        <div className="flex flex-col">
          <span className="text-arch-black font-bold text-[16px] leading-tight">
            Admin Panel
          </span>

          <span className="text-arch-grayMenu text-[12px]">
            StackPlus CMS
          </span>
        </div>
      </div>

      {/* Menu Navigasi Admin */}
      <nav className="flex flex-col gap-2 flex-grow">
        {adminMenu.map((item) => {
          // Highlight menu aktif
          // (Cek exact match untuk dashboard, includes untuk yang lain)

          const isActive =
            item.path === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-arch-black text-white shadow-md'
                  : 'text-arch-grayText hover:bg-gray-100 hover:text-arch-black'
              }`}
            >
              {item.icon}

              <span className="font-medium text-[15px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Tombol Logout */}
      <div className="mt-auto border-t border-gray-100 pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />

          <span className="font-medium text-[15px]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}