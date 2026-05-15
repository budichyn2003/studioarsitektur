'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createNews(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const publishDate = formData.get('publishDate') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File;

    let thumbnailUrl = null;

    // Pastikan file benar-benar ada dan dikirim
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `news-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      
      const { error } = await supabase.storage.from('project-images').upload(fileName, imageFile);
      if (error) throw new Error("Gagal mengupload gambar ke Supabase");
      
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      thumbnailUrl = data.publicUrl;
    }

    await prisma.news.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        author: author || 'Admin',
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        contentId: content,
        thumbnailUrl, // Akan masuk ke database jika berhasil
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNews(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const publishDate = formData.get('publishDate') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File;

    let thumbnailUrl = formData.get('existingImage') as string;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `news-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      
      const { error } = await supabase.storage.from('project-images').upload(fileName, imageFile);
      if (error) throw new Error("Gagal mengupload gambar baru ke Supabase");
      
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      thumbnailUrl = data.publicUrl;
    }

    await prisma.news.update({
      where: { id },
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        author: author || 'Admin',
        publishDate: publishDate ? new Date(publishDate) : undefined,
        contentId: content,
        thumbnailUrl: thumbnailUrl === 'null' ? null : thumbnailUrl,
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteNews(id: string) {
  try {
    await prisma.news.delete({ where: { id } });
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getNewsById(id: string) {
  try {
    return await prisma.news.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}