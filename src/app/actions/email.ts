'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicationEmail(formData: FormData) {
  try {
    const jobTitle = formData.get('jobTitle') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const cv = formData.get('cv') as File;
    const portfolio = formData.get('portfolio') as File;

    let attachments = [];
    
    // Proses file CV menjadi Buffer
    if (cv && cv.size > 0) {
      const cvBuffer = Buffer.from(await cv.arrayBuffer());
      attachments.push({ filename: cv.name, content: cvBuffer });
    }

    // Proses file Portfolio menjadi Buffer
    if (portfolio && portfolio.size > 0) {
      const portBuffer = Buffer.from(await portfolio.arrayBuffer());
      attachments.push({ filename: portfolio.name, content: portBuffer });
    }

    await resend.emails.send({
      from: 'Career Portal <onboarding@resend.dev>', // Default Resend untuk testing
      to: 'infogigihproject@gmail.com', // Email tujuan asli
      subject: `New Application: ${jobTitle} - ${name}`,
      text: `Ada lamaran baru masuk dari Website Portfolio!\n\nPosisi: ${jobTitle}\nNama Lengkap: ${name}\nEmail: ${email}\nWhatsApp: ${phone || '-'}\n\nFile CV dan Portfolio terlampir pada email ini.`,
      attachments: attachments,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal mengirim email' };
  }
}