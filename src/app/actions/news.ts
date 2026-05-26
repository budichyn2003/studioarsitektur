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
    const externalLink = formData.get('externalLink') as string; // <--- TANGKAP LINK
    
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    let thumbnailUrl: string | null = null;

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `news-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
          
          const { error } = await supabase.storage.from('project-images').upload(fileName, file);
          if (error) throw new Error("Gagal mengupload gambar ke Supabase");
          
          const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
          imageUrls.push(data.publicUrl);
        }
      }
    }

    if (imageUrls.length > 0) {
      thumbnailUrl = imageUrls[0];
    }

    await prisma.news.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        author: author || 'Admin',
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        contentId: content,
        externalLink: externalLink || null, // <--- SIMPAN LINK
        thumbnailUrl,
        imageUrls,
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
    const externalLink = formData.get('externalLink') as string; // <--- TANGKAP LINK
    
    const newFiles = formData.getAll('images') as File[];
    let existingUrls = JSON.parse(formData.get('existingImageUrls') as string || '[]');
    let thumbnailUrl = formData.get('existingImage') as string;

    if (newFiles && newFiles.length > 0 && newFiles[0].size > 0) {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `news-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
          
          const { error } = await supabase.storage.from('project-images').upload(fileName, file);
          if (error) throw new Error("Gagal mengupload gambar baru ke Supabase");
          
          const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
          uploadedUrls.push(data.publicUrl);
        }
      }
      existingUrls = uploadedUrls; 
      thumbnailUrl = uploadedUrls[0];
    }

    await prisma.news.update({
      where: { id },
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        author: author || 'Admin',
        publishDate: publishDate ? new Date(publishDate) : undefined,
        contentId: content,
        externalLink: externalLink || null, // <--- SIMPAN LINK
        thumbnailUrl: thumbnailUrl === 'null' ? null : thumbnailUrl,
        imageUrls: existingUrls,
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