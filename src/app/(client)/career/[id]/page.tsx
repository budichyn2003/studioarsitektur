import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Mail } from "lucide-react";

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const careerId = resolvedParams.id;

  if (!careerId) return notFound();

  const career = await prisma.career.findUnique({
    where: { id: careerId },
  });

  // Jika lowongan tidak ada atau sudah ditutup (isActive false)
  if (!career || !career.isActive) return notFound();

  return (
    <div className="w-full min-h-screen pt-8 pb-20 pl-8 md:pl-24 lg:pl-[20%] pr-8 md:pr-16">
      
      <Link href="/career" className="inline-flex items-center gap-2 text-[#999999] hover:text-black transition-colors mb-10 text-[14px]">
        <ArrowLeft size={16} /> Back to Careers
      </Link>

      <div className="w-full max-w-3xl">
        <h1 className="text-black text-[36px] md:text-[42px] font-medium tracking-tight mb-6">
          {career.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[#999999] text-[14px] mb-12 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            <span>{career.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{career.location}</span>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-black text-[20px] font-medium mb-4">Job Description</h2>
          <div className="text-[#777777] text-[15px] leading-[1.8] whitespace-pre-wrap">
            {career.description}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-black text-[20px] font-medium mb-4">Requirements</h2>
          <div className="text-[#777777] text-[15px] leading-[1.8] whitespace-pre-wrap">
            {career.requirements}
          </div>
        </div>

        {/* Tombol Apply yang langsung buka email */}
        <a 
          href={`mailto:hr@stackplus.studio?subject=Application for ${career.title}`}
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Mail size={18} /> Apply Now
        </a>

      </div>
    </div>
  );
}