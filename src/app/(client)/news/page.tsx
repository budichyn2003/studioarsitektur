'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function NewsListPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    fetch('/api/news-client')
      .then(res => res.json())
      .then(data => {
        if (data.news) setNewsList(data.news);
        if (data.banner) setBannerUrl(data.banner);
      });

    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 4);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    // PERBAIKAN FATAL: Menggunakan justify-between ketat dan kelas standar pt-24 (96px). 
    <div className="w-full h-[100dvh] overflow-hidden pt-24 lg:pt-32 pb-4 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col justify-between bg-white">
      
      {/* GRUP ATAS: Dikunci rapat tanpa flex-grow, sehingga judul pasti nempel ke atas */}
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-black text-[18px] md:text-[20px] font-bold tracking-[0.15em] uppercase m-0">
          Latest News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {currentNews.map((news) => {
            const formattedYear = new Date(news.publishDate).getFullYear();
            const excerpt = news.contentId ? news.contentId.substring(0, 120) + '...' : 'No content available.';

            return (
              <Link 
                href={`/news/${news.id}`} 
                key={news.id} 
                className="group flex flex-col justify-center bg-white border-b border-gray-100 pb-2 hover:border-black transition-colors duration-300"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#999999] text-[10px] md:text-[11px]">
                    <Calendar size={12} />
                    <span>{formattedYear}</span>
                  </div>
                  <h2 className="text-black text-[14px] md:text-[15px] font-semibold tracking-tight uppercase line-clamp-1 leading-tight group-hover:text-gray-600 transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-[#777777] text-[12px] md:text-[13px] leading-relaxed text-justify line-clamp-2 pr-4">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}

          {newsList.length === 0 && (
            <p className="text-[#999999] text-[14px] col-span-full py-5">No news published yet.</p>
          )}
        </div>
      </div>

      {/* GRUP BAWAH: Pagination dan Banner dikelompokkan ke paling dasar */}
      <div className="flex flex-col gap-3 w-full">
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

        {/* PERBAIKAN: Tinggi banner mobile dikunci di h-24 (96px) agar ruangnya pas absolut 1 layar */}
        {bannerUrl && (
          <div className="w-full max-w-5xl">
            <div className="relative w-full h-24 md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Image src={bannerUrl} alt="News Banner" fill className="object-cover object-center transition-transform hover:scale-105 duration-700" sizes="(max-width: 1024px) 100vw, 800px" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}