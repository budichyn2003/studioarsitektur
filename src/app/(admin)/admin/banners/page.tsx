'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { getBanners, updateNewsBanner, updateCareerBanner } from '@/app/actions/banners';

export default function AdminBannersPage() {
  const [data, setData] = useState<any>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingCareer, setLoadingCareer] = useState(false);
  const [newsPreview, setNewsPreview] = useState('');
  const [careerPreview, setCareerPreview] = useState('');

  useEffect(() => {
    getBanners().then(res => {
      if (res.success && res.data) {
        setData(res.data);
        setNewsPreview(res.data.news.bannerUrl);
        setCareerPreview(res.data.career.bannerUrl);
      }
    });
  }, []);

  const handleNewsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingNews(true);
    const result = await updateNewsBanner(new FormData(e.currentTarget));
    if (result.success) alert('News Banner updated!');
    else alert('Error: ' + result.error);
    setLoadingNews(false);
  };

  const handleCareerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCareer(true);
    const result = await updateCareerBanner(new FormData(e.currentTarget));
    if (result.success) alert('Career Banner updated!');
    else alert('Error: ' + result.error);
    setLoadingCareer(false);
  };

  if (!data) return <div className="p-8 mt-20 text-center">Loading...</div>;

  return (
    <div className="w-full max-w-4xl flex flex-col gap-12 pb-20">
      <h1 className="text-arch-black text-[28px] font-bold">Manage Page Banners</h1>
      
      {/* NEWS BANNER FORM */}
      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4" onSubmit={handleNewsSubmit}>
        <h2 className="text-xl font-medium mb-2">1. News Section Banner</h2>
        <div className="relative w-full aspect-[4/1] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer group">
          {newsPreview ? <Image src={newsPreview} alt="Preview" fill className="object-cover" /> : <Upload className="text-gray-400" />}
          <input required type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={e => e.target.files?.[0] && setNewsPreview(URL.createObjectURL(e.target.files[0]))} />
        </div>
        <button type="submit" disabled={loadingNews} className="bg-arch-black text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-2 w-max px-8">
          {loadingNews ? <Loader2 className="animate-spin" /> : <Save size={18} />} Update News Banner
        </button>
      </form>

      {/* CAREER BANNER FORM */}
      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4" onSubmit={handleCareerSubmit}>
        <h2 className="text-xl font-medium mb-2">2. Career Section Banner</h2>
        <div className="relative w-full aspect-[4/1] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer group">
          {careerPreview ? <Image src={careerPreview} alt="Preview" fill className="object-cover" /> : <Upload className="text-gray-400" />}
          <input required type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={e => e.target.files?.[0] && setCareerPreview(URL.createObjectURL(e.target.files[0]))} />
        </div>
        <button type="submit" disabled={loadingCareer} className="bg-arch-black text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-2 w-max px-8">
          {loadingCareer ? <Loader2 className="animate-spin" /> : <Save size={18} />} Update Career Banner
        </button>
      </form>
    </div>
  );
}