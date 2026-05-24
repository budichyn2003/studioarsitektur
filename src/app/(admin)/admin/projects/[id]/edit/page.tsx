'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Upload, Save, Loader2, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateProject, getProject } from '@/app/actions/projects';

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920; const MAX_HEIGHT = 1080;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height = Math.round(height * MAX_WIDTH / width); width = MAX_WIDTH; } } 
        else { if (height > MAX_HEIGHT) { width = Math.round(width * MAX_HEIGHT / height); height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg', lastModified: Date.now() }));
          else resolve(file);
        }, 'image/jpeg', 0.85); 
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

type ImageItem = { id: string; url: string; isNew: boolean; file?: File };

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const [projectData, setProjectData] = useState<any>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProject(projectId).then(data => {
      setProjectData(data);
      if (data?.images) {
        // Fetch gambar sesuai urutan mutlak di database
        setImages(data.images.map((img: any) => ({ id: img.id, url: img.url, isNew: false })));
      }
    });
  }, [projectId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsCompressing(true); 
      const newItems: ImageItem[] = [];
      for (const file of files) {
        const compressedFile = file.size < 500 * 1024 ? file : await compressImage(file);
        newItems.push({
          id: `new_${Date.now()}_${Math.random()}`,
          url: URL.createObjectURL(compressedFile),
          isNew: true,
          file: compressedFile
        });
      }
      setImages(prev => [...prev, ...newItems]);
      setIsCompressing(false); 
    }
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (!target.isNew) setDeletedIds(prev => [...prev, target.id]); // Catat ID lama untuk dihapus di DB
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const setAsCover = (index: number) => {
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected); // Pindahkan paksa ke urutan pertama (Cover)
    setImages(newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const target = direction === 'left' ? index - 1 : index + 1;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) return alert("Harap sisakan minimal 1 gambar!");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Kirim instruksi mutlak ke Backend: "Ini urutan pastinya (0, 1, 2, dst)"
    const finalOrder = images.map(img => img.isNew ? img.id : `existing_${img.id}`);
    formData.append('finalOrder', JSON.stringify(finalOrder));
    formData.append('deletedImages', JSON.stringify(deletedIds));

    // Kirim file baru fisik
    images.filter(img => img.isNew).forEach(img => {
      formData.append('newFiles', img.file!);
      formData.append('newFilesIds', img.id); // Pasangkan ID acak dengan filenya
    });

    const result = await updateProject(projectId, formData);

    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  if (!projectData) return <div className="p-8 mt-20 text-center">Memuat Data Project...</div>;

  const formattedDate = projectData.projectDate ? new Date(projectData.projectDate).toISOString().split('T')[0] : '';

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24} /></Link>
        <h1 className="text-arch-black text-[28px] font-bold">Edit Project & Gallery</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* KOLOM KIRI: MULTI IMAGE MANAGER */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Manage Gallery & Cover</label>
          <div className="grid grid-cols-2 gap-4">
            
            {images.map((img, idx) => (
              <div key={img.id} className={`relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group ${idx === 0 ? 'col-span-2 aspect-[4/3] border-arch-black border-2' : 'aspect-[3/4]'}`}>
                <Image src={img.url} alt={`Image ${idx + 1}`} fill className="object-cover" sizes="300px" />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                  <div className="flex justify-between w-full">
                    {idx !== 0 ? (
                      <button type="button" onClick={() => setAsCover(idx)} className="bg-white/20 hover:bg-white text-white hover:text-black text-[10px] px-2 py-1 rounded-sm flex items-center gap-1 transition-colors"><Star size={12}/> Set Cover</button>
                    ) : <span className="bg-black text-white text-[10px] px-2 py-1 rounded-sm flex items-center gap-1"><Star size={12} className="fill-white"/> COVER</span>}
                    <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-sm transition-colors"><X size={14} /></button>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    {idx > 0 && <button type="button" onClick={() => moveImage(idx, 'left')} className="bg-white text-black p-1 rounded-full hover:scale-110 transition-transform"><ChevronLeft size={16}/></button>}
                    {idx < images.length - 1 && <button type="button" onClick={() => moveImage(idx, 'right')} className="bg-white text-black p-1 rounded-full hover:scale-110 transition-transform"><ChevronRight size={16}/></button>}
                  </div>
                </div>
              </div>
            ))}

            <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-arch-black cursor-pointer bg-gray-50 transition-colors ${images.length === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'} ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
              {isCompressing ? (
                <><Loader2 className="animate-spin text-arch-grayMenu mb-2" size={24} /><span className="text-arch-grayMenu text-[11px] text-center px-1">Optimizing...</span></>
              ) : (
                <><Upload size={24} className="text-arch-grayMenu mb-2" /><span className="text-arch-grayMenu text-[12px] font-medium">Add Photos</span></>
              )}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={isCompressing} />
            </label>
          </div>
        </div>

        {/* KOLOM KANAN: FORM DATA (Tidak diubah) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6 h-max">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Project Title</label>
            <input name="title" type="text" defaultValue={projectData.title} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] text-arch-black font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Category</label>
              <select name="category" defaultValue={projectData.category} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent uppercase">
                <option value="RESIDENTIAL">Residential</option>
                <option value="PUBLIC">Public</option>
                <option value="INSTALLATION">Installation</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Location</label>
              <input name="location" type="text" defaultValue={projectData.location} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Project Date</label>
              <input name="projectDate" type="date" defaultValue={formattedDate} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-dashed border-gray-200 pt-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Build Year</label>
              <input name="buildYear" type="text" defaultValue={projectData.buildYear || ''} placeholder="e.g. 2024" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Status</label>
              <select name="status" defaultValue={projectData.status || 'Build'} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
                <option value="Build">Build</option>
                <option value="Design">Design</option>
                <option value="On Progress">On Progress</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Architect In Charge</label>
              <input name="architectInCharge" type="text" defaultValue={projectData.architectInCharge || ''} placeholder="Nama Arsitek" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Drafter</label>
              <input name="drafter" type="text" defaultValue={projectData.drafter || ''} placeholder="Nama Drafter" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Site Area (m2)</label>
              <input name="siteArea" type="text" defaultValue={projectData.siteArea || ''} placeholder="e.g. 120" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Constructed Area (m2)</label>
              <input name="constructedArea" type="text" defaultValue={projectData.constructedArea || ''} placeholder="e.g. 200" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">In Collaborate</label>
              <input name="collaborate" type="text" defaultValue={projectData.collaborate || ''} placeholder="Partner Kolaborasi" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Photographs</label>
              <input name="photographs" type="text" defaultValue={projectData.photographs || ''} placeholder="Fotografer" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Interior</label>
              <input name="interior" type="text" defaultValue={projectData.interior || ''} placeholder="e.g. Jane Doe" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          {/* BARIS BARU UNTUK CONSTRUCTION & INTERIOR CONSTRUCTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Construction</label>
              <input name="construction" type="text" defaultValue={projectData.construction || ''} placeholder="e.g. PT Bangun Persada" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Interior Construction</label>
              <input name="interiorConstruction" type="text" defaultValue={projectData.interiorConstruction || ''} placeholder="e.g. CV Indo Karya" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 pt-6 mt-2">
            <label className="text-arch-grayMenu text-[14px]">Description</label>
            <textarea name="description" rows={5} defaultValue={projectData.descriptionId || ''} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>

          <button type="submit" disabled={loading || isCompressing} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Updating Project...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
}