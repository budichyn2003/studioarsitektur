import { prisma } from "@/lib/prisma";
import { FolderKanban, Newspaper, Briefcase } from 'lucide-react';

// Hapus 'use client' dan jadikan Server Component async
export default async function AdminDashboardPage() {
  // Hitung jumlah data secara realtime langsung dari database Prisma
  const totalProjects = await prisma.project.count();
  const totalCareers = await prisma.career.count({ where: { isActive: true } });
  
  // Asumsi model untuk News bernama 'news', jika error atau namanya beda ('article' misalnya), 
  // akan otomatis menampilkan angka 0 sementara menggunakan catch()
  const totalNews = await prisma.news.count().catch(() => 0); 

  const stats = [
    { title: 'Total Projects', value: totalProjects.toString(), icon: <FolderKanban size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Published News', value: totalNews.toString(), icon: <Newspaper size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Careers', value: totalCareers.toString(), icon: <Briefcase size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-arch-black text-[32px] font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-arch-grayText text-[16px] mt-1">Welcome back! Realtime stats from your database.</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-arch-grayText text-[14px] font-medium uppercase tracking-wide">{stat.title}</p>
              <h3 className="text-arch-black text-[32px] font-bold leading-none mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Area Kosong untuk Notifikasi atau Aktivitas Terbaru nantinya */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-4 min-h-[400px] flex items-center justify-center">
        <p className="text-arch-grayMenu">Recent activity will appear here...</p>
      </div>
    </div>
  );
}