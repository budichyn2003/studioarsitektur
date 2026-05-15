import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectGalleryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category?.toLowerCase() || 'all';

  const whereClause = currentCategory !== 'all' 
    ? { category: currentCategory.toUpperCase() as any } 
    : {};

  const projects = await prisma.project.findMany({
    where: whereClause,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
    orderBy: { projectDate: 'desc' },
  });

  const getMenuClass = (menuName: string) => {
    const isActive = currentCategory === menuName;
    return isActive 
      ? "text-black font-medium transition-colors" 
      : "text-[#999999] hover:text-black transition-colors";
  };

  return (
    // Menambahkan margin kiri agar berjarak dari Sidebar (sama seperti halaman detail project)
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col">
      
      {/* Menu Filter Kategori */}
      <div className="flex justify-end mb-12 gap-6 text-[14px] md:text-[15px]">
        <Link href="/project?category=all" className={getMenuClass('all')}>All</Link>
        <Link href="/project?category=residential" className={getMenuClass('residential')}>Residential</Link>
        <Link href="/project?category=public" className={getMenuClass('public')}>Public</Link>
        <Link href="/project?category=installation" className={getMenuClass('installation')}>Installation</Link>
      </div>

      {/* Masonry Grid dengan Efek Hover (Blur & Keterangan Tahun Saja) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {projects.map((project) => {
          // Hanya ambil tahun (contoh: 2026)
          const projectYear = project.buildYear || new Date(project.projectDate).getFullYear();

          return (
            <Link key={project.id} href={`/project/${project.id}`} className="block break-inside-avoid group relative overflow-hidden bg-gray-50 rounded-sm">
              {project.images[0] ? (
                <Image 
                  src={project.images[0].url} 
                  alt={project.title} 
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400">No Image</div>
              )}

              {/* Overlay Keterangan */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none">
                <h3 className="text-white text-[22px] font-medium tracking-tighter uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center px-4">
                  {project.title}
                </h3>
                {/* Hanya menampilkan tahun saja */}
                <p className="text-white/90 text-[13px] tracking-[0.1em] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {projectYear}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-[#999999] py-20">Proyek untuk kategori ini belum tersedia.</p>
      )}
    </div>
  );
}