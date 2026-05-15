import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-white">
      <Sidebar />
      <main className="ml-[300px] w-[calc(100%-300px)] min-h-screen relative flex flex-col">
        {children}
      </main>
    </div>
  );
}