'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { getAboutSettings, updateAboutSettings, getTeamMembers, addTeamMember, deleteTeamMember, getFormerMembers, addFormerMember, deleteFormerMember } from '@/app/actions/about';
import { useRouter } from 'next/navigation';

export default function AdminAboutPage() {
  const [data, setData] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [formers, setFormers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const router = useRouter();

  const loadData = () => {
    getAboutSettings().then(res => {
      if (res.success && res.data) {
        setData(res.data);
        setHeroPreview(res.data.heroUrl);
      }
    });
    getTeamMembers().then(res => res.success && setTeam(res.data));
    getFormerMembers().then(res => res.success && setFormers(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroPreview(URL.createObjectURL(file));
  };

  const handleUpdateAbout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('existingHeroUrl', data.heroUrl);
    formData.append('existingThumbnails', JSON.stringify(data.thumbnails));
    
    const result = await updateAboutSettings(formData);
    if (result.success) {
      alert('About Us Settings updated!');
      router.refresh();
    } else alert('Error: ' + result.error);
    setLoading(false);
  };

  const handleAddTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await addTeamMember(new FormData(e.currentTarget));
    if (result.success) {
      (e.target as HTMLFormElement).reset();
      loadData();
    }
    setLoading(false);
  };

  const handleAddFormer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await addFormerMember(new FormData(e.currentTarget));
    if (result.success) {
      (e.target as HTMLFormElement).reset();
      loadData();
    }
    setLoading(false);
  };

  if (!data) return <div className="p-8 mt-20 text-center">Loading...</div>;

  return (
    <div className="w-full max-w-5xl flex flex-col gap-12 pb-20">
      
      {/* 1. MAIN ABOUT SETTINGS */}
      <div className="flex flex-col gap-4">
        <h1 className="text-arch-black text-[28px] font-bold">Manage About Us</h1>
        <form className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6" onSubmit={handleUpdateAbout}>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 text-[14px]">Section Title</label>
              <input name="title" defaultValue={data.title} required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black text-[18px] font-medium" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600 text-[14px]">Show Hero Image?</label>
              <select name="showHero" defaultValue={data.showHero ? 'true' : 'false'} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent">
                <option value="true">Yes, Show Hero</option>
                <option value="false">No, Hide It</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-[14px]">Update Hero Image</label>
            <div className="relative w-[150px] aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer group hover:border-black">
              {heroPreview ? <Image src={heroPreview} alt="Preview" fill className="object-cover" /> : <Upload className="text-gray-400" />}
              <input type="file" name="heroImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleHeroChange} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-[14px]">Description Content</label>
            <textarea name="content" rows={6} defaultValue={data.content} required className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-black resize-y" />
          </div>
          <button type="submit" disabled={loading} className="bg-arch-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:opacity-90 disabled:bg-gray-400 transition-all mt-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save About Text & Image
          </button>
        </form>
      </div>

      {/* 2. MANAGE TEAM MEMBERS */}
      <div className="flex flex-col gap-4">
        <h2 className="text-arch-black text-[22px] font-bold">Manage Our Team</h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <form onSubmit={handleAddTeam} className="flex gap-4 items-end border-b border-gray-100 pb-6">
            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-[13px] text-gray-500">Name</label>
              <input name="name" required className="border border-gray-200 p-2 rounded-lg text-sm" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-[13px] text-gray-500">Role</label>
              <input name="role" required className="border border-gray-200 p-2 rounded-lg text-sm" placeholder="Architect" />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-[13px] text-gray-500">Photo</label>
              <input type="file" name="image" required accept="image/*" className="text-sm" />
            </div>
            <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:opacity-80">
              <Plus size={16} /> Add
            </button>
          </form>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map(member => (
              <div key={member.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-white/90 p-3 backdrop-blur-sm">
                  <p className="font-bold text-sm text-black truncate">{member.name}</p>
                  <p className="text-xs text-gray-600 truncate">{member.role}</p>
                </div>
                <button onClick={() => deleteTeamMember(member.id).then(loadData)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MANAGE FORMER MEMBERS */}
      <div className="flex flex-col gap-4">
        <h2 className="text-arch-black text-[22px] font-bold">Manage Former Members</h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <form onSubmit={handleAddFormer} className="flex gap-4 items-end border-b border-gray-100 pb-6">
            <div className="flex flex-col gap-2 flex-grow">
              <label className="text-[13px] text-gray-500">Former Name</label>
              <input name="name" required className="border border-gray-200 p-2 rounded-lg text-sm" placeholder="E.g., Studio Avery" />
            </div>
            <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:opacity-80">
              <Plus size={16} /> Add
            </button>
          </form>
          <div className="flex flex-wrap gap-3">
            {formers.map(former => (
              <div key={former.id} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-3 text-sm">
                <span className="text-gray-700">{former.name}</span>
                <button onClick={() => deleteFormerMember(former.id).then(loadData)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}