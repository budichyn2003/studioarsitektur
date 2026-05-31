'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageItem {
  id: string;
  url: string;
}

interface ProjectCarouselProps {
  images: ImageItem[];
  title: string;
}

export default function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (images.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      // Cari gambar mana yang paling dekat dengan tengah layar
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i] as HTMLElement;
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const distance = Math.abs(containerCenter - childCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      const isScrollable = container.scrollWidth > container.clientWidth;
      const scrollLeft = container.scrollLeft;

      // PERBAIKAN MUTLAK: Kunci Index secara paksa jika berada di ujung kiri atau kanan
      if (scrollLeft <= 5) {
        // Jika sedang di ujung paling kiri, paksa index jadi 0 (Tombol Next pasti HIDUP)
        closestIndex = 0;
      } else if (isScrollable && (container.scrollWidth - container.clientWidth - scrollLeft <= 5)) {
        // Jika sedang di ujung paling kanan, paksa index ke akhir (Tombol Prev pasti HIDUP)
        closestIndex = images.length - 1;
      }

      setActiveIndex(closestIndex);
    };

    // Dengarkan saat user melakukan scroll
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // PERBAIKAN: Gunakan ResizeObserver. Saat gambar selesai di-load dan ukuran berubah, cek ulang posisinya!
    const resizeObserver = new ResizeObserver(() => handleScroll());
    resizeObserver.observe(container);

    // Panggil sekali saat pertama render
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [images]);

  const scrollToImage = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    const targetElement = container.children[safeIndex] as HTMLElement;
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      // Update state langsung biar responsif
      setActiveIndex(safeIndex);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-2">
      <div
        ref={containerRef}
        className="w-full flex flex-row gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={image.id}
              className="relative h-[35vh] md:h-[45vh] max-h-[450px] w-auto shrink-0 snap-center bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm"
            >
              <img
                src={image.url}
                alt={`${title} - Image ${index + 1}`}
                className="h-full w-auto object-contain max-w-full"
              />
            </div>
          ))
        ) : (
          <div className="w-full h-[35vh] md:h-[45vh] bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 rounded-sm">
            No Images Available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-between items-center w-full text-[11px] uppercase tracking-widest text-[#999999] font-medium px-1 mt-1">
          <button
            onClick={() => scrollToImage(activeIndex - 1)}
            className={`hover:text-black transition-colors px-2 py-1 -ml-2 ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed hover:text-[#999999]' : ''}`}
            disabled={activeIndex === 0}
          >
            Previous
          </button>
          
          <button
            onClick={() => scrollToImage(activeIndex + 1)}
            className={`hover:text-black transition-colors px-2 py-1 -mr-2 ${activeIndex === images.length - 1 ? 'opacity-30 cursor-not-allowed hover:text-[#999999]' : ''}`}
            disabled={activeIndex === images.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}