import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectCarousel from "@/components/layout/ProjectCarousel";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      images: { orderBy: { order: 'asc' } } 
    }
  });

  if (!project) return notFound();

  const allProjects = await prisma.project.findMany({
    orderBy: { projectDate: 'desc' }, 
    select: { id: true, title: true }
  });

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  
  const nextProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const prevProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="w-full min-h-screen pt-12 pb-32 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-8">

      {/* TOP NAVIGATION: Previous & Next (Dikecilkan proporsional) */}
      <div className="flex justify-between items-end w-full max-w-5xl mb-2">
        <div className="flex flex-col">
          {prevProject ? (
            <Link href={`/project/${prevProject.id}`} className="group">
              <span className="text-[#999999] text-[11px] uppercase tracking-wider mb-1 block group-hover:text-black transition-colors">Previous</span>
              <span className="text-black text-[15px] md:text-[16px] font-medium transition-colors">{prevProject.title}</span>
            </Link>
          ) : <div />}
        </div>
        <div className="flex flex-col text-right">
          {nextProject ? (
            <Link href={`/project/${nextProject.id}`} className="group">
              <span className="text-[#999999] text-[11px] uppercase tracking-wider mb-1 block group-hover:text-black transition-colors">Next</span>
              <span className="text-black text-[15px] md:text-[16px] font-medium transition-colors">{nextProject.title}</span>
            </Link>
          ) : <div />}
        </div>
      </div>

      {/* GALERI MULTI-FOTO CAROUSEL CLIENT COMPONENT */}
      <ProjectCarousel images={project.images} title={project.title} />

      {/* PROJECT INFO (Title, Specs, Description) */}
      <div className="flex flex-col w-full max-w-3xl mt-4">
        
        <h1 className="text-[24px] md:text-[32px] font-medium text-black tracking-tight mb-1 uppercase">
          {project.title}
        </h1>
        <p className="text-[#999999] text-[14px] mb-12">
          {project.location}{project.buildYear ? `, ${project.buildYear}` : ''}
        </p>

        {/* Grid Spesifikasi */}
        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-y-5 text-[14px] mb-16">
          {project.status && <><span className="text-[#999999]">Status</span><span className="text-black font-medium">{project.status}</span></>}
          {project.architectInCharge && <><span className="text-[#999999]">Architect In Charge</span><span className="text-black font-medium">{project.architectInCharge}</span></>}
          {project.drafter && <><span className="text-[#999999]">Drafter</span><span className="text-black font-medium">{project.drafter}</span></>}
          {project.siteArea && <><span className="text-[#999999]">Site Area</span><span className="text-black font-medium">{project.siteArea} m2</span></>}
          {project.constructedArea && <><span className="text-[#999999]">Constructed Area</span><span className="text-black font-medium">{project.constructedArea} m2</span></>}
          {project.collaborate && <><span className="text-[#999999]">In Collaborate</span><span className="text-black font-medium">{project.collaborate}</span></>}
          {project.photographs && <><span className="text-[#999999]">Photographs</span><span className="text-black font-medium">{project.photographs}</span></>}
        </div>

        {/* Description */}
        <div className="text-[#333333] text-[15px] leading-[1.8] whitespace-pre-wrap text-justify">
          {project.descriptionId}
        </div>
        
      </div>

    </div>
  );
}