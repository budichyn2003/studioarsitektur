export default function ProjectLoading() {
  return (
    // Memakai padding kiri yang konsisten dengan halaman aslinya
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col">
      
      {/* Skeleton Menu Filter */}
      <div className="flex justify-end mb-12 gap-6">
        <div className="w-10 h-5 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-20 h-5 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-16 h-5 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Skeleton Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="w-full bg-gray-100 animate-pulse rounded-sm break-inside-avoid"
            style={{ 
              aspectRatio: i % 2 === 0 ? '3/4' : '4/3' // Variasi tinggi grid agar mirip aslinya
            }}
          />
        ))}
      </div>

    </div>
  );
}