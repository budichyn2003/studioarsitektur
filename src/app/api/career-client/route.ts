import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    let careerSetting = await prisma.careerSetting.findFirst();
    if (!careerSetting) careerSetting = await prisma.careerSetting.create({ data: {} });

    return NextResponse.json({
      success: true,
      careers: careers,
      banner: careerSetting.bannerUrl
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}