'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CareerListPage() {
  const [careers, setCareers] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // Fetch data ke endpoint API agar pagination berjalan mulus 1 viewport
    fetch('/api/career-client')
      .then(res => res.json())
      .then(data => {
        if (data.careers) setCareers(data.careers);
        if (data.banner) setBannerUrl(data.banner);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCareers = careers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(careers.length / itemsPerPage);

  return (
    // PENTING: Dikunci h-[100dvh] overflow-hidden agar 100% pas 1 layar tanpa scroll
    <div className="w-full h-[100dvh] overflow-hidden pt-24 pb-6 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col justify-between bg-white">
      
      <div className="flex flex-col flex-grow overflow-hidden">
        
        {/* Typography judul tebal disamakan dengan About Us */}
        <h1 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase mb-6 flex-shrink-0">
          Join Our Team
        </h1>

        {/* Grid List Card Career - Horizontal List (2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-4 w-full flex-grow overflow-hidden content-start">
          {currentCareers.map((career) => {
            const excerpt = career.description ? career.description.substring(0, 120) + '...' : '';

            return (
              <Link 
                href={`/career/${career.id}`} 
                key={career.id} 
                className="group flex flex-col justify-center bg-white border-b border-gray-100 pb-4 hover:border-black transition-colors duration-300 min-h-[100px] md:min-h-[120px]"
              >
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-black text-[15px] font-semibold tracking-tight uppercase line-clamp-1 leading-tight group-hover:text-gray-600 transition-colors">
                    {career.title}
                  </h2>
                  <div className="flex items-center gap-4 text-[#999999] text-[11px] mb-1 font-medium tracking-wider">
                    <span className="flex items-center gap-1.5"><Briefcase size={12} /> {career.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {career.location}</span>
                  </div>
                  <p className="text-[#777777] text-[13px] leading-relaxed text-justify line-clamp-2 pr-4">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}

          {careers.length === 0 && (
            <p className="text-[#999999] text-[14px] col-span-full py-10">Currently there are no open positions available.</p>
          )}
        </div>
      </div>

      {/* Bagian Bawah: Navigasi Pagination & Banner Landscape Besar */}
      <div className="flex flex-col gap-4 mt-2 flex-shrink-0">
        
        {totalPages > 1 && (
          <div className="flex items-center justify-start gap-4 text-sm z-20">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 text-[#999999] hover:text-black disabled:opacity-30 disabled:hover:text-[#999999] uppercase tracking-wider text-[11px] font-medium transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-gray-400 font-light font-mono">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 text-[#999999] hover:text-black disabled:opacity-30 disabled:hover:text-[#999999] uppercase tracking-wider text-[11px] font-medium transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Banner bawah dibuat sebesar halaman About Us (30vh) */}
        {bannerUrl && (
          <div className="w-full max-w-5xl">
            <div className="relative w-full h-[180px] md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm mt-1">
              <Image 
                src={bannerUrl} 
                alt="Career Banner" 
                fill 
                className="object-cover object-center transition-transform hover:scale-105 duration-700" 
                sizes="(max-width: 1024px) 100vw, 800px" 
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}