import { prisma } from "@/lib/prisma";
import ProjectGalleryClient from "./ProjectGalleryClient";

export default async function ProjectPage({ searchParams }: { searchParams: any }) {
  // Ambil parameter URL (kategori)
  const params = await Promise.resolve(searchParams);
  const currentCategory = params?.category?.toLowerCase() || 'all';

  const whereClause = currentCategory !== 'all' 
    ? { category: currentCategory.toUpperCase() as any } 
    : {};

  // Ambil data dari Database
  const rawProjects = await prisma.project.findMany({
    where: whereClause,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });

  // Urutkan data
  const projects = rawProjects.sort((a, b) => {
    const yearA = parseInt(a.buildYear || '0') || new Date(a.projectDate).getFullYear();
    const yearB = parseInt(b.buildYear || '0') || new Date(b.projectDate).getFullYear();
    if (yearB !== yearA) return yearB - yearA;
    return new Date(b.projectDate).getTime() - new Date(a.projectDate).getTime();
  });

  // Oper data ke komponen Client
  return <ProjectGalleryClient projects={projects} currentCategory={currentCategory} />;
}