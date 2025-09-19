import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const CustomerTestimonials: React.FC = () => {
  const { testimonials } = useData();
  const [floatingPositions, setFloatingPositions] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const activeTestimonials = testimonials.filter(testimonial => testimonial.isActive);

  useEffect(() => {
    // Generate random positions and delays for floating effect
    const positions = activeTestimonials.map(() => ({
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
      delay: Math.random() * 2, // 0-2 seconds delay
    }));
    setFloatingPositions(positions);
  }, [activeTestimonials]);

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-blue-200 text-lg">
            Müşterilerimizin memnuniyeti bizim en büyük başarımız
          </p>
        </div>

        <div className="relative h-96 md:h-[500px]">
          {activeTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float"
              style={{
                left: `${floatingPositions[index]?.x || 50}%`,
                top: `${floatingPositions[index]?.y || 50}%`,
                animationDelay: `${floatingPositions[index]?.delay || 0}s`,
                animationDuration: `${3 + Math.random() * 2}s`, // 3-5 seconds
              }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-full mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">
                    {testimonial.initials}
                  </span>
                </div>
                <Quote className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-700 text-sm leading-relaxed mb-4 text-center">
                  "{testimonial.comment}"
                </p>
                <p className="text-blue-900 font-semibold text-center text-sm">
                  - {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Static testimonials for mobile */}
        <div className="md:hidden grid grid-cols-1 gap-6 mt-8">
          {activeTestimonials.map((testimonial) => (
            <div key={`mobile-${testimonial.id}`} className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-blue-900">{testimonial.name}</p>
                  <Quote className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          33% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translate(-50%, -50%) translateY(10px) rotate(-1deg);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default CustomerTestimonials;