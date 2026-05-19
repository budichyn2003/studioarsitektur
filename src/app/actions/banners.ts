'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getBanners() {
  let news = await prisma.newsSetting.findFirst();
  if (!news) news = await prisma.newsSetting.create({ data: {} });

  let career = await prisma.careerSetting.findFirst();
  if (!career) career = await prisma.careerSetting.create({ data: {} });

  return { success: true, data: { news, career } };
}

export async function updateNewsBanner(formData: FormData) {
  try {
    const image = formData.get('image') as File;
    if (!image || image.size === 0) return { success: false, error: "No image provided" };

    const fileName = `news-banner-${Date.now()}.${image.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('project-images').upload(fileName, image);
    if (error) throw error;

    const bannerUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
    const setting = await prisma.newsSetting.findFirst();
    if (setting) await prisma.newsSetting.update({ where: { id: setting.id }, data: { bannerUrl } });

    revalidatePath('/news');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateCareerBanner(formData: FormData) {
  try {
    const image = formData.get('image') as File;
    if (!image || image.size === 0) return { success: false, error: "No image provided" };

    const fileName = `career-banner-${Date.now()}.${image.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('project-images').upload(fileName, image);
    if (error) throw error;

    const bannerUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
    const setting = await prisma.careerSetting.findFirst();
    if (setting) await prisma.careerSetting.update({ where: { id: setting.id }, data: { bannerUrl } });

    revalidatePath('/career');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}