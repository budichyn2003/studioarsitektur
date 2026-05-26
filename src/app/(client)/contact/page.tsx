'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Calendar } from 'lucide-react';
import Image from 'next/image';
import { getContactSettings } from '@/app/actions/contact';

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    getContactSettings().then(res => {
      if (res.success && res.data) setContactInfo(res.data);
      setLoading(false);
    });
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      alert("Message sent successfully!");
      setFormLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  if (loading) return <div className="p-8 text-center mt-20 text-gray-400">Loading Contact Content...</div>;

  return (
    // FIX: Menggunakan min-h-[100dvh] dan overflow-y-auto untuk mobile, namun tetap terkunci (h-[100dvh] overflow-hidden) khusus di layar besar (lg:)
    <div className="w-full min-h-[100dvh] lg:h-[100dvh] overflow-y-auto lg:overflow-hidden pt-24 pb-6 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col justify-between bg-white">
      
      {/* FIX: overflow-hidden diubah menjadi lg:overflow-hidden agar di mobile tetap bisa di-scroll ke bawah */}
      <div className="w-full flex flex-col lg:flex-row justify-between gap-10 max-w-6xl flex-grow lg:overflow-hidden">
        
        {/* KIRI: Informasi Kontak */}
        <div className="w-full lg:w-[48%] flex flex-col flex-shrink-0">
          <h1 className="text-black text-[20px] font-bold tracking-[0.15em] uppercase mb-4">
            {contactInfo.headline}
          </h1>
          <p className="text-[#555555] text-[14px] leading-relaxed max-w-md mb-8">
            {contactInfo.subheadline}
          </p>

          <div className="flex flex-col gap-5 text-[14px]">
            <div>
              <span className="block text-[#999999] mb-0.5 text-[11px] uppercase tracking-widest font-medium">Email</span>
              <a href={`mailto:${contactInfo.email}`} className="text-black hover:text-[#777777] transition-colors font-semibold">
                {contactInfo.email}
              </a>
            </div>
            <div>
              <span className="block text-[#999999] mb-0.5 text-[11px] uppercase tracking-widest font-medium">Phone</span>
              <p className="text-black font-semibold">{contactInfo.phone}</p>
            </div>
            <div>
              <span className="block text-[#999999] mb-0.5 text-[11px] uppercase tracking-widest font-medium">Studio</span>
              <p className="text-[#333333] font-medium max-w-xs leading-relaxed">
                {contactInfo.address}
              </p>
            </div>
          </div>
        </div>

        {/* KANAN: Form Kontak dengan Input Subject */}
        {/* FIX: overflow-y-auto dipertahankan khusus untuk desktop (lg:), sedangkan mobile menyesuaikan container parent */}
        <div className="w-full lg:w-[48%] lg:overflow-y-auto pr-2 pb-2">
          <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[#999999] text-[11px] uppercase tracking-widest font-medium group-focus-within:text-black transition-colors">Name</label>
              <input required type="text" name="name" className="border-b border-gray-200 py-1.5 focus:outline-none focus:border-black transition-colors text-black bg-transparent text-[14px]" placeholder="Your full name" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[#999999] text-[11px] uppercase tracking-widest font-medium group-focus-within:text-black transition-colors">Email</label>
                <input required type="email" name="email" className="border-b border-gray-200 py-1.5 focus:outline-none focus:border-black transition-colors text-black bg-transparent text-[14px]" placeholder="Email address" />
              </div>
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[#999999] text-[11px] uppercase tracking-widest font-medium group-focus-within:text-black transition-colors">Subject</label>
                <input required type="text" name="subject" className="border-b border-gray-200 py-1.5 focus:outline-none focus:border-black transition-colors text-black bg-transparent text-[14px]" placeholder="Project inquiry" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 group">
              <label className="text-[#999999] text-[11px] uppercase tracking-widest font-medium group-focus-within:text-black transition-colors">Message</label>
              <textarea required name="message" rows={2} className="border-b border-gray-200 py-1.5 focus:outline-none focus:border-black transition-colors text-black bg-transparent resize-none text-[14px]" placeholder="Tell us about your project" />
            </div>

            {/* FIX: Layout Button dibuat flex-row untuk berdampingan, flex-1 agar sama besar dan rapi */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full">
              <button type="submit" disabled={formLoading} className="w-full sm:w-auto flex-1 group flex justify-center items-center gap-2 bg-black text-white px-4 py-3 rounded-sm font-medium hover:bg-neutral-800 disabled:bg-gray-400 transition-all text-[12px] uppercase tracking-widest whitespace-nowrap">
                <span>{formLoading ? 'Sending...' : 'Send Message'}</span>
                {formLoading ? <Loader2 className="animate-spin" size={14} /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              {/* Tombol Book a Meet (Calendly) Dinamis */}
              {contactInfo.calendlyLink && (
                <a href={contactInfo.calendlyLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 bg-gray-100 text-black px-4 py-3 rounded-sm font-medium hover:bg-gray-200 transition-all text-[12px] uppercase tracking-widest whitespace-nowrap">
                  <Calendar size={14} /> Book a Meet
                </a>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* REVISI BANNER BAWAH: Konsisten dengan Career (30vh) */}
      {contactInfo.bannerUrl && (
        <div className="w-full max-w-6xl mt-12 lg:mt-4 flex-shrink-0">
          <div className="relative w-full h-[180px] md:h-[220px] lg:h-[30vh] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
            <Image src={contactInfo.bannerUrl} alt="Contact Banner" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 80vw" />
          </div>
        </div>
      )}

    </div>
  );
}