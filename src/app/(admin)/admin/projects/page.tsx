import { prisma } from "@/lib/prisma";
import { Plus, MapPin } from "lucide-react";
import Link from "next/link";
import ProjectActions from "@/components/admin/ProjectActions";

export default async function ManageProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { images: { take: 1 } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-arch-black text-[32px] font-bold tracking-tight">Manage Projects</h1>
          <p className="text-arch-grayText text-[16px] mt-1">Daftar karya arsitektur yang sudah dipublikasikan.</p>
        </div>
        <Link href="/admin/projects/create" className="bg-arch-black text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
          <Plus size={20} /> Add New Project
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-arch-grayMenu text-[14px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors text-[15px]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {project.images[0] ? (
                        <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                      )}
                    </div>
                    <span className="font-semibold text-arch-black">{project.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[12px] font-medium text-arch-grayMenu">{project.category}</span>
                </td>
                <td className="px-6 py-4 text-arch-grayText flex items-center gap-1">
                  <MapPin size={14} /> {project.location}
                </td>
                <td className="px-6 py-4">
                  {/* MEMANGGIL TOMBOL DELETE/EDIT YANG BERFUNGSI */}
                  <ProjectActions id={project.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <div className="p-20 text-center text-arch-grayMenu">Belum ada proyek. Silakan klik "Add New Project".</div>}
      </div>
    </div>
  );
}