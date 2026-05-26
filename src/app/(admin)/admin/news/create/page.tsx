'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createNews } from '@/app/actions/news';

export default function CreateNewsPage() {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setImageFiles(filesArray);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.delete('images'); // Bersihkan instansi lama
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const result = await createNews(formData);
    
    if (result.success) {
      router.push('/admin/news');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-5xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/news" className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></Link>
        <h1 className="text-arch-black text-[28px] font-bold">Add New News</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Upload Images (Mendukung Banyak Foto)</label>
          <div className="relative w-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-white cursor-pointer hover:border-arch-black p-4 text-center">
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <Upload size={36} className="text-arch-grayMenu mb-2" />
              <span className="text-arch-grayMenu text-[14px]">Pilih File Foto</span>
              <input type="file" name="images" multiple className="hidden" onChange={handleImagesChange} accept="image/*" required />
            </label>
          </div>

          {/* Preview Kumpulan File Foto */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previewImages.map((src, index) => (
                <div key={index} className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAMBAHAN INPUT EXTERNAL LINK */}
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">External Website Link (Optional)</label>
            <input name="externalLink" type="url" placeholder="https://..." className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[14px]" />
          </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">News Title</label>
            <input name="title" type="text" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Author</label>
              <input name="author" type="text" placeholder="e.g. Budi Cahyono" className="w-full border-b py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Publish Date</label>
              <input name="publishDate" type="date" required className="w-full border-b py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Content</label>
            <textarea name="content" rows={8} required className="w-full border rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>
          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save News
          </button>
        </div>
      </form>
    </motion.div>
  );
}