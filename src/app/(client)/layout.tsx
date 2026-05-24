import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-white">
      <Sidebar />
      {/* PERBAIKAN RESPONSIVE DI SINI:
        - Mobile: w-full dan pt-[80px] (agar tidak tertutup burger header)
        - Desktop (lg): ml-[300px], w-[calc(100%-300px)], dan pt-0 (kembali ke desain asli)
      */}
      <main className="w-full pt-[80px] lg:pt-0 lg:ml-[300px] lg:w-[calc(100%-300px)] min-h-screen relative flex flex-col">
        {children}
      </main>
    </div>
  );
}