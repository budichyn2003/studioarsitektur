'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, ImagePlus } from 'lucide-react';
import { getHomepageSettings, updateHomepageSettings } from '@/app/actions/homepage';
import Image from 'next/image';

export default function ManageHomepage() {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    getHomepageSettings().then(res => {
      if (res.success && res.data) {
        setInitialData(res.data);
        setPreviewImages(res.data.imageUrls || []);
      }
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const result = await updateHomepageSettings(formData);
    if (result.success) {
      alert('Berhasil memperbarui Homepage!');
      window.location.reload();
    } else {
      alert('Error: ' + result.error);
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-4xl flex flex-col gap-8">
      <h1 className="text-black text-[28px] font-bold">Manage Homepage Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-8">
        
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-black">Slider Images</label>
          <p className="text-[#777777] text-[14px] mb-4">Pilih beberapa gambar sekaligus untuk slider homepage. Mengunggah gambar baru akan menimpa gambar yang lama.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {previewImages.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <Image src={src} alt={`Preview ${i}`} fill className="object-cover" />
              </div>
            ))}
            
            <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg hover:border-black cursor-pointer bg-gray-50 transition-colors">
              <ImagePlus className="text-gray-400 mb-2" size={32} />
              <span className="text-gray-500 text-sm">Pilih Gambar</span>
              {/* Atribut 'multiple' memungkinkan pemilihan banyak gambar sekaligus */}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-black">Delay Pergantian Gambar</label>
          <p className="text-[#777777] text-[14px]">Format dalam milidetik (Contoh: 3000 = 3 Detik).</p>
          <input 
            name="delayTimer" 
            type="number" 
            defaultValue={initialData?.delayTimer || 3000}
            required 
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black text-[18px]"
          />
        </div>

        <button type="submit" disabled={loading} className="bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-800 disabled:bg-gray-400 transition-all mt-4 w-max px-10">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>

      </form>
    </motion.div>
  );
}