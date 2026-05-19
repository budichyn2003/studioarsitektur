import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function CareerListPage() {
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  let careerSetting = await prisma.careerSetting.findFirst();
  if (!careerSetting) careerSetting = await prisma.careerSetting.create({ data: {} });

  return (
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col gap-16">
      <div>
        {/* Header */}
        <h1 className="text-black text-[32px] md:text-[40px] font-medium mb-4 tracking-tight uppercase">
          Join Our Team
        </h1>
        <p className="text-[#777777] text-[15px] max-w-2xl mb-16 leading-relaxed">
          We are always looking for talented individuals who are passionate about architecture and design. Explore our open positions below.
        </p>

        {/* Grid Layout 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {careers.map((career) => {
            const excerpt = career.description.length > 140 
              ? career.description.substring(0, 140) + '...' 
              : career.description;

            return (
              <Link 
                key={career.id} 
                href={`/career/${career.id}`} 
                className="group w-full bg-white border border-gray-200 rounded-sm p-8 flex flex-col justify-between gap-6 hover:border-black transition-colors duration-300 min-h-[240px]"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-black text-[22px] font-medium tracking-tight uppercase transition-colors">
                    {career.title}
                  </h2>
                  <p className="text-[#999999] text-[14px] leading-[1.8] line-clamp-3 text-justify">
                    {excerpt}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="px-4 py-1 border border-gray-300 rounded-sm text-[12px] text-black uppercase tracking-wider font-light">
                    {career.type}
                  </span>
                  <span className="px-4 py-1 border border-gray-300 rounded-sm text-[12px] text-black uppercase tracking-wider font-light">
                    {career.location}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {careers.length === 0 && (
          <div className="p-12 text-center bg-gray-50 rounded-sm border border-gray-200 w-full max-w-5xl">
            <p className="text-[#777777] text-[15px]">Currently there are no open positions available. Please check back later!</p>
          </div>
        )}
      </div>

      {/* REVISI LAYOUT: BANNER LANDSCAPE BAWAH SECTION CAREER */}
      <div className="w-full max-w-5xl mt-4">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <Image src={careerSetting.bannerUrl} alt="Career Banner" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 80vw" />
        </div>
      </div>

    </div>
  );
}