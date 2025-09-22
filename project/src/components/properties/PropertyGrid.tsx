import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Square, TrendingUp, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const PropertyGrid: React.FC = () => {
  const { properties } = useData();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  
  const activeProperties = properties.filter(property => property.isActive);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(activeProperties.length / itemsPerPage);
  
  const currentProperties = activeProperties.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (activeProperties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Square className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Yakında Yeni Arsalar</h3>
            <p className="text-gray-600 text-lg mb-8">
              Adalar'ın en değerli arsaları çok yakında burada olacak.
            </p>
            <a
              href="/iletisim"
              className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5 mr-2" />
              Bilgi Almak İstiyorum
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold text-lg">{t.common.premiumCollection}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-2">
            Adalar'ın En Değerli Toprakları
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Yatırım potansiyeli yüksek, eşsiz manzaralı arsalarımızla geleceğinizi planlayın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProperties.map((property, index) => (
            <div
              key={property.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.8s ease-out both',
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {formatPrice(property.price)}
                </div>

                {/* Featured Badge */}
                {property.isFeatured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Öne Çıkan
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-xl font-bold mb-2">Detayları Görüntüle</h4>
                    <p className="text-gray-200">Daha fazla bilgi için tıklayın</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {property.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Square className="w-5 h-5 mr-3 text-red-500" />
                    <span className="font-medium">{property.size} m²</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-5 h-5 mr-3 text-green-500" />
                    <span className="font-bold">Yüksek Yatırım Potansiyeli</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                  {property.description}
                </p>
                
                <div className="flex space-x-3">
                  <Link
                    to="/iletisim"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    İletişime Geç
                  </Link>
                  <Link
                    to={`/arsalar/${property.id}`}
                    className="flex-1 border-2 border-gray-900 text-gray-900 py-3 px-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 text-center transform hover:scale-105"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-16">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Önceki</span>
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 ${
                    index === currentPage
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default PropertyGrid;