'use server';

import { prisma } from "@/lib/prisma";

export async function getAboutSettings() {
  try {
    let setting = await prisma.aboutSetting.findFirst();
    
    // Anti-Error Fallback: Jika admin belum pernah set, otomatis buat baris pertama
    if (!setting) {
      setting = await prisma.aboutSetting.create({
        data: {
          title: "ABOUT US",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          showHero: true,
          heroUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
          thumbnails: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=1',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=2',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=3',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop&sig=4'
          ]
        }
      });
    }
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}