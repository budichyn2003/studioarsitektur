'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getHomepageSettings } from '@/app/actions/homepage';

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
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

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] lg:text-[900px] font-bold text-[#F9F9F9] select-none z-0 leading-none tracking-tighter animate-pulse">N</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
      
      {/* WATERMARK "N" - TIDAK DIUBAH */}
      <div 
        className="absolute left-[50%] lg:left-[35%] bottom-[-40px] lg:bottom-[-70px] xl:bottom-[-90px] -translate-x-1/2 text-[250px] lg:text-[450px] xl:text-[550px] font-bold text-[#F9F9F9] select-none z-0 leading-none tracking-tighter"
      >
        N
      </div>

      {/* SLIDESHOW GAMBAR - DIPERBESAR (SEMAKIN KE TEPI, MEMPERKECIL RUANG KOSONG) */}
      <div className="absolute right-[2%] lg:right-[2%] top-1/2 -translate-y-1/2 w-[96%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[65%] h-auto lg:h-[92vh] aspect-[3/4] z-10 bg-gray-50 overflow-hidden shadow-2xl">
        {images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image 
              src={img}
              alt={`Architecture Hero ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

    </div>
  );
}