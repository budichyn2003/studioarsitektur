'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const token = process.env.ADMIN_TOKEN;

  if (username === validUser && password === validPass) {
    // PERBAIKAN: Gunakan await cookies() untuk Next.js 15+
    const cookieStore = await cookies();
    
    cookieStore.set('admin_token', token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Username atau password salah!' };
}

export async function logoutAdmin() {
  // PERBAIKAN: Gunakan await cookies() juga untuk logout
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}