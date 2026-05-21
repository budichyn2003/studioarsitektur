import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, ArrowUpRight } from "lucide-react";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsId = resolvedParams.id;

  if (!newsId) return notFound();

  const newsItem = await prisma.news.findUnique({
    where: { id: newsId },
  });

  if (!newsItem) return notFound();

  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(newsItem.publishDate));
  
  // Ambil kumpulan multi-images (jika kosong, fallback ke thumbnail)
  const imagesCollection = newsItem.imageUrls && newsItem.imageUrls.length > 0 ? newsItem.imageUrls : (newsItem.thumbnailUrl ? [newsItem.thumbnailUrl] : []);

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 bg-white">
      
      <Link href="/news" className="inline-flex items-center gap-2 text-[#999999] hover:text-black transition-colors mb-8 text-[13px] uppercase tracking-wider font-medium">
        <ArrowLeft size={14} /> Back to News
      </Link>

      <div className="w-full max-w-5xl flex flex-col gap-10">
        
        {/* Informasi Meta Berita */}
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

        {/* AREA GRID MULTIPLE IMAGES (Ukuran diperkecil secara proporsional & nyaman dilihat) */}
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

        {/* Area Teks Konten */}
        <div className="w-full max-w-3xl text-[#444444] text-[15px] md:text-[16px] leading-[1.8] text-justify whitespace-pre-wrap">
          {newsItem.contentId}
        </div>

        {newsItem.externalLink && (
          <a href={newsItem.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-black font-semibold hover:text-gray-600 transition-colors w-max border-b border-black pb-0.5 text-[13px] uppercase tracking-wider">
            Go to website <ArrowUpRight size={14} />
          </a>
        )}

      </div>
    </div>
  );
}