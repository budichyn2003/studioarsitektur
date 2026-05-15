'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen px-20 py-16 flex justify-between"
    >
      {/* Bagian Kiri: Informasi Kontak */}
      <div className="w-[45%] flex flex-col justify-between">
        <div>
          <h1 className="text-arch-black text-[48px] font-bold leading-tight tracking-tighter mb-6">
            Let's discuss <br/> your next project.
          </h1>
          <p className="text-arch-grayText text-[16px] leading-relaxed max-w-sm mb-12">
            We are always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
        </div>

        <div className="flex flex-col gap-8 text-[16px]">
          <div>
            <span className="block text-arch-grayMenu mb-1 text-[14px] uppercase tracking-wider">Email</span>
            <a href="mailto:hello@architecture.com" className="text-arch-black hover:opacity-70 transition-opacity font-medium text-[18px]">
              hello@architecture.com
            </a>
          </div>
          <div>
            <span className="block text-arch-grayMenu mb-1 text-[14px] uppercase tracking-wider">Phone</span>
            <p className="text-arch-black font-medium text-[18px]">+62 812 3456 7890</p>
          </div>
          <div>
            <span className="block text-arch-grayMenu mb-1 text-[14px] uppercase tracking-wider">Studio</span>
            <p className="text-arch-black font-medium text-[18px] max-w-xs leading-relaxed">
              Jl. Sudirman No. 123, Jakarta Selatan, Indonesia 12190
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Form Kontak Minimalis */}
      <div className="w-[45%] pt-4">
        <form className="flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2 group">
            <label className="text-arch-grayMenu text-[14px] transition-colors group-focus-within:text-arch-black">Name</label>
            <input 
              type="text" 
              className="border-b border-gray-300 py-2 focus:outline-none focus:border-arch-black transition-colors text-arch-black bg-transparent text-[18px]"
              placeholder="Your full name"
            />
          </div>
          
          <div className="flex flex-col gap-2 group">
            <label className="text-arch-grayMenu text-[14px] transition-colors group-focus-within:text-arch-black">Email</label>
            <input 
              type="email" 
              className="border-b border-gray-300 py-2 focus:outline-none focus:border-arch-black transition-colors text-arch-black bg-transparent text-[18px]"
              placeholder="Your email address"
            />
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-arch-grayMenu text-[14px] transition-colors group-focus-within:text-arch-black">Message</label>
            <textarea 
              rows={4}
              className="border-b border-gray-300 py-2 focus:outline-none focus:border-arch-black transition-colors text-arch-black bg-transparent resize-none text-[18px]"
              placeholder="Tell us about your project"
            ></textarea>
          </div>

          <button className="group self-start flex items-center gap-4 bg-arch-buttonDark text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all mt-6">
            <span className="text-[16px]">Send Message</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}