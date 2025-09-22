import React from 'react';
import { MapPin, Square, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const FeaturedProperties: React.FC = () => {
  const { properties } = useData();
  const featuredProperties = properties.filter(property => property.isActive && property.isFeatured);

  if (featuredProperties.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gray-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
            Premium Collection
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Öne Çıkan Arsalarımız
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Adalar'ın en değerli ve yatırım potansiyeli yüksek arsalarından özenle seçilmiş örnekler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProperties.slice(0, 3).map((property, index) => (
            <div
              key={property.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:scale-105 cursor-pointer"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 1s ease-out both',
              }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl">
                  {formatPrice(property.price)}
                </div>

                {/* Featured Badge */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold shadow-xl flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Öne Çıkan
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-blue-900 px-4 py-2 rounded-full font-semibold shadow-lg">
                  📍 {property.location}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                  {property.title}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    <span className="font-semibold">{property.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Square className="w-5 h-5 mr-3 text-red-500" />
                    <span className="font-semibold">{property.size} m²</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-5 h-5 mr-3 text-green-500" />
                    <span className="font-bold">Yüksek Yatırım Potansiyeli</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                  {property.description}
                </p>
                
                <div className="flex space-x-4">
                  <a
                    href={`/arsalar?id=${property.id}`}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Detayları Gör
                  </a>
                  <a
                    href="/iletisim"
                    className="flex-1 border-2 border-gray-900 text-gray-900 py-3 px-4 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 text-center transform hover:scale-105"
                  >
                    İletişime Geç
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/arsalar"
            className="inline-flex items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-gray-800 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
          >
            <TrendingUp className="mr-3 w-6 h-6" />
            Tüm Arsaları Keşfet
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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

export default FeaturedProperties;