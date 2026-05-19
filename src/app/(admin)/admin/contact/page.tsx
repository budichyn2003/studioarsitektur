'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { getContactSettings, updateContactSettings } from '@/app/actions/contact';
import { useRouter } from 'next/navigation';

export default function AdminContactPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    getContactSettings().then(res => {
      if (res.success && res.data) {
        setData(res.data);
        setBannerPreview(res.data.bannerUrl);
      }
    });
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('existingBannerUrl', data.bannerUrl);
    
    const result = await updateContactSettings(formData);
    if (result.success) {
      alert('Contact Page updated successfully!');
      router.refresh();
    } else {
      alert('Error updating Contact Page: ' + result.error);
    }
    setLoading(false);
  };

  if (!data) return <div className="p-8 mt-20 text-center">Loading...</div>;

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 pb-20">
      <h1 className="text-arch-black text-[28px] font-bold">Manage Contact Page</h1>
      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleSubmit}>
        
        {/* Text Inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Main Headline</label>
          <input name="headline" defaultValue={data.headline} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] font-medium" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Sub-Headline</label>
          <textarea name="subheadline" rows={2} defaultValue={data.subheadline} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Contact Email</label>
            <input name="email" type="email" defaultValue={data.email} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Contact Phone</label>
            <input name="phone" type="text" defaultValue={data.phone} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label className="text-arch-grayMenu text-[14px]">Studio Address</label>
          <textarea name="address" rows={2} defaultValue={data.address} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black resize-none" />
        </div>

        {/* Banner Upload */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-arch-grayMenu text-[14px]">Bottom Landscape Banner</label>
          <div className="relative w-full aspect-[4/1] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer group hover:border-black">
            {bannerPreview ? (
              <Image src={bannerPreview} alt="Preview" fill className="object-cover" />
            ) : (
              <Upload className="text-gray-400" />
            )}
            <input type="file" name="bannerImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleBannerChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Saving Changes...' : 'Save Contact Settings'}
        </button>
      </form>
    </div>
  );
}