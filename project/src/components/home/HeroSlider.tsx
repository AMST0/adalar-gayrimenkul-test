import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const HeroSlider: React.FC = () => {
  const { sliderItems } = useData();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlides = sliderItems.filter(item => item.isActive);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  if (activeSlides.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slides */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-300 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(185, 28, 28, 0.6)), url(${slide.image})`,
            }}
          >
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-10 animate-float">
              <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-80"></div>
            </div>
            <div className="absolute top-1/3 right-16 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-4 h-4 bg-red-400 rounded-full opacity-80"></div>
            </div>
            <div className="absolute bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-8 h-8 bg-white rounded-full opacity-60"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-5xl mx-auto px-6">
                {/* Dynamic Location with enhanced animation */}
                <div className="mb-6 animate-fade-in-delay">
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <span className="text-yellow-400 text-xl mr-2">📍</span>
                    <span className="text-white font-bold text-lg">
                      {t.hero.location} / {slide.location}
                    </span>
                  </div>
                </div>
                
                {/* Title with enhanced animations */}
                <h1 className="text-5xl md:text-8xl font-bold mb-8 animate-slide-up-big">
                  <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    {slide.title}
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-2xl md:text-4xl mb-10 text-gray-100 animate-fade-in-delay-2 font-light">
                  {slide.subtitle}
                </p>
                
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
      >
        <ChevronRight className="w-4 h-4 sm:w-8 sm:h-8" />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-4">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 sm:w-12 h-3 sm:h-4 bg-red-600 shadow-lg' 
                : 'w-3 sm:w-4 h-3 sm:h-4 bg-white/50 hover:bg-white/75 hover:scale-125'
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay-2 {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-big {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-up-delay {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.3s ease-out 0s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 0.3s ease-out 0s both;
        }

        .animate-slide-up-big {
          animation: slide-up-big 0.3s ease-out 0s both;
        }

        .animate-slide-up-delay {
          animation: slide-up-delay 0.3s ease-out 0s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;