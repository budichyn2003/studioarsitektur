'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function NewsListPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // REVISI: Mengatur itemsPerPage menjadi dinamis (2 untuk HP, 4 untuk Tablet/Desktop)
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    fetch('/api/news-client')
      .then(res => res.json())
      .then(data => {
        if (data.news) setNewsList(data.news);
        if (data.banner) setBannerUrl(data.banner);
      });

    // Deteksi ukuran layar secara real-time
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 4);
    };
    handleResize(); // Set saat pertama mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  // Mencegah error / halaman kosong jika pindah orientasi device
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full h-[100dvh] overflow-hidden pt-24 pb-6 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col justify-between bg-white">
      
      <div className="flex flex-col flex-grow overflow-hidden">
        <h1 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase mb-6 flex-shrink-0">
          Latest News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-4 w-full flex-grow overflow-hidden content-start">
          {currentNews.map((news) => {
            const formattedYear = new Date(news.publishDate).getFullYear();
            const excerpt = news.contentId ? news.contentId.substring(0, 120) + '...' : 'No content available.';

            return (
              <Link 
                href={`/news/${news.id}`} 
                key={news.id} 
                className="group flex flex-col justify-center bg-white border-b border-gray-100 pb-4 hover:border-black transition-colors duration-300 min-h-[100px] md:min-h-[120px]"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#999999] text-[11px] mb-1">
                    <Calendar size={12} />
                    <span>{formattedYear}</span>
                  </div>
                  <h2 className="text-black text-[15px] font-semibold tracking-tight uppercase line-clamp-1 leading-tight group-hover:text-gray-600 transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-[#777777] text-[13px] leading-relaxed text-justify line-clamp-2 pr-4">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}

          {newsList.length === 0 && (
            <p className="text-[#999999] text-[14px] col-span-full py-10">No news published yet.</p>
          )}
        </div>
      </div>

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

        {bannerUrl && (
          <div className="w-full max-w-5xl">
            <div className="relative w-full h-[180px] md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm mt-1">
              <Image src={bannerUrl} alt="News Banner" fill className="object-cover object-center transition-transform hover:scale-105 duration-700" sizes="(max-width: 1024px) 100vw, 800px" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}