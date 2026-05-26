'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateNews, getNewsById } from '@/app/actions/news';

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const [newsId, setNewsId] = useState('');
  const [newsData, setNewsData] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setNewsId(p.id);
      getNewsById(p.id).then(data => {
        setNewsData(data);
        if (data && data.imageUrls) setPreviewImages(data.imageUrls);
        else if (data && data.thumbnailUrl) setPreviewImages([data.thumbnailUrl]);
      });
    });
  }, [params]);

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
    formData.delete('images');
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    formData.append('existingImageUrls', JSON.stringify(newsData?.imageUrls || []));

    const result = await updateNews(newsId, formData);
    if (result.success) {
      router.push('/admin/news');
      router.refresh();
    } else {
      alert("Error: " + result.error);
      setLoading(false);
    }
  }

  if (!newsData) return <div className="p-8 mt-20 text-center">Memuat Data Berita...</div>;

  const formattedDate = newsData.publishDate ? new Date(newsData.publishDate).toISOString().split('T')[0] : '';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-5xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/news" className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></Link>
        <h1 className="text-arch-black text-[28px] font-bold">Edit News</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <input type="hidden" name="existingImage" value={newsData.thumbnailUrl || 'null'} />

        <div className="lg:col-span-1 flex flex-col gap-4">
          <label className="font-semibold text-arch-black">Ganti / Perbarui Koleksi Foto</label>
          <div className="relative w-full min-h-[140px] border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-white cursor-pointer group hover:border-arch-black p-4 text-center">
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <Upload size={32} className="text-arch-grayMenu mb-1" />
              <span className="text-arch-grayMenu text-[13px]">Upload Foto-Foto Baru</span>
              <input type="file" name="images" multiple className="hidden" onChange={handleImagesChange} accept="image/*" />
            </label>
          </div>

          {/* Row Preview Foto */}
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
            <input name="externalLink" type="url" defaultValue={newsData.externalLink || ''} placeholder="https://..." className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[14px]" />
          </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">News Title</label>
            <input name="title" type="text" required defaultValue={newsData.title} className="w-full border-b py-2 focus:outline-none focus:border-arch-black text-[18px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Author</label>
              <input name="author" type="text" defaultValue={newsData.author || ''} className="w-full border-b py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Publish Date</label>
              <input name="publishDate" type="date" required defaultValue={formattedDate} className="w-full border-b py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Content</label>
            <textarea name="content" rows={8} required defaultValue={newsData.contentId || ''} className="w-full border rounded-xl p-4 focus:outline-none focus:border-arch-black resize-none" />
          </div>
          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Update News
          </button>
        </div>
      </form>
    </motion.div>
  );
}