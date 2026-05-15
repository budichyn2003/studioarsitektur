'use client';

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteNews } from "@/app/actions/news";

export default function NewsActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm("Yakin ingin menghapus berita ini? Data tidak bisa dikembalikan.")) {
      const result = await deleteNews(id);
      if (result.success) {
        router.refresh();
      } else {
        alert("Gagal menghapus berita: " + result.error);
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/news/${id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        <Edit size={18} />
      </Link>
      <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
        <Trash2 size={18} />
      </button>
    </div>
  );
}