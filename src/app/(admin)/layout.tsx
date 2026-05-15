import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Background dibuat abu-abu sangat muda (bg-gray-50) agar kontras dengan card putih di dalamnya
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Admin statis di kiri */}
      <AdminSidebar />
      
      {/* Area Konten Dinamis di Kanan */}
      <main className="ml-[280px] w-[calc(100%-280px)] min-h-screen p-10">
        {children}
      </main>
    </div>
  );
}