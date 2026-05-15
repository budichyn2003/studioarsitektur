'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';

export default function CreateProjectPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.append('image', imageFile);

    const result = await createProject(formData);

    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-5xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-arch-black text-[28px] font-bold">Add New Project</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Project Cover</label>
          <div className="relative w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-white hover:border-arch-black transition-colors cursor-pointer">
            {previewImage ? (
              <Image src={previewImage} alt="Preview" fill className="object-cover" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                <Upload size={40} className="text-arch-grayMenu mb-2" />
                <span className="text-arch-grayMenu text-[14px]">Upload Image</span>
                <input type="file" name="image" className="hidden" onChange={handleImageChange} accept="image/*" required />
              </label>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Project Title</label>
            <input name="title" type="text" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] text-arch-black font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Category</label>
              <select name="category" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent uppercase">
                <option value="RESIDENTIAL">Residential</option>
                <option value="PUBLIC">Public</option>
                <option value="INSTALLATION">Installation</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Location</label>
              <input name="location" type="text" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            {/* INPUT TANGGAL (BARU) */}
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Project Date</label>
              <input name="projectDate" type="date" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Architect</label>
              <input name="architect" type="text" placeholder="e.g. StackPlus Studio" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Photographer</label>
              <input name="photographer" type="text" placeholder="e.g. John Doe" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Interior</label>
              <input name="interior" type="text" placeholder="e.g. Jane Doe" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Description</label>
            <textarea name="description" rows={5} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>

          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}