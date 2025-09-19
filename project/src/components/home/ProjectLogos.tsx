import React, { useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

const ProjectLogos: React.FC = () => {
  const { projects } = useData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeProjects = projects.filter(project => project.isActive);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  if (activeProjects.length === 0) return null;

  // Duplicate projects for seamless scroll
  const duplicatedProjects = [...activeProjects, ...activeProjects];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Projelerimiz
          </h2>
          <p className="text-gray-600 text-lg">
            Adalar'ın en prestijli projelerinde yer almaktan gurur duyuyoruz
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex space-x-8 overflow-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-48 h-32 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-blue-900 group-hover:text-amber-600 transition-colors duration-300">
                    {project.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth scroll effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default ProjectLogos;