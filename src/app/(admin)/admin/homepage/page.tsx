'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, ImagePlus, X } from 'lucide-react';
import { getHomepageSettings, updateHomepageSettings } from '@/app/actions/homepage';
import Image from 'next/image';

// --- MESIN KOMPRESOR OTOMATIS (Sistem Antre Client-Side) ---
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Batasi resolusi maksimal ke Full HD (1920x1080)
        const MAX_WIDTH = 1920; 
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Kompres menjadi JPEG dengan kualitas 80%
        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = file.name.replace(/\.[^/.]+$/, ".jpg");
            const newFile = new File([blob], newFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            resolve(file); // Kembalikan file asli jika error
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
// ----------------------------------------------

export default function ManageHomepage() {
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  
  // State Gambar Lama & Gambar Baru
  const [keptImages, setKeptImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  // State Toggle About Us
  const [showAboutHero, setShowAboutHero] = useState(false);

  useEffect(() => {
    getHomepageSettings().then(res => {
      if (res.success && res.data) {
        setInitialData(res.data);
        setKeptImages(res.data.imageUrls || []);
        setShowAboutHero(res.data.showAboutHero || false);
      }
    });
  }, []);

  // Handle Upload + Kompresi Antre
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsCompressing(true); // Indikator sedang mengompres

      const compressedFiles: File[] = [];
      
      // SISTEM ANTRE: Proses kompresi satu per satu agar RAM tidak jebol
      for (const file of files) {
        if (file.size < 1024 * 1024) {
          compressedFiles.push(file); // Jika < 1MB, biarkan saja
        } else {
          const compressed = await compressImage(file);
          compressedFiles.push(compressed);
        }
      }

      setNewImageFiles(prev => [...prev, ...compressedFiles]);
      const previews = compressedFiles.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...previews]);
      
      setIsCompressing(false); // Kompresi selesai
    }
  };

  const removeKeptImage = (index: number) => {
    setKeptImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Kirim data gambar lama & baru ke backend
    keptImages.forEach(url => formData.append('keptImages', url));
    newImageFiles.forEach(file => formData.append('images', file));
    
    // Kirim data toggle
    formData.append('showAboutHero', showAboutHero.toString());

    const result = await updateHomepageSettings(formData);
    if (result.success) {
      alert('Berhasil memperbarui Pengaturan!');
      window.location.reload();
    } else {
      alert('Error: ' + result.error);
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-4xl flex flex-col gap-8 pb-20">
      <h1 className="text-black text-[28px] font-bold">Manage Site Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-10">
        
        {/* HOMEPAGE SLIDER SECTION */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-black text-lg">Homepage Slider Images</label>
            <p className="text-[#777777] text-[14px]">Gambar lama tidak akan terhapus kecuali Anda menekan tombol (X). Gambar baru akan ditambahkan di akhir urutan.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tampilkan Gambar Lama */}
            {keptImages.map((src, i) => (
              <div key={`kept-${i}`} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                <Image src={src} alt={`Kept ${i}`} fill className="object-cover" />
                <button type="button" onClick={() => removeKeptImage(i)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Tampilkan Preview Gambar Baru */}
            {newImagePreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative aspect-[3/4] bg-blue-50 rounded-lg overflow-hidden border-2 border-blue-300 shadow-sm group">
                <Image src={src} alt={`New ${i}`} fill className="object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <X size={16} />
                </button>
                <span className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-[10px] px-2 py-1 rounded">NEW</span>
              </div>
            ))}
            
            {/* Tombol Tambah Gambar */}
            <label className={`flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg hover:border-black cursor-pointer bg-gray-50 transition-colors ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
              {isCompressing ? (
                <>
                  <Loader2 className="animate-spin text-gray-400 mb-2" size={32} />
                  <span className="text-gray-500 text-xs text-center px-2">Memproses...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="text-gray-400 mb-2" size={32} />
                  <span className="text-gray-500 text-sm">Tambah Gambar</span>
                </>
              )}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={isCompressing} />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-black">Delay Pergantian Gambar</label>
          <input name="delayTimer" type="number" defaultValue={initialData?.delayTimer || 3000} required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black text-[18px]" />
        </div>

        <hr className="border-gray-200" />

        {/* ABOUT US SECTION */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-black text-lg">About Us Page Setting</label>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setShowAboutHero(!showAboutHero)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showAboutHero ? 'bg-black' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAboutHero ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-[#333333] text-[15px]">Tampilkan Gambar Hero Besar di halaman About Us</span>
          </div>
        </div>

        <button type="submit" disabled={loading || isCompressing} className="bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-800 disabled:bg-gray-400 transition-all mt-4 w-max px-10">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>

      </form>
    </motion.div>
  );
}