'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createCareer } from '@/app/actions/careers';

export default function CreateCareerPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await createCareer(new FormData(e.currentTarget));
    if (result.success) {
      router.push('/admin/careers');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/careers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-arch-black text-[28px] font-bold">Add New Career</h1>
      </div>

      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Position Title</label>
            <input name="title" type="text" placeholder="e.g. Junior Architect" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Location</label>
            <input name="location" type="text" placeholder="e.g. Jakarta, Indonesia" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Job Type</label>
            <select name="type" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Status</label>
            <select name="isActive" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
              <option value="true">Active (Buka Lowongan)</option>
              <option value="false">Closed (Tutup Lowongan)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Job Description</label>
          <textarea name="description" rows={5} required placeholder="Jelaskan peran dan tanggung jawab..." className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Requirements (Kualifikasi)</label>
          <textarea name="requirements" rows={5} required placeholder="Syarat dan kualifikasi yang dibutuhkan..." className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex justify-center gap-3 w-full md:w-max px-10 mt-4">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save Career
        </button>
      </form>
    </div>
  );
}