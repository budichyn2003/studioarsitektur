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

    // Urutan gambar (order) ditetapkan MUTLAK berdasarkan array yang dikirim dari form
    const uploadedImagesData = await Promise.all(
      validImages.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${index}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
        
        // Penetapan Order: 0 adalah cover
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

    // AMBIL INSTRUKSI MUTLAK DARI FRONTEND
    const finalOrder = JSON.parse(formData.get('finalOrder') as string || '[]');
    const deletedImages = JSON.parse(formData.get('deletedImages') as string || '[]');
    const newFiles = formData.getAll('newFiles') as File[];
    const newFilesIds = formData.getAll('newFilesIds') as string[];

    // 1. Eksekusi Penghapusan Gambar
    if (deletedImages.length > 0) {
      await prisma.projectImage.deleteMany({
        where: { id: { in: deletedImages } }
      });
    }

    // 2. Upload Gambar Baru ke Supabase
    const uploadedNewFiles: { id: string, url: string }[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const fileId = newFilesIds[i];
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `project-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error } = await supabase.storage.from('project-images').upload(fileName, file);
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
          uploadedNewFiles.push({ id: fileId, url: publicUrl });
        }
      }
    }

    // 3. Update & Insert Data ke Database dengan ORDER yang Mutlak
    for (let i = 0; i < finalOrder.length; i++) {
      const item = finalOrder[i];
      
      if (item.startsWith('existing_')) {
        // Jika gambar lama, cukup perbarui urutan index-nya saja
        const imageId = item.replace('existing_', '');
        await prisma.projectImage.update({
          where: { id: imageId },
          data: { order: i }
        });
      } else {
        // Jika gambar baru, cari url-nya dan buat data baru di database
        const uploaded = uploadedNewFiles.find(u => u.id === item);
        if (uploaded) {
          await prisma.projectImage.create({
            data: { url: uploaded.url, projectId: id, order: i, width: 1920, height: 1080 }
          });
        }
      }
    }

    // 4. Update data teks project
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
      // Mengambil gambar secara mutlak berdasarkan kolom 'order' dari database
      include: { images: { orderBy: { order: 'asc' } } }
    });
    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
}