import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectCarousel from "@/components/layout/ProjectCarousel";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex !== -1 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="w-full min-h-screen pt-10 pb-32 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-5">

      <div className="flex justify-between items-end w-full max-w-5xl mb-1">
        <div className="flex flex-col">
          {prevProject ? (
            <Link href={`/project/${prevProject.id}`} className="group">
              <span className="text-[#999999] text-[10px] uppercase tracking-widest mb-1 block group-hover:text-black transition-colors">Previous</span>
              <span className="text-black text-[13px] md:text-[14px] font-medium transition-colors">{prevProject.title}</span>
            </Link>
          ) : <div />}
        </div>
        <div className="flex flex-col text-right">
          {nextProject ? (
            <Link href={`/project/${nextProject.id}`} className="group">
              <span className="text-[#999999] text-[10px] uppercase tracking-widest mb-1 block group-hover:text-black transition-colors">Next</span>
              <span className="text-black text-[13px] md:text-[14px] font-medium transition-colors">{nextProject.title}</span>
            </Link>
          ) : <div />}
        </div>
      </div>

      <ProjectCarousel images={project.images || []} title={project.title} />

      <div className="flex flex-col w-full max-w-3xl mt-2">
        
        <h1 className="text-black text-[18px] md:text-[20px] font-bold tracking-[0.15em] uppercase leading-tight mb-1">
          {project.title}
        </h1>
        
        <p className="text-[#999999] text-[12px] uppercase tracking-widest mb-6">
          {project.location}{project.buildYear?.trim() ? ` — ${project.buildYear}` : ''}
        </p>

        <div className="grid grid-cols-[130px_1fr] md:grid-cols-[180px_1fr] gap-y-3 text-[13px] mb-8">
          
          {project.status?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Status</span><span className="text-black font-medium">{project.status}</span></>
          ) : null}
          
          {project.architectInCharge?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Architect In Charge</span><span className="text-black font-medium">{project.architectInCharge}</span></>
          ) : null}
          
          {project.drafter?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Drafter</span><span className="text-black font-medium">{project.drafter}</span></>
          ) : null}
          
          {project.siteArea?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Site Area</span><span className="text-black font-medium">{project.siteArea}{project.siteArea.trim() !== '-' && ' m²'}</span></>
          ) : null}
          
          {project.constructedArea?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Const. Area</span><span className="text-black font-medium">{project.constructedArea}{project.constructedArea.trim() !== '-' && ' m²'}</span></>
          ) : null}
          
          {/* URUTAN BARU */}
          {project.collaborate?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Collaborate</span><span className="text-black font-medium">{project.collaborate}</span></>
          ) : null}

          {project.construction?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Construction</span><span className="text-black font-medium">{project.construction}</span></>
          ) : null}
          
          {project.interiorConstruction?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Interior Const.</span><span className="text-black font-medium">{project.interiorConstruction}</span></>
          ) : null}
          
          {project.photographs?.trim() ? (
            <><span className="text-[#999999] uppercase tracking-widest text-[11px]">Photographs</span><span className="text-black font-medium">{project.photographs}</span></>
          ) : null}

        </div>

        <div className="relative text-[#333333] text-[14px] leading-[1.8] text-justify whitespace-pre-wrap">
          <input type="checkbox" id="desc-toggle" className="peer hidden" />
          <div className="line-clamp-3 peer-checked:line-clamp-none transition-all duration-300">
            {project.descriptionId}
          </div>
          
          <label htmlFor="desc-toggle" className="text-black font-semibold text-[11px] uppercase tracking-widest cursor-pointer block mt-3 peer-checked:hidden hover:opacity-70 w-fit">
            + Show More
          </label>
          <label htmlFor="desc-toggle" className="text-black font-semibold text-[11px] uppercase tracking-widest cursor-pointer hidden mt-3 peer-checked:block hover:opacity-70 w-fit">
            - Show Less
          </label>
        </div>
        
      </div>

    </div>
  );
}