'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function NewsListPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // Ambil data langsung di client side agar pagination terasa smooth 1 viewport
    fetch('/api/news-client')
      .then(res => res.json())
      .then(data => {
        if (data.news) setNewsList(data.news);
        if (data.banner) setBannerUrl(data.banner);
      });
  }, []);

  // Hitung kalkulasi index pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  return (
    // Dikunci h-[100dvh] overflow-hidden agar pas 1 layar monitor tanpa scroll vertikal
    <div className="w-full h-[100dvh] overflow-hidden pt-20 pb-6 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col justify-between bg-white">
      
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Typography judul tebal disamakan dengan About Us */}
        <h1 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase mb-6 flex-shrink-0">
          Latest News
        </h1>

        {/* Grid List Konten Berita (Compact Card Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full flex-grow overflow-hidden items-stretch">
          {currentNews.map((news) => {
            const formattedYear = new Date(news.publishDate).getFullYear();
            const excerpt = news.contentId ? news.contentId.substring(0, 90) + '...' : 'No content available.';

            return (
              <Link 
                href={`/news/${news.id}`} 
                key={news.id} 
                className="group flex flex-col justify-between bg-white border border-gray-200 rounded-sm p-5 hover:border-black transition-colors duration-300 h-full max-h-[42vh]"
              >
                <div className="flex flex-col gap-2 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[#999999] text-[12px]">
                    <Calendar size={13} />
                    <span>{formattedYear}</span>
                  </div>
                  
                  {/* Ukuran judul dibatasi tidak melebihi heading utama */}
                  <h2 className="text-black text-[15px] font-semibold tracking-tight uppercase line-clamp-2 leading-tight group-hover:text-gray-600 transition-colors">
                    {news.title}
                  </h2>
                  
                  <p className="text-[#666666] text-[13px] leading-relaxed text-justify line-clamp-3">
                    {excerpt}
                  </p>
                </div>
                
                {/* Gambar diletakkan di dalam/bawah card secara proporsional */}
                <div className="relative w-full aspect-[16/10] mt-3 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 flex-shrink-0">
                  {news.thumbnailUrl ? (
                    <img src={news.thumbnailUrl} alt={news.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400">No Image</div>
                  )}
                </div>
              </Link>
            );
          })}

          {newsList.length === 0 && (
            <p className="text-[#999999] text-[14px] col-span-full py-10">No news published yet.</p>
          )}
        </div>
      </div>

      {/* Bagian Bawah: Navigasi Pagination & Banner Landscape Pendek */}
      <div className="flex flex-col gap-4 mt-4 flex-shrink-0">
        
        {/* Tombol Kontrol Halaman (Hanya muncul jika item > 4) */}
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

        {/* Banner Landscape Bagian Bawah */}
        {bannerUrl && (
          <div className="w-full max-w-5xl">
            <div className="relative w-full h-[60px] md:h-[80px] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Image src={bannerUrl} alt="News Banner" fill className="object-cover object-center" sizes="80vw" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}