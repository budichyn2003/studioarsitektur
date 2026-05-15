import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CareerListPage() {
  // Hanya ambil lowongan yang sedang aktif
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    // Menambahkan padding kiri untuk konsistensi jarak dengan Sidebar
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col">
      {/* Header */}
      <h1 className="text-black text-[32px] md:text-[40px] font-medium mb-4 tracking-tight">
        Join Our Team
      </h1>
      <p className="text-[#777777] text-[16px] max-w-2xl mb-16 leading-relaxed">
        We are always looking for talented individuals who are passionate about architecture and design. Explore our open positions below.
      </p>

      {/* Grid Layout 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {careers.map((career) => {
          // Mengambil sedikit bagian dari deskripsi untuk preview
          const excerpt = career.description.length > 140 
            ? career.description.substring(0, 140) + '...' 
            : career.description;

          return (
            <Link 
              key={career.id} 
              href={`/career/${career.id}`} 
              className="group w-full bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between gap-6 hover:shadow-lg transition-shadow duration-300 min-h-[240px]"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-black text-[22px] font-normal tracking-tight group-hover:text-gray-600 transition-colors">
                  {career.title}
                </h2>
                <p className="text-[#999999] text-[14px] leading-[1.8] line-clamp-3">
                  {excerpt}
                </p>
              </div>
              
              {/* Tag / Badge Pill Sesuai Desain */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-5 py-1.5 border border-gray-300 rounded-full text-[13px] text-black whitespace-nowrap">
                  {career.type}
                </span>
                <span className="px-5 py-1.5 border border-gray-300 rounded-full text-[13px] text-black whitespace-nowrap">
                  {career.location}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {careers.length === 0 && (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200 w-full max-w-5xl">
          <p className="text-[#777777] text-[16px]">Saat ini tidak ada lowongan yang terbuka. Silakan cek kembali nanti!</p>
        </div>
      )}
    </div>
  );
}