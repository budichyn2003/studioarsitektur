'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';

export default function CreateProjectPage() {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Multi-Upload & Limit maksimal 5 gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 5) {
      alert("Maksimal 5 gambar yang diperbolehkan!");
      return;
    }

    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  // Hapus gambar dari list preview
  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert("Harap unggah minimal 1 gambar!");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Gabungkan semua file gambar ke dalam FormData dengan key 'images'
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-5xl flex flex-col gap-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-arch-black text-[28px] font-bold">Add New Project</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* KOLOM KIRI: MULTI IMAGE UPLOAD */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Project Images (Max 5)</label>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Preview Gambar yang sudah dipilih */}
            {previewImages.map((src, idx) => (
              <div key={idx} className={`relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group ${idx === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'}`}>
                <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X size={16} />
                </button>
                {idx === 0 && <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">COVER</span>}
              </div>
            ))}

            {/* Tombol Add Image */}
            {previewImages.length < 5 && (
              <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-arch-black cursor-pointer bg-gray-50 transition-colors ${previewImages.length === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'}`}>
                <Upload size={24} className="text-arch-grayMenu mb-2" />
                <span className="text-arch-grayMenu text-[12px]">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}

          </div>
        </div>

        {/* KOLOM KANAN: FORM INPUT DATA (Sama seperti sebelumnya) */}
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
              <input name="location" type="text" required placeholder="Kabupaten / Kota" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Project Date</label>
              <input name="projectDate" type="date" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-dashed border-gray-200 pt-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Build Year</label>
              <input name="buildYear" type="text" placeholder="e.g. 2024" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Status</label>
              <select name="status" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
                <option value="Build">Build</option>
                <option value="Design">Design</option>
                <option value="On Progress">On Progress</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Architect In Charge</label>
              <input name="architectInCharge" type="text" placeholder="Nama Arsitek" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Drafter</label>
              <input name="drafter" type="text" placeholder="Nama Drafter" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Site Area (m2)</label>
              <input name="siteArea" type="text" placeholder="e.g. 120" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Constructed Area (m2)</label>
              <input name="constructedArea" type="text" placeholder="e.g. 200" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">In Collaborate</label>
              <input name="collaborate" type="text" placeholder="Partner Kolaborasi" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Photographs</label>
              <input name="photographs" type="text" placeholder="Fotografer" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Interior</label>
              <input name="interior" type="text" placeholder="e.g. Jane Doe" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 pt-6 mt-2">
            <label className="text-arch-grayMenu text-[14px]">Description</label>
            <textarea name="description" rows={5} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>

          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Menyimpan Semua Gambar...' : 'Save Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}