'use client';

import { useEffect } from 'react';

export default function RightClickProtector() {
  useEffect(() => {
    // Fungsi untuk memblokir klik kanan secara global di browser
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    
    // Membersihkan event listener ketika komponen tidak digunakan
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return null; // Komponen ini tidak menampilkan wujud UI (invisible)
}