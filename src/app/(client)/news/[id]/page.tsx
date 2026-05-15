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

  return (
    <div className="w-full min-h-screen pt-8 pb-20 pl-8 md:pl-24 lg:pl-[20%] pr-8 md:pr-16">
      
      <Link href="/news" className="inline-flex items-center gap-2 text-[#999999] hover:text-black transition-colors mb-10 text-[14px]">
        <ArrowLeft size={16} /> Back to News
      </Link>

      {/* DUA KOLOM LENGKAP: Kiri (Gambar), Kanan (Konten) */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* KOLOM KIRI: Gambar */}
        <div className="w-full lg:w-[45%] flex items-start">
          {newsItem.thumbnailUrl ? (
            <img 
              src={newsItem.thumbnailUrl} 
              alt={newsItem.title} 
              // w-full dan h-auto membuat gambar menyesuaikan orientasi aslinya tanpa terpotong
              className="w-full h-auto object-contain bg-gray-50 rounded-sm"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 rounded-sm">
              No Image Available
            </div>
          )}
        </div>

        {/* KOLOM KANAN: Detail & Teks */}
        <div className="w-full lg:w-[55%] flex flex-col">
          
          {/* Tanggal & Penulis */}
          <div className="flex flex-wrap items-center gap-6 text-[#999999] text-[14px] mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{newsItem.author || "StackPlus Team"}</span>
            </div>
          </div>

          {/* Judul Berita */}
          <h1 className="text-black text-[32px] md:text-[40px] font-medium tracking-tight mb-8 leading-tight">
            {newsItem.title}
          </h1>

          {/* Isi Konten (Paragraf) */}
          <div className="text-[#777777] text-[15px] leading-[1.8] text-justify whitespace-pre-wrap mb-10">
            {newsItem.contentId}
          </div>

          {/* Ekstra: Jika ada External Link (opsional sesuai desain) */}
          {newsItem.externalLink && (
            <a href={newsItem.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-black font-medium hover:text-gray-600 transition-colors w-max border-b border-black pb-1 text-[14px]">
              Go to website <ArrowUpRight size={16} />
            </a>
          )}

        </div>
      </div>

    </div>
  );
}