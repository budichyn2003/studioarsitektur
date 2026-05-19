'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getContactSettings() {
  try {
    let setting = await prisma.contactSetting.findFirst();
    if (!setting) {
      setting = await prisma.contactSetting.create({
        data: {
          headline: "Let's discuss \nyour next project.",
          subheadline: "We are always open to discussing new projects...",
          email: "hello@architecture.com",
          phone: "+62 812 3456 7890",
          address: "Jl. Sudirman No. 123, Jakarta Selatan",
          bannerUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
        }
      });
    }
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateContactSettings(formData: FormData) {
  try {
    const headline = formData.get('headline') as string;
    const subheadline = formData.get('subheadline') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    let bannerUrl = formData.get('existingBannerUrl') as string;
    const bannerImage = formData.get('bannerImage') as File | null;

    if (bannerImage && bannerImage.size > 0) {
      const fileName = `contact-banner-${Date.now()}.${bannerImage.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('project-images').upload(fileName, bannerImage);
      if (!error) {
        bannerUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
      }
    }

    const setting = await prisma.contactSetting.findFirst();
    if (setting) {
      await prisma.contactSetting.update({
        where: { id: setting.id },
        data: { headline, subheadline, email, phone, address, bannerUrl }
      });
    }

    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}