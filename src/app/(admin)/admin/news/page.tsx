import { prisma } from "@/lib/prisma";
import { Plus, Calendar, User } from "lucide-react";
import Link from "next/link";
import NewsActions from "@/components/admin/NewsActions";

export default async function ManageNewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { publishDate: 'desc' },
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-arch-black text-[32px] font-bold tracking-tight">Manage News</h1>
          <p className="text-arch-grayText text-[16px] mt-1">Daftar artikel dan berita terbaru.</p>
        </div>
        <Link href="/admin/news/create" className="bg-arch-black text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
          <Plus size={20} /> Add New News
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-arch-grayMenu text-[14px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {newsList.map((news) => {
              const formattedDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(news.publishDate));
              return (
                <tr key={news.id} className="hover:bg-gray-50 transition-colors text-[15px]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {news.thumbnailUrl ? (
                          <img src={news.thumbnailUrl} alt={news.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                        )}
                      </div>
                      <span className="font-semibold text-arch-black">{news.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-arch-grayText flex items-center gap-1 mt-3">
                    <User size={14} /> {news.author || "Admin"}
                  </td>
                  <td className="px-6 py-4 text-arch-grayText">
                    <div className="flex items-center gap-1">
                       <Calendar size={14} /> {formattedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <NewsActions id={news.id} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {newsList.length === 0 && <div className="p-20 text-center text-arch-grayMenu">Belum ada berita. Silakan klik "Add New News".</div>}
      </div>
    </div>
  );
}