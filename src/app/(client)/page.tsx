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
      
      {/* WATERMARK */}
      <div 
        className="absolute left-[50%] bottom-[20px] lg:bottom-[20px] xl:bottom-[30px] -translate-x-1/2 w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px] select-none z-0 opacity-10 pointer-events-none"
      >
        <Image src="/watermarkblack.png" alt="Watermark" fill className="object-contain" priority />
      </div>

      {/* SLIDESHOW GAMBAR (PERBAIKAN FINAL MOBILE & TABLET): 
        - Mobile & Tablet: Tetap di tengah (left-1/2), ditarik agar lebih panjang ke atas & bawah (h-[78vh] & h-[82vh]).
        - Laptop (lg / xl): Menempel ke kanan (lg:right-[4%]), layout dikembalikan ke posisi original.
      */}
      <div className="absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 right-auto lg:right-[4%] top-[54%] lg:top-1/2 -translate-y-1/2 w-[92%] md:w-[88%] lg:w-[45%] xl:w-[40%] h-[78vh] md:h-[82vh] lg:h-[92vh] z-10 bg-gray-50 overflow-hidden shadow-xl lg:shadow-none transition-all duration-300">
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