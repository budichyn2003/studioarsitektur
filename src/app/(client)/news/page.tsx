import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function NewsListPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { publishDate: 'desc' },
  });

  return (
    <div className="w-full min-h-screen px-6 md:px-20 py-16 flex flex-col">
      <h1 className="text-arch-black text-[32px] font-medium mb-12 tracking-tight">
        Latest News
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-5xl">
        {newsList.map((news) => {
          // Format tanggal ke format: 12 May 2026
          const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(news.publishDate));
          // Potong konten agar tidak terlalu panjang di preview
          const excerpt = news.contentId ? news.contentId.substring(0, 180) + '...' : 'No content available.';

          return (
            <div key={news.id} className="w-full bg-white border border-gray-200 rounded-xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-arch-grayMenu text-[13px]">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              
              <h2 className="text-arch-black text-[22px] font-medium tracking-tight">
                {news.title}
              </h2>
              
              <p className="text-arch-grayMenu text-[15px] leading-relaxed">
                {excerpt}
              </p>
              
              <Link href={`/news/${news.id}`} className="text-arch-black text-[14px] font-medium mt-2 hover:underline w-max">
                View More
              </Link>
            </div>
          );
        })}

        {newsList.length === 0 && (
          <p className="text-arch-grayMenu py-10">No news published yet.</p>
        )}
      </div>
    </div>
  );
}