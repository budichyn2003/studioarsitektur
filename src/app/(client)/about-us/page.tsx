'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAboutSettings, getTeamMembers, getFormerMembers } from '@/app/actions/about';

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [settings, setSettings] = useState({ showHero: true, title: 'ABOUT US', content: '', heroUrl: '' });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [formerMembers, setFormerMembers] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getAboutSettings(), getTeamMembers(), getFormerMembers()]).then(([aboutRes, teamRes, formerRes]) => {
      if (aboutRes.success && aboutRes.data) setSettings(aboutRes.data);
      if (teamRes.success) setTeamMembers(teamRes.data);
      if (formerRes.success) setFormerMembers(formerRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center mt-20 text-gray-400">Loading About Content...</div>; 

  return (
    // LOGIKA VIEWPORT PENTING: Jika text tidak diexpand = 1 Layar Kunci. Jika diexpand = Bisa di-scroll.
    <div className={`w-full ${showMoreDesc ? 'min-h-[100dvh] overflow-y-auto' : 'h-[100dvh] overflow-hidden'} pt-20 pb-10 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-6 bg-white transition-all duration-300`}>
      
      {/* AREA FOTO HERO (Ukuran diefisiensikan agar muat 1 layar) */}
      {settings.showHero && settings.heroUrl && (
        <div className="w-full flex justify-center flex-shrink-0">
          <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[3/4] max-h-[35vh] rounded-sm overflow-hidden bg-gray-50 border border-gray-100">
            <Image src={settings.heroUrl} alt="About Us Hero" fill className="object-cover object-center" priority sizes="320px" />
          </div>
        </div>
      )}

      {/* AREA TEKS DESKRIPSI (Justify, 4 Baris Default + Tombol Show More) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 flex-shrink-0">
        <h2 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase">
          {settings.title}
        </h2>
        
        <div className="text-[#333333] text-[15px] leading-[1.6] text-justify whitespace-pre-wrap w-full">
          <p className={showMoreDesc ? "" : "line-clamp-4"}>
            {settings.content}
          </p>
          {settings.content && settings.content.length > 150 && (
            <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="mt-2 text-black font-semibold text-[12px] uppercase tracking-widest hover:opacity-70 block">
              {showMoreDesc ? "- Show Less" : "+ Show More"}
            </button>
          )}
        </div>
      </div>

      {/* SECTION: OUR TEAM (Jarak rapat, Default Grid 4. Jika lebih, otomatis zigzag/Z-pattern ke bawah) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 border-t border-gray-100 pt-5 flex-shrink-0">
        <h3 className="text-black text-[20px] font-bold uppercase tracking-tight">Our Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="group relative w-full aspect-[3/4] max-h-[22vh] md:max-h-[28vh] bg-gray-50 rounded-sm overflow-hidden cursor-pointer">
              <Image src={member.imageUrl} alt={member.name} fill className="object-cover object-center transition-all duration-700 group-hover:blur-[2px] group-hover:scale-[1.03]" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                <h4 className="text-white text-[16px] font-bold uppercase tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{member.name}</h4>
                <p className="text-white/80 text-[10px] tracking-[0.1em] mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 uppercase">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: FORMER MEMBERS (Teks Regular, Compact) */}
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