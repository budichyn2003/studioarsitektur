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
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i] as HTMLElement;
        const distance = Math.abs(
          child.offsetLeft - container.scrollLeft - (container.clientWidth - child.clientWidth) / 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      setActiveIndex(closestIndex);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Jalankan sekali di awal

    return () => container.removeEventListener('scroll', handleScroll);
  }, [images]);

  const scrollToImage = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) {
      container.scrollTo({
        left: child.offsetLeft - (container.clientWidth - child.clientWidth) / 2,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-4">
      <div
        ref={containerRef}
        className="w-full flex flex-row gap-4 md:gap-6 overflow-x-auto snap-x pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={image.id}
              // Mempertahankan tinggi tetap agar ASPECT RATIO asli gambar terjaga 100% (tidak stretch/terpotong)
              className="relative h-[350px] md:h-[500px] w-auto shrink-0 snap-center bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm"
            >
              <img
                src={image.url}
                alt={`${title} - Image ${index + 1}`}
                className="h-full w-auto object-contain max-w-full"
              />
            </div>
          ))
        ) : (
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 rounded-sm">
            No Images Available
          </div>
        )}
      </div>

      {/* Slide Indicator / Carousel Indicator dots di bawah gambar */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-2 w-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: index === activeIndex ? '24px' : '8px',
                backgroundColor: index === activeIndex ? '#000000' : '#D1D5DB',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}