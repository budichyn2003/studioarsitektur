import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, ArrowUpRight } from "lucide-react";

import { Metadata } from 'next';

// Fungsi otomatis Next.js untuk membuat meta tags dinamis
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  const newsItem = await prisma.news.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!newsItem) return { title: 'News Not Found' };

  return {
    title: newsItem.title,
    description: newsItem.contentId?.substring(0, 160) || 'Read the latest news from Studio Gigih.',
    openGraph: {
      title: newsItem.title,
      description: newsItem.contentId?.substring(0, 160) || 'Read the latest news from Studio Gigih.',
      images: newsItem.thumbnailUrl ? [newsItem.thumbnailUrl] : ['/gigih.png'],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsId = resolvedParams.id;

  if (!newsId) return notFound();

  const newsItem = await prisma.news.findUnique({
    where: { id: newsId },
  });

  if (!newsItem) return notFound();

  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(newsItem.publishDate));
  
  const imagesCollection = newsItem.imageUrls && newsItem.imageUrls.length > 0 ? newsItem.imageUrls : (newsItem.thumbnailUrl ? [newsItem.thumbnailUrl] : []);

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 bg-white">
      
      <Link href="/news" className="inline-flex items-center gap-2 text-[#999999] hover:text-black transition-colors mb-8 text-[13px] uppercase tracking-wider font-medium">
        <ArrowLeft size={14} /> Back to News
      </Link>

      <div className="w-full max-w-5xl flex flex-col gap-10">
        
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-6">
          <h1 className="text-black text-[28px] md:text-[36px] font-bold tracking-tight uppercase leading-tight">
            {newsItem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-[#999999] text-[13px]">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{newsItem.author || "Admin"}</span>
            </div>
          </div>
        </div>

        {imagesCollection.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {imagesCollection.map((url, index) => (
              <div key={index} className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <img 
                  src={url} 
                  alt={`${newsItem.title} - Visual ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        )}

        {/* AREA KONTEN DENGAN FITUR SHOW MORE / SHOW LESS */}
        <div className="relative w-full max-w-3xl text-[#444444] text-[15px] md:text-[16px] leading-[1.8] text-justify whitespace-pre-wrap">
          <input type="checkbox" id="news-desc-toggle" className="peer hidden" />
          
          <div className="line-clamp-[8] md:line-clamp-[10] peer-checked:line-clamp-none transition-all duration-300">
            {newsItem.contentId}
          </div>
          
          <label htmlFor="news-desc-toggle" className="text-black font-semibold text-[11px] uppercase tracking-widest cursor-pointer block mt-4 peer-checked:hidden hover:opacity-70 w-fit">
            + Show More
          </label>
          <label htmlFor="news-desc-toggle" className="text-black font-semibold text-[11px] uppercase tracking-widest cursor-pointer hidden mt-4 peer-checked:block hover:opacity-70 w-fit">
            - Show Less
          </label>
        </div>

        {/* TOMBOL CONTINUE TO WEBSITE (Dengan Layout yang Rapi) */}
        {newsItem.externalLink && (
          <div className="w-full max-w-3xl border-t border-gray-100 pt-8 mt-2">
            <a 
              href={newsItem.externalLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-sm font-medium hover:bg-neutral-800 transition-all text-[12px] uppercase tracking-widest w-full sm:w-auto"
            >
              Continue to Website <ArrowUpRight size={16} />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}