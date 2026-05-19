'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { getAboutSettings, updateAboutSettings } from '@/app/actions/about';
import { useRouter } from 'next/navigation';

export default function AdminAboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    getAboutSettings().then(res => {
      if (res.success && res.data) {
        setData(res.data);
        setHeroPreview(res.data.heroUrl);
      }
    });
  }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('existingHeroUrl', data.heroUrl);
    formData.append('existingThumbnails', JSON.stringify(data.thumbnails));
    
    const result = await updateAboutSettings(formData);
    if (result.success) {
      alert('About Us updated successfully!');
      router.refresh();
    } else {
      alert('Error updating About Us: ' + result.error);
    }
    setLoading(false);
  };

  if (!data) return <div className="p-8 mt-20 text-center">Loading...</div>;

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 pb-20">
      <h1 className="text-arch-black text-[28px] font-bold">Manage About Us</h1>
      <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleSubmit}>
        
        {/* Toggle & Title */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Section Title</label>
            <input name="title" defaultValue={data.title} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Show Hero Image?</label>
            <select name="showHero" defaultValue={data.showHero ? 'true' : 'false'} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black bg-transparent">
              <option value="true">Yes, Show Hero Image</option>
              <option value="false">No, Hide It</option>
            </select>
          </div>
        </div>

        {/* Hero Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Update Hero Image (Portrait Mode)</label>
          <div className="relative w-[200px] aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer group hover:border-black">
            {heroPreview ? (
              <Image src={heroPreview} alt="Preview" fill className="object-cover" />
            ) : (
              <Upload className="text-gray-400" />
            )}
            <input type="file" name="heroImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleHeroChange} />
          </div>
        </div>

        {/* Multiple Thumbnails */}
        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Replace Collection Thumbnails (Select up to 4 images)</label>
          <input type="file" name="thumbnails" multiple accept="image/*" className="w-full border border-gray-200 p-2 rounded-md" />
          <p className="text-xs text-gray-400">Leave blank to keep existing thumbnails.</p>
        </div>

        {/* Content Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-arch-grayMenu text-[14px]">Description Content</label>
          <textarea name="content" rows={10} defaultValue={data.content} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-arch-black resize-y" />
        </div>

        <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-4">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Saving Changes...' : 'Save About Us'}
        </button>
      </form>
    </div>
  );
}