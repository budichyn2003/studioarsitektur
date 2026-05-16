'use server';

import { cookies } from 'next/headers';

export async function setLanguage(lang: 'ENG' | 'IND') {
  // Simpan pilihan bahasa ke dalam cookie dengan nama 'NEXT_LOCALE'
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang, { path: '/' });
}