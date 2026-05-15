export default function NewsLoading() {
  return (
    <div className="w-full min-h-screen pt-16 pb-24 px-6 md:px-12 lg:pl-[320px] xl:pl-[380px] pr-6 md:pr-16 flex flex-col">
      
      {/* Skeleton Judul */}
      <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md mb-12"></div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full bg-white border border-gray-100 rounded-sm p-8 flex flex-col gap-4">
            {/* Skeleton Tanggal */}
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
            {/* Skeleton Judul Berita */}
            <div className="w-3/4 h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
            {/* Skeleton Paragraf */}
            <div className="w-full h-4 bg-gray-100 animate-pulse rounded mt-2"></div>
            <div className="w-5/6 h-4 bg-gray-100 animate-pulse rounded"></div>
            {/* Skeleton Tombol */}
            <div className="w-20 h-4 bg-gray-200 animate-pulse rounded mt-4"></div>
          </div>
        ))}
      </div>

    </div>
  );
}