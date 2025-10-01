import React from 'react';
import PropertyGrid from '../components/properties/PropertyGrid';
import { useLanguage } from '../contexts/LanguageContext';

const Properties: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-24 pb-16">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg">
              {t.common.premiumCollection}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t.properties}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Adalar'ın en değerli ve yatırım potansiyeli yüksek arsalarını keşfedin. 
              Her biri özenle seçilmiş, geleceğin değerli toprakları.
            </p>
          </div>
          
          {/* Dynamic Location Display & Sahibinden Button */}
          <div className="mt-12 space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <span className="text-yellow-400 font-bold text-lg mr-2">📍</span>
              <span className="text-white font-semibold">
                Adalar Gayrimenkul 
              </span>
            </div>
            
            <div className="mt-6">
              <a
                href="https://adalargayrimenkul.sahibinden.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <img 
                  src="https://s0.shbdn.com/assets/images/sahibindencom-logo-s:6af6f8af6cb352097d43a6709122523d.png" 
                  alt="Sahibinden.com" 
                  className="mr-3 h-6 w-auto"
                />
                Sahibinden.com'daki Tüm İlanlarımız
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 animate-float">
          <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/3 right-16 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-4 h-4 bg-red-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-8 h-8 bg-white rounded-full opacity-40"></div>
        </div>
      </section>

      <PropertyGrid />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Properties;