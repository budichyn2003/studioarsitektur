'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateProject, getProject } from '@/app/actions/projects';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [projectId, setProjectId] = useState<string>('');
  const [projectData, setProjectData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  // Menarik data asli saat halaman dibuka
  useEffect(() => {
    params.then(p => {
      setProjectId(p.id);
      getProject(p.id).then((data) => {
        setProjectData(data);
        setFetching(false);
      });
    });
  }, [params]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProject(projectId, formData);

    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  // Menampilkan state loading saat data sedang ditarik
  if (fetching) return <div className="p-8 text-center text-arch-grayMenu mt-20">Memuat Data Proyek...</div>;
  if (!projectData) return <div className="p-8 text-center text-red-500 mt-20">Proyek tidak ditemukan!</div>;

  // Format tanggal untuk HTML input date (YYYY-MM-DD)
  const formattedDate = projectData.projectDate 
    ? new Date(projectData.projectDate).toISOString().split('T')[0] 
    : '';

  // Menentukan gambar mana yang ditampilkan (Preview baru atau Gambar lama dari DB)
  const displayImage = previewImage || (projectData.images[0] ? projectData.images[0].url : null);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-5xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-arch-black text-[28px] font-bold">Edit Project</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        
        {/* Kolom Kiri: Upload & Preview Gambar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Update Cover (Opsional)</label>
          <div className="relative w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-white hover:border-arch-black transition-colors cursor-pointer group">
            {displayImage ? (
              <>
                <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={32} className="text-white mb-2" />
                  <span className="text-white text-[14px]">Ganti Gambar</span>
                  <input type="file" name="image" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                <Upload size={40} className="text-arch-grayMenu mb-2" />
                <span className="text-arch-grayMenu text-[14px]">Upload New Image</span>
                <input type="file" name="image" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
          <p className="text-[12px] text-gray-500 text-center">Kosongkan jika tidak ingin mengganti gambar.</p>
        </div>

        {/* Kolom Kanan: Data Proyek (Sudah ada Pre-fill / defaultValue) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Project Title</label>
            <input name="title" type="text" required defaultValue={projectData.title} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] text-arch-black font-medium" />
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
              <input name="location" type="text" required defaultValue={projectData.location} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Project Date</label>
              <input name="projectDate" type="date" required defaultValue={formattedDate} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Architect</label>
              <input name="architect" type="text" defaultValue={projectData.architect || ''} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Photographer</label>
              <input name="photographer" type="text" defaultValue={projectData.photographer || ''} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Interior</label>
              <input name="interior" type="text" defaultValue={projectData.interior || ''} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Description</label>
            <textarea name="description" rows={5} required defaultValue={projectData.descriptionId || ''} className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>

          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}