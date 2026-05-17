'use client';

import { useState, useEffect } from 'react';
// 1. KITA HAPUS FRAMER MOTION DARI SINI
import Image from 'next/image';
import { getHomepageSettings } from '@/app/actions/homepage';

export default function HomePage() {
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  ]);
  const [delay, setDelay] = useState(3000);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, delay);
    
    return () => clearInterval(timer);
  }, [images, delay]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white flex items-center justify-center lg:justify-start">
      
      {/* Watermark "N" Raksasa (Diganti jadi div biasa, efeknya tetap sama) */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:bottom-[-50px] lg:left-[45%] lg:translate-y-0 text-[350px] md:text-[400px] lg:text-[600px] xl:text-[700px] font-bold text-[#F5F5F5] select-none z-0 leading-none tracking-tighter animate-pulse"
      >
        N
      </div>

      {/* Gambar Hero (Efek transisi dipindah ke Tailwind murni) */}
      <div className="absolute 
        /* --- SETTINGAN MOBILE (HP) --- */
        left-6 right-6 top-[120px] bottom-[100px] h-auto w-auto rounded-lg
        /* --- SETTINGAN DESKTOP (LAPTOP) --- */
        lg:left-auto lg:right-10 xl:right-16 lg:top-12 xl:top-16 lg:bottom-12 xl:bottom-16 lg:h-auto lg:w-[55%] lg:rounded-none
        z-10 shadow-2xl overflow-hidden bg-gray-50"
      >
        {images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            // 2. INI KUNCI ANIMASI MURNI TAILWIND (Tanpa Framer Motion)
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image 
              src={img}
              alt={`Architecture Hero ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        ))}
      </div>

    </div>
  );
}