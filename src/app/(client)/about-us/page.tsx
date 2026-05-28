'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAboutSettings, getTeamMembers, getFormerMembers } from '@/app/actions/about';

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [settings, setSettings] = useState({ showHero: true, title: 'ABOUT US', content: '', heroUrl: '' });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [formerMembers, setFormerMembers] = useState<any[]>([]);
  
  // LOGIC ASLI: startIndex untuk infinite loop
  const [startIndex, setStartIndex] = useState(0);

  // LOGIC TAMBAHAN: Untuk gesture drag & touchpad
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Promise.all([getAboutSettings(), getTeamMembers(), getFormerMembers()]).then(([aboutRes, teamRes, formerRes]) => {
      if (aboutRes.success && aboutRes.data) setSettings(aboutRes.data);
      if (teamRes.success) setTeamMembers(teamRes.data || []);
      if (formerRes.success) setFormerMembers(formerRes.data || []);
      setLoading(false);
    });
  }, []);

  // LOGIC ASLI: Infinite Loop (Kembali ke awal kalau habis)
  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % teamMembers.length);
  };
  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  // HANDLER: Mouse & Touch Drag
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) setDragStartX(e.touches[0].clientX);
    else setDragStartX((e as React.MouseEvent).clientX);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    if ('touches' in e) setDragEndX(e.touches[0].clientX);
    else setDragEndX((e as React.MouseEvent).clientX);
  };

  const handleDragEnd = () => {
    if (dragStartX !== null && dragEndX !== null) {
      const distance = dragStartX - dragEndX;
      if (distance > 50) handleNext();
      else if (distance < -50) handlePrev();
    }
    setDragStartX(null);
    setDragEndX(null);
  };

  // HANDLER: Touchpad 2 Jari
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaX) > 30) {
      if (e.deltaX > 30) handleNext();
      else handlePrev();
      
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 400); 
    }
  };

  // LOGIC ASLI: Mapping data agar muter terus
  const visibleMembers = [];
  if (teamMembers.length > 0) {
    const displayCount = Math.min(4, teamMembers.length);
    for (let i = 0; i < displayCount; i++) {
      visibleMembers.push(teamMembers[(startIndex + i) % teamMembers.length]);
    }
  }

  if (loading) return <div className="p-8 text-center mt-20 text-gray-400">Loading About Content...</div>; 

  return (
    <div className={`w-full ${showMoreDesc ? 'min-h-[100dvh] overflow-y-auto' : 'h-[100dvh] overflow-hidden'} pt-20 pb-10 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-6 bg-white transition-all duration-300`}>
      
      {settings.showHero && settings.heroUrl && (
        <div className="w-full max-w-5xl mx-auto flex-shrink-0">
          <div className="relative w-full h-[180px] md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
            <Image src={settings.heroUrl} alt="About Us Hero" fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 80vw" />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 flex-shrink-0">
        <h2 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase">
          {settings.title}
        </h2>
        
        <div className="text-[#333333] text-[15px] leading-[1.6] text-justify whitespace-pre-wrap w-full">
          <p className={showMoreDesc ? "" : "line-clamp-3"}>
            {settings.content}
          </p>
          {settings.content && settings.content.length > 150 && (
            <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="mt-2 text-black font-semibold text-[12px] uppercase tracking-widest hover:opacity-70 block">
              {showMoreDesc ? "- Show Less" : "+ Show More"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 border-t border-gray-100 pt-5 flex-shrink-0">
        <div className="flex justify-between items-end w-full">
          <h3 className="text-black text-[20px] font-bold uppercase tracking-tight">Our Team</h3>
          
          {teamMembers.length > 4 && (
            <div className="flex gap-4 text-[11px] uppercase tracking-widest text-[#999999] font-medium pb-1">
              <button onClick={handlePrev} className="hover:text-black transition-colors">Prev</button>
              <button onClick={handleNext} className="hover:text-black transition-colors">Next</button>
            </div>
          )}
        </div>

        {/* LOGIC ASLI: Dikembalikan ke Grid statis, ditambah event listener saja */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onWheel={handleWheel}
        >
          {visibleMembers.map((member, idx) => (
            <div key={`${member.id}-${idx}`} className="group relative w-full aspect-[3/4] max-h-[22vh] md:max-h-[28vh] bg-gray-50 rounded-sm overflow-hidden pointer-events-none md:pointer-events-auto animate-in fade-in duration-500">
              <Image src={member.imageUrl} alt={member.name} fill draggable={false} unoptimized={true} className="object-cover object-center transition-all duration-700 md:group-hover:blur-[2px] md:group-hover:scale-[1.03]" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 text-center pointer-events-none hidden md:flex">
                <h4 className="text-white text-[16px] font-bold uppercase tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{member.name}</h4>
                <p className="text-white/80 text-[10px] tracking-[0.1em] mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 uppercase">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-2 border-t border-gray-100 pt-4 flex-shrink-0 pb-10">
        <h3 className="text-black text-[20px] font-bold uppercase tracking-tight">Former Members</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#555555] text-[14px] font-normal leading-relaxed">
          {formerMembers.map((member) => (
            <span key={member.id} className="after:content-[','] last:after:content-[''] after:ml-0.5">
              {member.name}
            </span>
          ))}
          {formerMembers.length === 0 && <span className="text-gray-400 text-xs italic">No former members listed yet.</span>}
        </div>
      </div>

    </div>
  );
}