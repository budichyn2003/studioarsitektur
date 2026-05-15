import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function NewsListPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { publishDate: 'desc' },
  });

  return (
    // Menambahkan margin kiri agar berjarak dari Sidebar
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col">
      <h1 className="text-black text-[32px] md:text-[40px] font-medium mb-12 tracking-tight">
        Latest News
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {newsList.map((news) => {
          // Format tanggal HANYA TAHUN saja (contoh: 2026)
          const formattedYear = new Date(news.publishDate).getFullYear();
          // Potong konten agar tidak terlalu panjang di preview
          const excerpt = news.contentId ? news.contentId.substring(0, 180) + '...' : 'No content available.';

          return (
            <div key={news.id} className="w-full bg-white border border-gray-200 rounded-sm p-8 flex flex-col gap-4 hover:border-black transition-colors">
              
              <div className="flex items-center gap-2 text-[#999999] text-[13px]">
                <Calendar size={16} />
                {/* Hanya Menampilkan Tahun */}
                <span>{formattedYear}</span>
              </div>
              
              <h2 className="text-black text-[22px] md:text-[26px] font-medium tracking-tight">
                {news.title}
              </h2>
              
              <p className="text-[#555555] text-[15px] leading-relaxed line-clamp-2">
                {excerpt}
              </p>
              
              <Link href={`/news/${news.id}`} className="text-[#999999] hover:text-black text-[14px] mt-2 transition-colors w-max uppercase tracking-widest text-xs">
                Read More
              </Link>
            </div>
          );
        })}

        {newsList.length === 0 && (
          <p className="text-[#999999] py-10">No news published yet.</p>
        )}
      </div>
    </div>
  );
}