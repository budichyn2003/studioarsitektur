import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  if (!projectId) return notFound();

  // 1. Ambil Data Proyek Saat Ini
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { images: { orderBy: { order: 'asc' } } },
  });

  if (!project) return notFound();

  // 2. Ambil Proyek Selanjutnya (Untuk tombol Next di kanan atas)
  const nextProject = await prisma.project.findFirst({
    where: { createdAt: { gt: project.createdAt } },
    orderBy: { createdAt: 'asc' },
  });

  // 3. LOGIKA PENOMORAN PROYEK BERDASARKAN KATEGORI & TANGGAL TERTUA
  // Ambil semua proyek dengan kategori yang sama, urutkan dari tanggal paling lama (asc)
  const categoryProjects = await prisma.project.findMany({
    where: { category: project.category },
    orderBy: [
      { projectDate: 'asc' }, // Tahun terlama jadi nomor 1
      { createdAt: 'asc' }    // Jika tahunnya sama persis, urutkan dari yang pertama kali diinput
    ],
    select: { id: true }
  });

  // Cari index proyek saat ini di dalam daftar tersebut, lalu tambah 1
  const projectIndex = categoryProjects.findIndex(p => p.id === project.id);
  const projectNumber = projectIndex !== -1 ? projectIndex + 1 : 1;
  
  // Format nomor jadi 2 digit (contoh: 01, 02, 03)
  const formattedNumber = projectNumber.toString().padStart(2, '0');

  // Format Tanggal untuk ditampilkan
  const projectYear = new Date(project.projectDate).getFullYear();
  const formattedFullDate = new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date(project.projectDate));

  return (
    <div className="w-full min-h-screen pt-8 pb-20 pl-8 md:pl-24 lg:pl-[20%] pr-8 md:pr-16">
      
      {/* BAGIAN ATAS: Navigasi "Next" di Kanan Atas */}
      <div className="w-full flex justify-end mb-12 h-[40px]">
        {nextProject && (
          <Link href={`/project/${nextProject.id}`} className="group text-right">
            <span className="block text-[#999999] text-[14px] group-hover:text-black transition-colors mb-1">
              Next
            </span>
            <span className="block text-black text-[18px] md:text-[22px] font-medium tracking-tight">
              {nextProject.title}
            </span>
          </Link>
        )}
      </div>

      {/* BAGIAN TENGAH: Galeri Gambar Horizontal */}
      <div className="w-full mb-12">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-4">
          {project.images.map((img) => (
            <img 
              key={img.id}
              src={img.url} 
              alt={project.title} 
              className="h-[300px] md:h-[480px] w-auto object-cover snap-center bg-gray-50"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* BAGIAN BAWAH: Detail & Deskripsi */}
      <div className="w-full max-w-4xl">
        
        <div className="mb-10">
          {/* LABEL BARU: Kategori, Nomor Urut, dan Tahun */}
          <div className="flex items-center gap-3 text-[#999999] text-[12px] uppercase tracking-[0.2em] mb-4">
            <span className="text-black font-medium">{project.category}</span>
            <span className="w-1 h-1 bg-[#d1d1d1] rounded-full"></span>
            <span>PROJECT NO. {formattedNumber}</span>
            <span className="w-1 h-1 bg-[#d1d1d1] rounded-full"></span>
            <span>{projectYear}</span>
          </div>

          <h1 className="text-black text-[32px] font-medium tracking-tight mb-1">
            {project.title}
          </h1>
          <p className="text-[#999999] text-[15px]">
            {project.location}
          </p>
        </div>

        {/* Tabel Detail */}
        <div className="flex flex-col gap-4 mb-12 text-[15px]">
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr]">
            <span className="text-[#999999]">Date</span>
            <span className="text-black">{formattedFullDate}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr]">
            <span className="text-[#999999]">Architect</span>
            <span className="text-black">{project.architect || "StackPlus Studio"}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr]">
            <span className="text-[#999999]">Photographer</span>
            <span className="text-black">{project.photographer || "-"}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr]">
            <span className="text-[#999999]">Interior</span>
            <span className="text-black">{project.interior || "-"}</span>
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-black text-[15px] leading-[1.8] text-justify whitespace-pre-wrap">
          {project.descriptionId}
        </p>
        
      </div>

    </div>
  );
}