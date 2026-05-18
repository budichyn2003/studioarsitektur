'use server';

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const categoryInput = formData.get('category') as string; 
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const architect = formData.get('architect') as string;
    const photographer = formData.get('photographer') as string;
    const interior = formData.get('interior') as string;
    const projectDateInput = formData.get('projectDate') as string;
    
    const buildYear = formData.get('buildYear') as string;
    const status = formData.get('status') as string;
    const architectInCharge = formData.get('architectInCharge') as string;
    const drafter = formData.get('drafter') as string;
    const siteArea = formData.get('siteArea') as string;
    const constructedArea = formData.get('constructedArea') as string;
    const collaborate = formData.get('collaborate') as string;
    const photographs = formData.get('photographs') as string;

    const imageFiles = formData.getAll('images') as File[];
    const validImages = imageFiles.filter(file => file.size > 0);

    if (validImages.length === 0) throw new Error("Minimal 1 gambar diperlukan");
    // LIMIT 5 GAMBAR SUDAH DIHAPUS (Bisa upload berapapun)

    const uploadedImagesData = await Promise.all(
      validImages.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${index}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
        
        return { url: publicUrl, width: 1920, height: 1080, order: index };
      })
    );

    await prisma.project.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        category: categoryInput.toUpperCase() as any, 
        location,
        architect,
        photographer,
        interior,
        descriptionId: description, 
        projectDate: projectDateInput ? new Date(projectDateInput) : new Date(),
        buildYear,
        status,
        architectInCharge,
        drafter,
        siteArea,
        constructedArea,
        collaborate,
        photographs,
        images: {
          create: uploadedImagesData 
        }
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/project');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat project." };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath('/admin/projects');
    revalidatePath('/project');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    // 1. Ambil semua inputan teks
    const title = formData.get('title') as string;
    const categoryInput = formData.get('category') as string; 
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const projectDateInput = formData.get('projectDate') as string;
    const buildYear = formData.get('buildYear') as string;
    const status = formData.get('status') as string;
    const architectInCharge = formData.get('architectInCharge') as string;
    const drafter = formData.get('drafter') as string;
    const siteArea = formData.get('siteArea') as string;
    const constructedArea = formData.get('constructedArea') as string;
    const collaborate = formData.get('collaborate') as string;
    const photographs = formData.get('photographs') as string;
    const interior = formData.get('interior') as string;

    // 2. Cek apakah ada file cover baru yang diunggah
    const imageFile = formData.get('image') as File | null;
    
    // Jika ada file gambar dan ukurannya lebih dari 0 (bukan file kosong)
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `cover-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
      
      // Update Cover (Gambar pertama / order: 0)
      const existingImages = await prisma.projectImage.findMany({ 
        where: { projectId: id }, 
        orderBy: { order: 'asc' } 
      });

      if (existingImages.length > 0) {
        // Ganti URL gambar pertama
        await prisma.projectImage.update({
          where: { id: existingImages[0].id },
          data: { url: publicUrl }
        });
      } else {
        // Jika project belum punya gambar sama sekali, buat baru
        await prisma.projectImage.create({
          data: { url: publicUrl, projectId: id, order: 0, width: 1920, height: 1080 }
        });
      }
    }

    // 3. Update data teks project
    await prisma.project.update({
      where: { id },
      data: {
        title,
        category: categoryInput.toUpperCase() as any, 
        location,
        descriptionId: description, 
        projectDate: projectDateInput ? new Date(projectDateInput) : new Date(),
        buildYear,
        status,
        architectInCharge,
        drafter,
        siteArea,
        constructedArea,
        collaborate,
        photographs,
        interior,
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/project');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } }
    });
    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
}