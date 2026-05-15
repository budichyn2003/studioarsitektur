import { prisma } from "@/lib/prisma";
import { Plus, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import CareerActions from "@/components/admin/CareerActions";

export default async function ManageCareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-arch-black text-[32px] font-bold tracking-tight">Manage Careers</h1>
          <p className="text-arch-grayText text-[16px] mt-1">Kelola lowongan pekerjaan yang tersedia.</p>
        </div>
        <Link href="/admin/careers/create" className="bg-arch-black text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
          <Plus size={20} /> Add New Career
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-arch-grayMenu text-[14px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Position</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {careers.map((career) => (
              <tr key={career.id} className="hover:bg-gray-50 transition-colors text-[15px]">
                <td className="px-6 py-4">
                  <span className="font-semibold text-arch-black text-[16px] block mb-1">{career.title}</span>
                  <div className="flex items-center gap-1 text-[#999999] text-[13px]">
                    <Briefcase size={14} /> {career.type}
                  </div>
                </td>
                <td className="px-6 py-4 text-arch-grayText">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> {career.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${career.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {career.isActive ? 'Active' : 'Closed'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <CareerActions id={career.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {careers.length === 0 && <div className="p-20 text-center text-arch-grayMenu">Belum ada lowongan pekerjaan.</div>}
      </div>
    </div>
  );
}