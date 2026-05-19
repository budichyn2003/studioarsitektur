import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Image from "next/image";

export default async function NewsListPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { publishDate: 'desc' },
  });
  let newsSetting = await prisma.newsSetting.findFirst();
  if (!newsSetting) newsSetting = await prisma.newsSetting.create({ data: {} });

  return (
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-12">
      <div>
        <h1 className="text-black text-[32px] md:text-[40px] font-medium mb-12 tracking-tight uppercase">
          Latest News
        </h1>

        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {newsList.map((news) => {
            const formattedYear = new Date(news.publishDate).getFullYear();
            const excerpt = news.contentId ? news.contentId.substring(0, 180) + '...' : 'No content available.';

            return (
              <div key={news.id} className="w-full bg-white border border-gray-200 rounded-sm p-8 flex flex-col gap-4 hover:border-black transition-colors duration-300">
                
                <div className="flex items-center gap-2 text-[#999999] text-[13px]">
                  <Calendar size={16} />
                  <span>{formattedYear}</span>
                </div>
                
                <h2 className="text-black text-[22px] md:text-[26px] font-medium tracking-tight uppercase">
                  {news.title}
                </h2>
                
                <p className="text-[#555555] text-[15px] leading-relaxed line-clamp-2 text-justify">
                  {excerpt}
                </p>
                
                <Link href={`/news/${news.id}`} className="text-[#999999] hover:text-black text-[12px] mt-2 transition-colors w-max uppercase tracking-widest font-medium">
                  Read More
                </Link>
              </div>
            );
          })}

          {newsList.length === 0 && (
            <p className="text-[#999999] py-10 text-[15px]">No news published yet.</p>
          )}
        </div>
      </div>

      {/* REVISI LAYOUT: BANNER LANDSCAPE BAWAH SECTION NEWS */}
      <div className="w-full max-w-4xl mt-4">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <Image src={newsSetting.bannerUrl} alt="News Banner" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 80vw" />
        </div>
      </div>

    </div>
  );
}