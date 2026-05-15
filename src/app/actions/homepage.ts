'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Fungsi untuk mengambil data (Dipakai di Klien & Admin)
export async function getHomepageSettings() {
  try {
    const settings = await prisma.homepageSetting.findFirst();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Fungsi untuk menyimpan data dari Admin Panel
export async function updateHomepageSettings(formData: FormData) {
  try {
    const delayTimer = parseInt(formData.get('delayTimer') as string) || 3000;
    
    let setting = await prisma.homepageSetting.findFirst();
    
    // Ambil gambar yang diupload
    const imageFiles = formData.getAll('images') as File[];
    const newImageUrls: string[] = [];

    // Proses upload gambar baru ke Supabase Storage
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `home-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        
        // Kita simpan di bucket 'project-images' yang sudah ada sebelumnya
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
          newImageUrls.push(data.publicUrl);
        }
      }
    }

    // Jika admin mengupload gambar baru, timpa gambar lama. Jika tidak, pertahankan yang lama.
    let finalImageUrls = setting?.imageUrls || [];
    if (newImageUrls.length > 0) {
      finalImageUrls = newImageUrls;
    }

    if (setting) {
      await prisma.homepageSetting.update({
        where: { id: setting.id },
        data: { delayTimer, imageUrls: finalImageUrls }
      });
    } else {
      await prisma.homepageSetting.create({
        data: { delayTimer, imageUrls: finalImageUrls }
      });
    }

    revalidatePath('/'); // Refresh halaman utama
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}