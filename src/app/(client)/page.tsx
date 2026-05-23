'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getHomepageSettings } from '@/app/actions/homepage';

export default function HomePage() {
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  ]);
  const [delay, setDelay] = useState(3000);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroDesc, setHeroDesc] = useState("Selected Project Showcase — Minimalist Residential Space.");

  useEffect(() => {
    getHomepageSettings().then(res => {
      if (res.success && res.data) {
        if (res.data.imageUrls && res.data.imageUrls.length > 0) {
          setImages(res.data.imageUrls);
        }
        if (res.data.delayTimer) {
          setDelay(res.data.delayTimer);
        }
        if ((res.data as any).heroDescription) {
          setHeroDesc((res.data as any).heroDescription);
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
      
      {/* Watermark "N" Raksasa */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:bottom-[-50px] lg:left-[45%] lg:translate-y-0 text-[350px] md:text-[400px] lg:text-[600px] xl:text-[700px] font-bold text-[#F5F5F5] select-none z-0 leading-none tracking-tighter animate-pulse"
      >
        N
      </div>

      {/* ========================================================================================= */}
      {/* 🛠️ PANDUAN EDIT UKURAN / RATIO / POSITIONING (LIHAT CLASS DI DIV BAWAH INI) 🛠️            */}
      {/* - Mengubah Jarak dari Kanan Layar Desktop : Ganti 'lg:right-16 xl:right-32'                 */}
      {/* - Mengubah Lebar Bingkai Foto Portrait    : Ganti 'lg:w-[380px] xl:w-[420px]'              */}
      {/* ========================================================================================= */}
      <div className="absolute z-10 flex flex-col gap-4 w-full px-6 lg:px-0 lg:right-16 xl:right-32 lg:top-1/2 lg:-translate-y-1/2 lg:w-[380px] xl:w-[420px]">
        
        {/* Bingkai Foto Hero Portrait 
           Jika ingin mengubah Aspect Ratio, ganti class 'aspect-[3/4]' di bawah ini:
           - aspect-[3/4] = Portrait Standar (Saran Client)
           - aspect-[4/5] = Portrait Lebih Meninggi
           - aspect-[1/1] = Kotak Sempurna
        */}
        <div className="relative w-full aspect-[3/4] shadow-2xl overflow-hidden bg-gray-50 rounded-sm">
          {images.map((img, index) => (
            <div
              key={`${img}-${index}`}
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
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>
          ))}
        </div>

        {/* Komponen Deskripsi / Caption Foto Hero */}
        <div className="w-full text-center lg:text-left text-[#777777] text-[13px] md:text-[14px] leading-relaxed font-light tracking-wide px-2 lg:px-0">
          {heroDesc}
        </div>

      </div>

    </div>
  );
}