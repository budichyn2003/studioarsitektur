'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAboutSettings } from '@/app/actions/about';

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    showHero: true,
    title: 'ABOUT US',
    content: '',
    heroUrl: '',
    thumbnails: [] as string[]
  });

  useEffect(() => {
    getAboutSettings().then(res => {
      if (res.success && res.data) {
        setSettings({
          showHero: res.data.showHero,
          title: res.data.title,
          content: res.data.content,
          heroUrl: res.data.heroUrl,
          thumbnails: res.data.thumbnails
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center mt-20 text-gray-400">Loading About Content...</div>; 

  return (
    <div className="w-full min-h-screen pt-20 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col transition-opacity duration-500 opacity-100">
      
      {/* AREA HERO BESAR */}
      {settings.showHero && settings.heroUrl && (
        <div className="relative w-full h-[300px] md:h-[450px] mb-16 rounded-sm overflow-hidden bg-gray-50">
          <Image 
            src={settings.heroUrl}
            alt="About Us Hero"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
        </div>
      )}

      {/* Area Teks Deskripsi */}
      <div className={`w-full max-w-4xl ${settings.showHero ? 'mb-20' : 'mb-24'}`}>
        <h2 className="text-[#999999] text-[14px] font-medium tracking-[0.2em] uppercase mb-10">
          {settings.title}
        </h2>
        
        <div className="text-[#333333] text-[15px] md:text-[16px] leading-[1.8] text-justify whitespace-pre-wrap">
          {settings.content}
        </div>
      </div>

      {/* Area Thumbnail Koleksi Gambar Bawah */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-auto pt-8">
        {settings.thumbnails.map((src, index) => (
          <div key={index} className="relative w-full aspect-[4/3] bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
            <Image 
              src={src}
              alt={`About Us Thumbnail ${index + 1}`}
              fill
              className="object-cover object-center transition-transform hover:scale-105 duration-700"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          </div>
        ))}
      </div>

    </div>
  );
}