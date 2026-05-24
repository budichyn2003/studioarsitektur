'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';

// Mesin Kompresor Existing
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920; 
        const MAX_HEIGHT = 1080;
        let width = img.width; let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height = Math.round(height * MAX_WIDTH / width); width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width = Math.round(width * MAX_HEIGHT / height); height = MAX_HEIGHT; }
        }

        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg', lastModified: Date.now() });
            resolve(newFile);
          } else { resolve(file); }
        }, 'image/jpeg', 0.85); 
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function CreateProjectPage() {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsCompressing(true);
      const compressedFiles: File[] = [];
      for (const file of files) {
        if (file.size < 500 * 1024) compressedFiles.push(file);
        else compressedFiles.push(await compressImage(file));
      }
      setImageFiles(prev => [...prev, ...compressedFiles]);
      setPreviewImages(prev => [...prev, ...compressedFiles.map(file => URL.createObjectURL(file))]);
      setIsCompressing(false); 
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== index));
    setPreviewImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // LOGIKA MUTLAK URUTAN & COVER
  const setAsCover = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previewImages];
    const [selectedFile] = newFiles.splice(index, 1);
    const [selectedPreview] = newPreviews.splice(index, 1);
    newFiles.unshift(selectedFile); // Paksa ke urutan index 0
    newPreviews.unshift(selectedPreview);
    setImageFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previewImages];
    const target = direction === 'left' ? index - 1 : index + 1;
    
    [newFiles[index], newFiles[target]] = [newFiles[target], newFiles[index]];
    [newPreviews[index], newPreviews[target]] = [newPreviews[target], newPreviews[index]];
    
    setImageFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (imageFiles.length === 0) return alert("Harap unggah minimal 1 gambar!");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // Urutan file yang di-append di sini sudah MUTLAK sama dengan visual di layar
    imageFiles.forEach(file => formData.append('images', file));

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
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24} /></Link>
        <h1 className="text-arch-black text-[28px] font-bold">Add New Project</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* KOLOM KIRI: MULTI IMAGE MANAGER */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Project Images (Drag/Set Cover)</label>
          <div className="grid grid-cols-2 gap-4">
            
            {previewImages.map((src, idx) => (
              <div key={idx} className={`relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group ${idx === 0 ? 'col-span-2 aspect-[4/3] border-arch-black border-2' : 'aspect-[3/4]'}`}>
                <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" sizes="300px" />
                
                {/* OVERLAY ACTION MUTLAK */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                  <div className="flex justify-between w-full">
                    {idx !== 0 ? (
                      <button type="button" onClick={() => setAsCover(idx)} className="bg-white/20 hover:bg-white text-white hover:text-black text-[10px] px-2 py-1 rounded-sm flex items-center gap-1 transition-colors"><Star size={12}/> Set Cover</button>
                    ) : <span className="bg-black text-white text-[10px] px-2 py-1 rounded-sm flex items-center gap-1"><Star size={12} className="fill-white"/> COVER</span>}
                    <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-sm transition-colors"><X size={14} /></button>
                  </div>
                  
                  {/* Geser Urutan */}
                  <div className="flex justify-center gap-2">
                    {idx > 0 && <button type="button" onClick={() => moveImage(idx, 'left')} className="bg-white text-black p-1 rounded-full hover:scale-110 transition-transform"><ChevronLeft size={16}/></button>}
                    {idx < previewImages.length - 1 && <button type="button" onClick={() => moveImage(idx, 'right')} className="bg-white text-black p-1 rounded-full hover:scale-110 transition-transform"><ChevronRight size={16}/></button>}
                  </div>
                </div>
              </div>
            ))}

            <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-arch-black cursor-pointer bg-gray-50 transition-colors ${previewImages.length === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'} ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
              {isCompressing ? (
                <><Loader2 className="animate-spin text-arch-grayMenu mb-2" size={24} /><span className="text-arch-grayMenu text-[11px] text-center px-1">Optimizing...</span></>
              ) : (
                <><Upload size={24} className="text-arch-grayMenu mb-2" /><span className="text-arch-grayMenu text-[12px]">Upload</span></>
              )}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={isCompressing} />
            </label>

          </div>
        </div>

        {/* KOLOM KANAN: FORM DATA (Tidak diubah) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6 h-max">
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

          <button type="submit" disabled={loading || isCompressing} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Saving Project Content & Images...' : 'Save Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}