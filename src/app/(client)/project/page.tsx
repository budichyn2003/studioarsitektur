// D:\Budi Cahyono Cursor - Full Stack Developer\architecture-portfolio\src\app\(client)\project\page.tsx
import { prisma } from "@/lib/prisma";
import ProjectGalleryClient from "./ProjectGalleryClient";

export default async function Page({ searchParams }: { searchParams: any }) {
  const params = await Promise.resolve(searchParams);
  const currentCategory = params?.category?.toLowerCase() || 'all';

  const whereClause = currentCategory !== 'all' 
    ? { category: currentCategory.toUpperCase() as any } 
    : {};

  const rawProjects = await prisma.project.findMany({
    where: whereClause,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });

  const projects = rawProjects.sort((a, b) => {
    const yearA = parseInt(a.buildYear || '0') || new Date(a.projectDate).getFullYear();
    const yearB = parseInt(b.buildYear || '0') || new Date(b.projectDate).getFullYear();
    return yearB !== yearA ? yearB - yearA : new Date(b.projectDate).getTime() - new Date(a.projectDate).getTime();
  });

  return <ProjectGalleryClient projects={projects} currentCategory={currentCategory} />;
}