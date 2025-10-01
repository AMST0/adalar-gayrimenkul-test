import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const ProjectLogos: React.FC = () => {
  const { projects } = useData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeProjects = projects.filter(project => project.isActive);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Sadece gerçek bir kaydırma varsa pause et
    if (touchStart) {
      const distance = Math.abs(touchStart - e.targetTouches[0].clientX);
      if (distance > 10) { // 10px'den fazla hareket varsa
        setIsPaused(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    if (isLeftSwipe) {
      // Sol kaydırma - sağa scroll
      container.scrollLeft += 200;
    }
    if (isRightSwipe) {
      // Sağ kaydırma - sola scroll
      container.scrollLeft -= 200;
    }
    
    // Kısa bir süre sonra auto-scroll'u yeniden başlat
    setTimeout(() => setIsPaused(false), 1500);
  };

  // Otomatik akış (iOS uyumluluğu için hem rAF hem interval fallback)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // İçerik kısa ise kaydırma gereksiz
    if (container.scrollWidth <= container.clientWidth) return;
    if (isPaused) return;

    let frameId: number | null = null;
    let intervalId: any = null;
    const speed = 0.6; // px per frame

    const step = () => {
      if (!container) return;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0; // loop
      }
      container.scrollLeft += speed;
      frameId = requestAnimationFrame(step);
    };

    // requestAnimationFrame başlat
    frameId = requestAnimationFrame(step);

    // iOS Safari bazen rAF ile pasif kalabiliyor; düşük frekanslı fallback
    intervalId = setInterval(() => {
      if (!container) return;
      if (isPaused) return;
      container.scrollLeft += 1.2; // hafif itme
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }, 1200);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeProjects.length, isPaused]);

  if (activeProjects.length === 0) return null;

  // Duplicate projects for seamless scroll
  const duplicatedProjects = [...activeProjects, ...activeProjects];

  // iOS momentum & touch optimizasyonu için inline stil nesnesi
  const scrollStyles: React.CSSProperties = {
    scrollBehavior: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
  };

  return (
    <section className="relative py-4 sm:py-8 bg-gray-50">
      <div className="relative max-w-6xl mx-auto">
        <div
          ref={scrollContainerRef}
          className="flex space-x-2 sm:space-x-6 overflow-hidden min-w-0 w-full select-none"
          style={scrollStyles}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => window.innerWidth >= 768 && setIsPaused(true)}
          onMouseLeave={() => window.innerWidth >= 768 && setIsPaused(false)}
        >
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-20 h-10 sm:w-36 sm:h-20 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-1 sm:p-4 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50">
                <div className="text-center">
                  <div className="w-14 h-7 sm:w-28 sm:h-14 mx-auto mb-1 sm:mb-2 rounded-lg overflow-hidden">
                    <img
                      src={project.logo}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      alt="Proje Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth scroll effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
export default ProjectLogos;