'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCareer(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const requirements = formData.get('requirements') as string;
    const isActive = formData.get('isActive') === 'true';

    await prisma.career.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        location,
        type,
        description,
        requirements,
        isActive,
      },
    });

    revalidatePath('/admin/careers');
    revalidatePath('/career');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCareer(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const requirements = formData.get('requirements') as string;
    const isActive = formData.get('isActive') === 'true';

    await prisma.career.update({
      where: { id },
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000),
        location,
        type,
        description,
        requirements,
        isActive,
      },
    });

    revalidatePath('/admin/careers');
    revalidatePath('/career');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCareer(id: string) {
  try {
    await prisma.career.delete({ where: { id } });
    revalidatePath('/admin/careers');
    revalidatePath('/career');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCareerById(id: string) {
  try {
    return await prisma.career.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}