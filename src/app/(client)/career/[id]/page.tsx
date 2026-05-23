import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import ApplyButton from "./ApplyButton"; // Memanggil fitur Popup baru!

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const careerId = resolvedParams.id;

  if (!careerId) return notFound();

  const career = await prisma.career.findUnique({
    where: { id: careerId },
  });

  if (!career || !career.isActive) return notFound();

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 bg-white">
      
      <Link href="/career" className="inline-flex items-center gap-2 text-[#999999] hover:text-black transition-colors mb-10 text-[13px] uppercase tracking-wider font-medium">
        <ArrowLeft size={14} /> Back to Careers
      </Link>

      <div className="w-full max-w-3xl">
        <h1 className="text-black text-[28px] md:text-[36px] font-bold tracking-tight uppercase mb-6 leading-tight">
          {career.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[#999999] text-[13px] mb-12 border-b border-gray-100 pb-6 uppercase tracking-wider font-medium">
          <div className="flex items-center gap-2">
            <Briefcase size={14} />
            <span>{career.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{career.location}</span>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-black text-[16px] font-bold uppercase tracking-wider mb-4">Job Description</h2>
          <div className="text-[#555555] text-[15px] leading-[1.8] whitespace-pre-wrap text-justify">
            {career.description}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-black text-[16px] font-bold uppercase tracking-wider mb-4">Requirements</h2>
          <div className="text-[#555555] text-[15px] leading-[1.8] whitespace-pre-wrap text-justify">
            {career.requirements}
          </div>
        </div>

        {/* Memanggil komponen interaktif Popup Form yang baru kita buat! */}
        <ApplyButton jobTitle={career.title} />

      </div>
    </div>
  );
}