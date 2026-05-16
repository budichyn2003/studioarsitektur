'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getHomepageSettings() {
  try {
    const settings = await prisma.homepageSetting.findFirst();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateHomepageSettings(formData: FormData) {
  try {
    const delayTimer = parseInt(formData.get('delayTimer') as string) || 3000;
    
    // Tangkap status toggle dari form (true/false)
    const showAboutHero = formData.get('showAboutHero') === 'true'; 
    
    // Tangkap array gambar lama yang TIDAK dihapus oleh admin
    const keptImages = formData.getAll('keptImages') as string[];
    
    let setting = await prisma.homepageSetting.findFirst();
    
    const imageFiles = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    // Proses upload gambar baru (jika ada)
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `home-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
          newImageUrls.push(data.publicUrl);
        }
      }
    }

    // GABUNGKAN gambar lama yang dipertahankan dengan gambar baru
    const finalImageUrls = [...keptImages, ...newImageUrls];

    if (setting) {
      await prisma.homepageSetting.update({
        where: { id: setting.id },
        data: { delayTimer, imageUrls: finalImageUrls, showAboutHero }
      });
    } else {
      await prisma.homepageSetting.create({
        data: { delayTimer, imageUrls: finalImageUrls, showAboutHero }
      });
    }

    revalidatePath('/'); 
    revalidatePath('/about-us'); 
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}