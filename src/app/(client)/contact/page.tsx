'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getContactSettings } from '@/app/actions/contact';

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    headline: '',
    subheadline: '',
    email: '',
    phone: '',
    address: '',
    bannerUrl: ''
  });

  useEffect(() => {
    getContactSettings().then(res => {
      if (res.success && res.data) {
        setContactInfo({
          headline: res.data.headline,
          subheadline: res.data.subheadline,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          bannerUrl: res.data.bannerUrl
        });
      }
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
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-16 transition-opacity duration-500 opacity-100">
      
      <div className="w-full flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 max-w-6xl">
        
        {/* Bagian Kiri: Informasi Kontak */}
        <div className="w-full lg:w-[48%] flex flex-col justify-between gap-12">
          <div>
            <h1 className="text-black text-[36px] md:text-[44px] font-medium leading-tight tracking-tight mb-6 whitespace-pre-line uppercase">
              {contactInfo.headline}
            </h1>
            <p className="text-[#777777] text-[15px] leading-relaxed max-w-md">
              {contactInfo.subheadline}
            </p>
          </div>

          <div className="flex flex-col gap-6 text-[15px]">
            <div>
              <span className="block text-[#999999] mb-1 text-[12px] uppercase tracking-widest">Email</span>
              <a href={`mailto:${contactInfo.email}`} className="text-black hover:text-[#777777] transition-colors font-medium text-[16px]">
                {contactInfo.email}
              </a>
            </div>
            <div>
              <span className="block text-[#999999] mb-1 text-[12px] uppercase tracking-widest">Phone</span>
              <p className="text-black font-medium text-[16px]">{contactInfo.phone}</p>
            </div>
            <div>
              <span className="block text-[#999999] mb-1 text-[12px] uppercase tracking-widest">Studio</span>
              <p className="text-black font-medium text-[16px] max-w-xs leading-relaxed">
                {contactInfo.address}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Form Kontak Minimalis */}
        <div className="w-full lg:w-[48%] pt-2">
          <form className="flex flex-col gap-10" onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-2 group">
              <label className="text-[#999999] text-[13px] uppercase tracking-wider group-focus-within:text-black transition-colors">Name</label>
              <input required type="text" name="name" className="border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors text-black bg-transparent text-[16px]" placeholder="Your full name" />
            </div>
            
            <div className="flex flex-col gap-2 group">
              <label className="text-[#999999] text-[13px] uppercase tracking-wider group-focus-within:text-black transition-colors">Email</label>
              <input required type="email" name="email" className="border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors text-black bg-transparent text-[16px]" placeholder="Your email address" />
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[#999999] text-[13px] uppercase tracking-wider group-focus-within:text-black transition-colors">Message</label>
              <textarea required name="message" rows={3} className="border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors text-black bg-transparent resize-none text-[16px]" placeholder="Tell us about your project" />
            </div>

            <button type="submit" disabled={formLoading} className="group self-start flex items-center gap-4 bg-black text-white px-8 py-3.5 rounded-sm font-medium hover:bg-neutral-800 disabled:bg-gray-400 transition-all mt-4 text-[14px] uppercase tracking-wider">
              <span>{formLoading ? 'Sending...' : 'Send Message'}</span>
              {formLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>

      {/* REVISI LAYOUT: BANNER LANDSCAPE BAGIAN BAWAH DENGAN BINDING BOX KONSISTEN */}
      {contactInfo.bannerUrl && (
        <div className="w-full max-w-6xl mt-8">
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
            <Image
              src={contactInfo.bannerUrl}
              alt="Contact Studio Banner"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>
        </div>
      )}

    </div>
  );
}