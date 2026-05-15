'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateCareer, getCareerById } from '@/app/actions/careers';

export default function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const [careerId, setCareerId] = useState('');
  const [careerData, setCareerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setCareerId(p.id);
      getCareerById(p.id).then(data => setCareerData(data));
    });
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updateCareer(careerId, new FormData(e.currentTarget));
    if (result.success) {
      router.push('/admin/careers');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  if (!careerData) return <div className="p-8 mt-20 text-center">Memuat Data Lowongan...</div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-4xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/careers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-arch-black text-[28px] font-bold">Edit Career</h1>
      </div>

      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Position Title</label>
            <input name="title" type="text" defaultValue={careerData.title} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Location</label>
            <input name="location" type="text" defaultValue={careerData.location} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Job Type</label>
            <select name="type" defaultValue={careerData.type} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Status</label>
            <select name="isActive" defaultValue={careerData.isActive ? 'true' : 'false'} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
              <option value="true">Active (Buka Lowongan)</option>
              <option value="false">Closed (Tutup Lowongan)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Job Description</label>
          <textarea name="description" rows={5} defaultValue={careerData.description} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Requirements</label>
          <textarea name="requirements" rows={5} defaultValue={careerData.requirements} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex justify-center gap-3 w-full md:w-max px-10 mt-4">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Update Career
        </button>
      </form>
    </motion.div>
  );
}