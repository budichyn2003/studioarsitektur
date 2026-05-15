'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);

    if (result.success) {
      router.push('/admin/projects'); // Arahkan ke dashboard jika sukses
      router.refresh();
    } else {
      setError(result.error || 'Terjadi kesalahan');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-200 shadow-xl">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-black text-white text-[24px] font-bold flex items-center justify-center rounded-lg mx-auto mb-4">
            N
          </div>
          <h1 className="text-[24px] font-bold text-black">Admin Panel</h1>
          <p className="text-gray-500 text-[14px] mt-1">Silakan login untuk mengelola CMS</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-[14px]">Username</label>
            <input 
              name="username" 
              type="text" 
              required 
              className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black text-[16px]"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-[14px]">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black text-[16px]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-medium mt-4 hover:bg-gray-800 transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}