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
    return <div className="absolute inset-0 w-full h-full bg-white"></div>;
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
      
      {/* 🛠️ PANDUAN MENGGESER WATERMARK 🛠️
        - Geser Kanan/Kiri : Ubah angka "left-[55%]" (HP) dan "lg:left-[42%]" (Laptop). Makin besar angkanya, makin ke kanan.
        - Geser Atas/Bawah : Ubah angka "bottom-[0px]" (HP) dan "lg:bottom-[20px]" (Laptop). Makin besar angkanya (plus), makin naik ke atas.
      */}
      <div 
        className="absolute left-[55%] lg:left-[50%] bottom-[0px] lg:bottom-[20px] xl:bottom-[30px] -translate-x-1/2 w-[180px] h-[180px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px] select-none z-0 opacity-7 pointer-events-none"
      
      >
        <Image src="/watermarkblack.png" alt="Watermark" fill className="object-contain" priority />
      </div>

      {/* SLIDESHOW GAMBAR - DIRAMPINGKAN (LEBAR DIPERKECIL + RASIO 1:2) */}
      <div className="absolute right-[2%] lg:right-[4%] top-1/2 -translate-y-1/2 w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[40%] h-auto lg:h-[92vh] aspect-[1/2] z-10 bg-gray-30 overflow-hidden">
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