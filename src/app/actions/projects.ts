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
    
    // --- TANGKAPAN DATA BARU ---
    const buildYear = formData.get('buildYear') as string;
    const status = formData.get('status') as string;
    const architectInCharge = formData.get('architectInCharge') as string;
    const drafter = formData.get('drafter') as string;
    const siteArea = formData.get('siteArea') as string;
    const constructedArea = formData.get('constructedArea') as string;
    const collaborate = formData.get('collaborate') as string;
    const photographs = formData.get('photographs') as string;

    const imageFile = formData.get('image') as File;

    if (!imageFile) throw new Error("Image is required");

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, imageFile);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(filePath);

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
        // --- SIMPAN DATA BARU ---
        buildYear,
        status,
        architectInCharge,
        drafter,
        siteArea,
        constructedArea,
        collaborate,
        photographs,
        images: {
          create: { url: publicUrl, width: 1920, height: 1080, order: 0 }
        }
      },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/project');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create project" };
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
    const architect = formData.get('architect') as string;
    const photographer = formData.get('photographer') as string;
    const interior = formData.get('interior') as string;
    const projectDateInput = formData.get('projectDate') as string;

    // --- TANGKAPAN DATA BARU ---
    const buildYear = formData.get('buildYear') as string;
    const status = formData.get('status') as string;
    const architectInCharge = formData.get('architectInCharge') as string;
    const drafter = formData.get('drafter') as string;
    const siteArea = formData.get('siteArea') as string;
    const constructedArea = formData.get('constructedArea') as string;
    const collaborate = formData.get('collaborate') as string;
    const photographs = formData.get('photographs') as string;
    
    await prisma.project.update({
      where: { id },
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        category: categoryInput.toUpperCase() as any, 
        location,
        architect,
        photographer,
        interior,
        descriptionId: description, 
        projectDate: projectDateInput ? new Date(projectDateInput) : undefined,
        // --- SIMPAN DATA BARU ---
        buildYear,
        status,
        architectInCharge,
        drafter,
        siteArea,
        constructedArea,
        collaborate,
        photographs,
      },
    });

    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, imageFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(filePath);
        await prisma.projectImage.deleteMany({ where: { projectId: id } });
        await prisma.projectImage.create({
          data: { url: publicUrl, width: 1920, height: 1080, order: 0, projectId: id }
        });
      }
    }

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
      include: { images: true }
    });
    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
}