'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getHomepageSettings } from '@/app/actions/homepage';

export default function HomePage() {
  // Default fallback jika database masih kosong
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  ]);
  const [delay, setDelay] = useState(3000);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mengambil gambar dari Database
  useEffect(() => {
    getHomepageSettings().then(res => {
      if (res.success && res.data) {
        if (res.data.imageUrls && res.data.imageUrls.length > 0) {
          setImages(res.data.imageUrls);
        }
        if (res.data.delayTimer) {
          setDelay(res.data.delayTimer);
        }
      }
    });
  }, []);

  // Mesin penggerak Slider Otomatis
  useEffect(() => {
    if (images.length <= 1) return; // Jangan jalan kalau gambar cuma 1
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, delay);
    
    return () => clearInterval(timer);
  }, [images, delay]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      
      {/* Watermark "N" Raksasa */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute left-[8%] bottom-[-8%] text-[500px] font-bold text-[#F5F5F5] select-none -z-10 leading-none"
      >
        N
      </motion.div>

      {/* Gambar Hero Kanan (Crossfade Animation) */}
      <div className="absolute right-0 top-0 w-[60%] h-full bg-gray-50">
        {images.map((img, index) => (
          <motion.div
            key={`${img}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }} // Transisi pudar 1.5 detik yang elegan
            className="absolute inset-0 w-full h-full"
          >
            <Image 
              src={img}
              alt={`Architecture Hero ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              sizes="60vw"
            />
          </motion.div>
        ))}
      </div>

    </div>
  );
}