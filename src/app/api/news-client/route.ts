import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Ambil seluruh daftar berita diurutkan dari yang paling baru
    const news = await prisma.news.findMany({
      orderBy: { 
        publishDate: 'desc' 
      },
    });

    // 2. Ambil settingan banner landscape bagian bawah halaman news
    let newsSetting = await prisma.newsSetting.findFirst();
    
    // Jika data settingan belum ada di database, buat instansi default agar tidak null
    if (!newsSetting) {
      newsSetting = await prisma.newsSetting.create({ 
        data: {} 
      });
    }

    // 3. Kembalikan data dalam bentuk JSON response yang siap dikonsumsi front-end
    return NextResponse.json({
      success: true,
      news: news,
      banner: newsSetting.bannerUrl
    });

  } catch (error: any) {
    console.error("Error on news-client API Route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error",
        details: error.message 
      },
      { status: 500 }
    );
  }
}