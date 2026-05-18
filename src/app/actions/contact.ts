'use server';

import { prisma } from "@/lib/prisma";

export async function getContactSettings() {
  try {
    let setting = await prisma.contactSetting.findFirst();
    
    if (!setting) {
      setting = await prisma.contactSetting.create({
        data: {
          headline: "Let's discuss \nyour next project.",
          subheadline: "We are always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
          email: "hello@architecture.com",
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, Jakarta Selatan, Indonesia 12190",
          bannerUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
        }
      });
    }
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}