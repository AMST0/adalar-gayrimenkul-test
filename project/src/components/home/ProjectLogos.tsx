import React, { useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

const ProjectLogos: React.FC = () => {
  const { projects } = useData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeProjects = projects.filter(project => project.isActive);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let reqId: number;
    const speed = 0.6; // px per frame, daha yavaş ve akıcı

    const animate = () => {
      if (container.scrollLeft >= container.scrollWidth / 4) {
        // Kalan kısmı ekleyerek yumuşak geçiş
        container.scrollLeft = container.scrollLeft - container.scrollWidth / 4;
      }
      container.scrollLeft += speed;
      reqId = requestAnimationFrame(animate);
    };
    reqId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId);
  }, [activeProjects.length]);

  if (activeProjects.length === 0) return null;

  // Duplicate projects for seamless scroll
  const duplicatedProjects = [...activeProjects, ...activeProjects];

  return (
    <section className="relative py-6 sm:py-10 bg-gray-50">
      <div className="relative max-w-6xl mx-auto">
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 sm:space-x-8 overflow-hidden min-w-0 w-full"
          style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-24 h-12 sm:w-40 sm:h-24 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-2 sm:p-6 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50">
                <div className="text-center">
                  <div className="w-16 h-8 sm:w-32 sm:h-16 mx-auto mb-1 sm:mb-2 rounded-lg overflow-hidden">
                    <img
                      src={project.logo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Proje Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth scroll effect */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
export default ProjectLogos;