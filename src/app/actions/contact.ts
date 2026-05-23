'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// --- CONTACT SETTINGS ---
export async function getContactSettings() {
  try {
    let setting = await prisma.contactSetting.findFirst();
    if (!setting) {
      setting = await prisma.contactSetting.create({
        data: {}
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
    const calendlyLink = formData.get('calendlyLink') as string;

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
        data: { headline, subheadline, email, phone, address, calendlyLink, bannerUrl }
      });
    }

    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- SOCIAL MEDIA SETTINGS ---
export async function getSocialMediaSettings() {
  try {
    let setting = await prisma.socialMediaSetting.findFirst();
    if (!setting) setting = await prisma.socialMediaSetting.create({ data: {} });
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSocialMediaSettings(formData: FormData) {
  try {
    const instagram = formData.get('instagram') as string;
    const youtube = formData.get('youtube') as string;
    const linkedin = formData.get('linkedin') as string;

    const setting = await prisma.socialMediaSetting.findFirst();
    if (setting) {
      await prisma.socialMediaSetting.update({
        where: { id: setting.id },
        data: { instagram, youtube, linkedin }
      });
    }

    revalidatePath('/'); // Refresh layout yang ada sidebar-nya
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}