'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getAboutSettings() {
  try {
    let setting = await prisma.aboutSetting.findFirst();
    if (!setting) {
      setting = await prisma.aboutSetting.create({
        data: {
          title: "ABOUT US",
          content: "Lorem ipsum dolor sit amet...",
          showHero: true,
          heroUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
          thumbnails: []
        }
      });
    }
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAboutSettings(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const showHero = formData.get('showHero') === 'true';

    let heroUrl = formData.get('existingHeroUrl') as string;
    const heroImage = formData.get('heroImage') as File | null;

    if (heroImage && heroImage.size > 0) {
      const fileName = `about-hero-${Date.now()}.${heroImage.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('project-images').upload(fileName, heroImage);
      if (!error) {
        heroUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
      }
    }

    let thumbnails = JSON.parse(formData.get('existingThumbnails') as string || '[]');
    const thumbnailFiles = formData.getAll('thumbnails') as File[];
    const validThumbs = thumbnailFiles.filter(f => f.size > 0);

    if (validThumbs.length > 0) {
      const newThumbs = await Promise.all(validThumbs.map(async (file, idx) => {
        const fileName = `about-thumb-${Date.now()}-${idx}.${file.name.split('.').pop()}`;
        await supabase.storage.from('project-images').upload(fileName, file);
        return supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
      }));
      thumbnails = newThumbs; 
    }

    const setting = await prisma.aboutSetting.findFirst();
    if (setting) {
      await prisma.aboutSetting.update({
        where: { id: setting.id },
        data: { title, content, showHero, heroUrl, thumbnails }
      });
    }

    revalidatePath('/about-us');
    revalidatePath('/admin/about');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// CRUD TEAM MEMBERS
// ==========================================
export async function getTeamMembers() {
  try {
    const data = await prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' } });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addTeamMember(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const image = formData.get('image') as File;
    let imageUrl = '';

    if (image && image.size > 0) {
      const fileName = `team-${Date.now()}.${image.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('project-images').upload(fileName, image);
      if (!error) imageUrl = supabase.storage.from('project-images').getPublicUrl(fileName).data.publicUrl;
    }

    await prisma.teamMember.create({ data: { name, role, imageUrl } });
    revalidatePath('/about-us');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath('/about-us');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// CRUD FORMER MEMBERS
// ==========================================
export async function getFormerMembers() {
  try {
    const data = await prisma.formerMember.findMany({ orderBy: { createdAt: 'asc' } });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addFormerMember(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    await prisma.formerMember.create({ data: { name } });
    revalidatePath('/about-us');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFormerMember(id: string) {
  try {
    await prisma.formerMember.delete({ where: { id } });
    revalidatePath('/about-us');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}