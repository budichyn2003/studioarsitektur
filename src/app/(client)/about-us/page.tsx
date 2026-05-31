'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAboutSettings, getTeamMembers, getFormerMembers } from '@/app/actions/about';

const INFINITE_SETS = 14; 

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [settings, setSettings] = useState({ showHero: true, title: 'ABOUT US', content: '', heroUrl: '' });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [formerMembers, setFormerMembers] = useState<any[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [realIndex, setRealIndex] = useState(0);
  
  // STATE BARU: Untuk mendeteksi foto mana yang sedang di-Touch/Tap di HP
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const infiniteMembers = teamMembers.length > 0 
    ? Array(INFINITE_SETS).fill(teamMembers).flat() 
    : [];

  useEffect(() => {
    Promise.all([getAboutSettings(), getTeamMembers(), getFormerMembers()]).then(([aboutRes, teamRes, formerRes]) => {
      if (aboutRes.success && aboutRes.data) setSettings(aboutRes.data);
      if (teamRes.success) setTeamMembers(teamRes.data || []);
      if (formerRes.success) setFormerMembers(formerRes.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (teamMembers.length > 0 && containerRef.current) {
      const centerSetStartIndex = Math.floor(INFINITE_SETS / 2) * teamMembers.length;
      setRealIndex(centerSetStartIndex);
      
      setTimeout(() => {
        const target = containerRef.current?.children[centerSetStartIndex] as HTMLElement;
        if (target) {
          target.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'nearest' });
        }
      }, 100);
    }
  }, [teamMembers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || teamMembers.length === 0) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;

      let closestIdx = realIndex;
      let minDistance = Infinity;

      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i] as HTMLElement;
        const rect = child.getBoundingClientRect();
        const distance = Math.abs(containerLeft - rect.left);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }

      setRealIndex(closestIdx);

      // Tutup efek card kalau user nge-scroll biar layarnya bersih lagi
      setActiveCard(null);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentLogicalIndex = closestIdx % teamMembers.length;
        const centerSetStartIndex = Math.floor(INFINITE_SETS / 2) * teamMembers.length;
        const targetRealIndex = centerSetStartIndex + currentLogicalIndex;

        if (Math.abs(closestIdx - targetRealIndex) >= teamMembers.length) {
          const targetElement = container.children[targetRealIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'nearest' });
            setRealIndex(targetRealIndex);
          }
        }
      }, 250); 
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [teamMembers, realIndex]);

  const handleNext = () => scrollToReal(realIndex + 1);
  const handlePrev = () => scrollToReal(realIndex - 1);

  const scrollToReal = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const safeIndex = Math.max(0, Math.min(index, infiniteMembers.length - 1));
    const target = container.children[safeIndex] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setRealIndex(safeIndex);
      setActiveCard(null); // Tutup efek saat navigasi
    }
  };

  if (loading) return <div className="p-8 text-center mt-20 text-gray-400">Loading About Content...</div>; 

  return (
    <div className="w-full min-h-[100dvh] overflow-x-hidden pt-20 pb-10 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-6 bg-white transition-all duration-300">
      
      {settings.showHero && settings.heroUrl && (
        <div className="w-full max-w-5xl mx-auto flex-shrink-0">
          <div className="relative w-full h-[180px] md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
            <Image src={settings.heroUrl} alt="About Us Hero" fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 80vw" />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 flex-shrink-0">
        <h2 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase">{settings.title}</h2>
        <div className="text-[#333333] text-[15px] leading-[1.6] text-justify whitespace-pre-wrap w-full">
          <p className={showMoreDesc ? "" : "line-clamp-3"}>{settings.content}</p>
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
          
          {teamMembers.length > 2 && (
            <div className="flex gap-4 text-[11px] uppercase tracking-widest text-[#999999] font-medium pb-1">
              <button onClick={handlePrev} className="hover:text-black transition-colors">Prev</button>
              <button onClick={handleNext} className="hover:text-black transition-colors">Next</button>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden">
          <div 
            ref={containerRef}
            className="w-full flex flex-row gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {infiniteMembers.map((member, idx) => {
              const cardKey = `${member.id}-${idx}`;
              const isActive = activeCard === cardKey;

              return (
                <div 
                  key={cardKey} 
                  // KLIK/TOUCH EVENT: Akan memicu efek "kacamata" / blur saat disentuh
                  onClick={() => setActiveCard(isActive ? null : cardKey)}
                  className="group relative w-[calc((100%-12px)/2)] md:w-[calc((100%-48px)/4)] aspect-[3/4] shrink-0 snap-start bg-gray-50 rounded-sm overflow-hidden cursor-pointer"
                >
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name} 
                    fill 
                    draggable={false} 
                    unoptimized={true} 
                    // md:group-hover (hanya di laptop), isActive (saat ditouch di HP)
                    className={`object-cover object-center transition-all duration-700 md:group-hover:blur-[2px] md:group-hover:scale-[1.03] ${isActive ? 'blur-[2px] scale-[1.03]' : ''}`} 
                    sizes="(max-width: 768px) 50vw, 25vw" 
                  />
                  
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 flex flex-col items-center justify-center p-3 text-center ${isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
                    <h4 className={`text-white text-[14px] md:text-[16px] font-bold uppercase tracking-wide transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2 md:group-hover:translate-y-0'}`}>{member.name}</h4>
                    <p className={`text-white/80 text-[10px] tracking-[0.1em] mt-1 transition-transform duration-500 uppercase ${isActive ? 'translate-y-0' : 'translate-y-2 md:group-hover:translate-y-0'}`}>{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
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