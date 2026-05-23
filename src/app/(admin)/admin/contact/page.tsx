'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { getContactSettings, updateContactSettings, getSocialMediaSettings, updateSocialMediaSettings } from '@/app/actions/contact';
import { useRouter } from 'next/navigation';

export default function AdminContactPage() {
  const [data, setData] = useState<any>(null);
  const [socialData, setSocialData] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const contactRes = await getContactSettings();
      if (contactRes.success && contactRes.data) {
        setData(contactRes.data);
        setBannerPreview(contactRes.data.bannerUrl || '');
      } else {
        setData({});
      }

      const socialRes = await getSocialMediaSettings();
      if (socialRes.success && socialRes.data) {
        setSocialData(socialRes.data);
      } else {
        setSocialData({});
      }
    };
    fetchData();
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingContact(true);
    const formData = new FormData(e.currentTarget);
    formData.append('existingBannerUrl', data.bannerUrl || '');
    
    const result = await updateContactSettings(formData);
    if (result.success) alert('Contact Page updated successfully!');
    else alert('Error: ' + result.error);
    setLoadingContact(false);
  };

  const handleSocialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSocial(true);
    const result = await updateSocialMediaSettings(new FormData(e.currentTarget));
    if (result.success) {
      alert('Social Media Links updated!');
      router.refresh();
    }
    else alert('Error: ' + result.error);
    setLoadingSocial(false);
  };

  if (!data || !socialData) return <div className="p-8 mt-20 text-center text-gray-500">Loading... (Pastikan koneksi database aman)</div>;

  return (
    <div className="w-full max-w-5xl flex flex-col gap-12 pb-20 animate-in fade-in duration-500">
      
      {/* SECTION 1: CONTACT INFO */}
      <div className="flex flex-col gap-4">
        <h1 className="text-arch-black text-[28px] font-bold">Manage Contact Page</h1>
        <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleContactSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Main Headline</label>
            <input name="headline" defaultValue={data.headline || ''} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black text-[18px] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Sub-Headline</label>
            <textarea name="subheadline" rows={2} defaultValue={data.subheadline || ''} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Contact Email</label>
              <input name="email" type="email" defaultValue={data.email || ''} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Contact Phone</label>
              <input name="phone" type="text" defaultValue={data.phone || ''} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Studio Address</label>
              <textarea name="address" rows={2} defaultValue={data.address || ''} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black resize-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-arch-grayMenu text-[14px]">Calendly Link (Book a Meet)</label>
              <input name="calendlyLink" type="url" defaultValue={data.calendlyLink || ''} placeholder="https://calendly.com/your-link" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-arch-grayMenu text-[14px]">Bottom Landscape Banner</label>
            <div className="relative w-[300px] aspect-[3/1] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer group hover:border-black">
              {/* PENAMBAHAN SIZES PROP AGAR WARNING HILANG */}
              {bannerPreview ? <Image src={bannerPreview} alt="Preview" fill className="object-cover" sizes="300px" /> : <Upload className="text-gray-400" />}
              <input type="file" name="bannerImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleBannerChange} />
            </div>
          </div>
          <button type="submit" disabled={loadingContact} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 w-max px-10 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-2">
            {loadingContact ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save Contact Settings
          </button>
        </form>
      </div>

      {/* SECTION 2: SOCIAL MEDIA INFO */}
      <div className="flex flex-col gap-4">
        <h2 className="text-arch-black text-[22px] font-bold">Manage Social Media Links (Sidebar)</h2>
        <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleSocialSubmit}>
          <p className="text-sm text-gray-500">Biarkan kosong jika ikon tidak ingin ditampilkan di Sidebar klien.</p>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">Instagram URL</label>
            <input name="instagram" type="url" defaultValue={socialData.instagram || ''} placeholder="https://instagram.com/..." className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">YouTube URL</label>
            <input name="youtube" type="url" defaultValue={socialData.youtube || ''} placeholder="https://youtube.com/..." className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-arch-grayMenu text-[14px]">LinkedIn URL</label>
            <input name="linkedin" type="url" defaultValue={socialData.linkedin || ''} placeholder="https://linkedin.com/in/..." className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-arch-black" />
          </div>
          <button type="submit" disabled={loadingSocial} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 w-max px-10 hover:bg-opacity-90 disabled:bg-gray-400 transition-all mt-2">
            {loadingSocial ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save Social Links
          </button>
        </form>
      </div>
    </div>
  );
}