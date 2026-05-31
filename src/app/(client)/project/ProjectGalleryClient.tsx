'use client';

import { useState, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";

// Tambahan nilai default projects = [] agar tidak error undefined lagi
export default function ProjectGalleryClient({ projects = [], currentCategory = 'all' }: { projects: any[], currentCategory: string }) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const isTouch = useRef(false);

  const getMenuClass = (menuName: string) => {
    return currentCategory === menuName 
      ? "text-black font-medium transition-colors" 
      : "text-[#999999] hover:text-black transition-colors";
  };

  const renderCard = (project: any, index: number) => {
    const projectYear = project.buildYear || new Date(project.projectDate).getFullYear();
    const isPriority = index < 4;
    const isActive = activeCard === project.id;

    return (
      <div key={project.id} className="block relative bg-gray-50 rounded-sm">
        <Link 
          href={`/project/${project.id}`}
          className="block relative overflow-hidden group cursor-pointer"
          onTouchStart={() => { isTouch.current = true; }}
          onClick={(e) => {
            if (isTouch.current) {
              if (!isActive) {
                e.preventDefault(); 
                e.stopPropagation(); 
                setActiveCard(project.id);
              }
            }
          }}
        >
          {project.images && project.images.length > 0 ? (
            <Image 
              src={project.images[0].url} 
              alt={project.title} 
              width={800}
              height={1200}
              className={`w-full h-auto transition-all duration-700 md:group-hover:scale-[1.03] md:group-hover:blur-[2px] ${isActive ? 'scale-[1.03] blur-[2px]' : ''}`}
              loading={isPriority ? undefined : "lazy"}
              priority={isPriority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400">No Image</div>
          )}

          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
            <h3 className={`text-white text-[22px] font-medium tracking-tighter uppercase transition-transform duration-500 text-center px-4 ${isActive ? 'translate-y-0' : 'translate-y-4 md:group-hover:translate-y-0'}`}>
              {project.title}
            </h3>
            <p className={`text-white/90 text-[13px] tracking-[0.1em] mt-2 transition-transform duration-500 delay-75 ${isActive ? 'translate-y-0' : 'translate-y-4 md:group-hover:translate-y-0'}`}>
              {projectYear}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div 
      className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col" 
      onClick={() => setActiveCard(null)}
    >
      <div className="flex justify-end mb-12 gap-6 text-[14px] md:text-[15px]">
        <Link href="/project?category=all" className={getMenuClass('all')}>All</Link>
        <Link href="/project?category=residential" className={getMenuClass('residential')}>Residential</Link>
        <Link href="/project?category=public" className={getMenuClass('public')}>Public</Link>
        <Link href="/project?category=installation" className={getMenuClass('installation')}>Installation</Link>
      </div>

      <div className="flex flex-col sm:hidden gap-4">{projects.map((p, i) => renderCard(p, i))}</div>
      
      <div className="hidden sm:flex lg:hidden w-full gap-4 md:gap-6">
        <div className="flex flex-col flex-1 gap-4 md:gap-6">{projects.filter((_, i) => i % 2 === 0).map((p, i) => renderCard(p, i * 2))}</div>
        <div className="flex flex-col flex-1 gap-4 md:gap-6">{projects.filter((_, i) => i % 2 === 1).map((p, i) => renderCard(p, i * 2 + 1))}</div>
      </div>
      
      <div className="hidden lg:flex w-full gap-4 md:gap-6">
        <div className="flex flex-col flex-1 gap-4 md:gap-6">{projects.filter((_, i) => i % 3 === 0).map((p, i) => renderCard(p, i * 3))}</div>
        <div className="flex flex-col flex-1 gap-4 md:gap-6">{projects.filter((_, i) => i % 3 === 1).map((p, i) => renderCard(p, i * 3 + 1))}</div>
        <div className="flex flex-col flex-1 gap-4 md:gap-6">{projects.filter((_, i) => i % 3 === 2).map((p, i) => renderCard(p, i * 3 + 2))}</div>
      </div>
    </div>
  );
}