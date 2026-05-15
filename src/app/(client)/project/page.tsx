import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProjectGalleryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  // Menunggu parameter dari URL
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category?.toLowerCase() || 'all';

  // Logika Filter: Jika 'all', ambil semua. Jika ada kategori, saring datanya.
  const whereClause = currentCategory !== 'all' 
    ? { category: currentCategory.toUpperCase() as any } 
    : {};

  // Ambil data dari database (termasuk urutan tanggal terbaru)
  const projects = await prisma.project.findMany({
    where: whereClause,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
    orderBy: { projectDate: 'desc' },
  });

  // Fungsi pembantu untuk style menu aktif
  const getMenuClass = (menuName: string) => {
    const isActive = currentCategory === menuName;
    return isActive 
      ? "text-arch-black font-medium transition-colors" 
      : "text-arch-grayMenu hover:text-arch-black transition-colors";
  };

  return (
    <div className="w-full min-h-screen px-6 md:px-20 py-16 flex flex-col">
      
      {/* Menu Filter Kategori menggunakan Link (URL Params) */}
      <div className="flex justify-end mb-12 gap-6 text-[14px] md:text-[16px]">
        <Link href="/project?category=all" className={getMenuClass('all')}>All</Link>
        <Link href="/project?category=residential" className={getMenuClass('residential')}>Residential</Link>
        <Link href="/project?category=public" className={getMenuClass('public')}>Public</Link>
        <Link href="/project?category=installation" className={getMenuClass('installation')}>Installation</Link>
      </div>

      {/* Masonry Grid dengan Efek Hover (Blur & Keterangan) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
        {projects.map((project) => {
          const projectYear = new Date(project.projectDate).getFullYear();

          return (
            <Link key={project.id} href={`/project/${project.id}`} className="block break-inside-avoid group relative overflow-hidden bg-gray-50 rounded-sm">
              {project.images[0] ? (
                <img 
                  src={project.images[0].url} 
                  alt={project.title} 
                  className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[3px]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400">No Image</div>
              )}

              {/* Overlay Keterangan */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none">
                <h3 className="text-white text-[24px] font-medium tracking-tighter uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {project.title}
                </h3>
                <p className="text-white/80 text-[14px] tracking-[0.2em] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {projectYear}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-arch-grayMenu py-20">Proyek untuk kategori ini belum tersedia.</p>
      )}
    </div>
  );
}