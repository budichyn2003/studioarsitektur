'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    // Menambahkan padding (px-20 py-16) agar konten rapi dan berjarak dari Sidebar
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full min-h-screen px-20 py-16 flex flex-col"
    >
      
      {/* 1. Area Hero Image Atas */}
      <div className="relative w-full h-[450px] mb-16">
        <Image 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
          alt="About Us Hero"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 2. Area Teks Deskripsi */}
      <div className="w-full max-w-5xl mb-20">
        <h2 className="text-arch-grayText text-[14px] font-semibold tracking-[0.15em] uppercase mb-8">
          SAYAGGH
        </h2>
        
        <div className="flex flex-col gap-8 text-arch-black text-[16px] leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* 3. Area Thumbnail Bawah (Grid 4 Kolom) */}
      <div className="grid grid-cols-4 gap-6 mt-auto">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="relative w-full aspect-[4/3]">
            {/* Menggunakan parameter acak sementara di URL gambar agar visualnya tidak monoton */}
            <Image 
              src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=${index}`}
              alt={`About Us Thumbnail ${index}`}
              fill
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

    </motion.div>
  );
}