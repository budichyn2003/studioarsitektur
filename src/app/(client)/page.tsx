'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      
      {/* Watermark "N" Raksasa */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute left-[8%] bottom-[-8%] text-[500px] font-bold text-arch-hover select-none -z-10 leading-none"
      >
        N
      </motion.div>

      {/* Gambar Hero Kanan */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute right-0 top-0 w-[60%] h-full"
      >
        <Image 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Architecture Hero"
          fill
          className="object-cover object-center"
          priority
          sizes="60vw"
        />
      </motion.div>

    </div>
  );
}