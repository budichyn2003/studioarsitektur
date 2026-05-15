'use client';

import { motion } from 'framer-motion';
import { FolderKanban, Newspaper, Briefcase } from 'lucide-react';

export default function AdminDashboardPage() {
  // Data statis sementara untuk tampilan kartu statistik
  const stats = [
    { title: 'Total Projects', value: '12', icon: <FolderKanban size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Published News', value: '8', icon: <Newspaper size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Careers', value: '3', icon: <Briefcase size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Header Dashboard */}
      <div>
        <h1 className="text-arch-black text-[32px] font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-arch-grayText text-[16px] mt-1">Welcome back! Here is what's happening with your portfolio today.</p>
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

    </motion.div>
  );
}