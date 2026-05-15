'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    // Menambahkan margin kiri agar berjarak dari Sidebar dan menghapus padding atas yang terlalu besar
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full min-h-screen pt-20 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col"
    >
      
      {/* Area Teks Deskripsi (Digeser ke atas karena Hero Image Dihapus) */}
      <div className="w-full max-w-4xl mb-24">
        <h2 className="text-[#999999] text-[14px] font-medium tracking-[0.2em] uppercase mb-10">
          SAYAGGH
        </h2>
        
        <div className="flex flex-col gap-8 text-[#333333] text-[15px] md:text-[16px] leading-[1.8] text-justify">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* Area Thumbnail Bawah (Grid 4 Kolom di Desktop, 2 Kolom di HP) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-auto">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="relative w-full aspect-[4/3] bg-gray-50 rounded-sm overflow-hidden">
            <Image 
              src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=${index}`}
              alt={`About Us Thumbnail ${index}`}
              fill
              className="object-cover object-center transition-transform hover:scale-105 duration-700"
            />
          </div>
        ))}
      </div>

    </motion.div>
  );
}