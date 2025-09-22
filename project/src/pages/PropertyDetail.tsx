import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, MapPin, Phone, Mail, Image as ImageIcon, ChevronLeft, ChevronRight, Home, User, Briefcase } from 'lucide-react';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, agents } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = properties.find(p => p.id === id);
  const agent = property?.danismanId ? agents.find(a => a.id === property.danismanId) : null;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İlan bulunamadı</h2>
          <button 
            onClick={() => navigate('/arsalar')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Arsalara Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <Link to="/arsalar" className="hover:text-gray-700 transition-colors">
              Arsalar
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </nav>
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/arsalar')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4 bg-blue-50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Arsalara Geri Dön
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Sol Kolon - Görseller ve Açıklama */}
          <div className="xl:col-span-2 space-y-6">
            {/* Görsel Galerisi */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi';
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  {currentImageIndex + 1}/{images.length}
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Teknik Detaylar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Teknik Detaylar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.il && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">İl:</span>
                    <span className="text-gray-900">{property.il}</span>
                  </div>
                )}
                {property.ilce && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">İlçe:</span>
                    <span className="text-gray-900">{property.ilce}</span>
                  </div>
                )}
                {property.mahalle && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Mahalle/Köy:</span>
                    <span className="text-gray-900">{property.mahalle}</span>
                  </div>
                )}
                {property.mahalleNo && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Mahalle No:</span>
                    <span className="text-gray-900">{property.mahalleNo}</span>
                  </div>
                )}
                {property.ada && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Ada:</span>
                    <span className="text-gray-900">{property.ada}</span>
                  </div>
                )}
                {property.parsel && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Parsel:</span>
                    <span className="text-gray-900">{property.parsel}</span>
                  </div>
                )}
                {property.tapuAlani && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Tapu Alanı:</span>
                    <span className="text-gray-900">{property.tapuAlani} m²</span>
                  </div>
                )}
                {property.nitelik && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Nitelik:</span>
                    <span className="text-gray-900">{property.nitelik}</span>
                  </div>
                )}
                {property.mevkii && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Mevkii:</span>
                    <span className="text-gray-900">{property.mevkii}</span>
                  </div>
                )}
                {property.zeminTipi && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Zemin Tipi:</span>
                    <span className="text-gray-900">{property.zeminTipi}</span>
                  </div>
                )}
                {property.pafta && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Pafta:</span>
                    <span className="text-gray-900">{property.pafta}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-600">Alan:</span>
                  <span className="text-gray-900">{property.size} m²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Fiyat ve İletişim */}
          <div className="space-y-6">
            {/* Fiyat */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-600">
                  {Math.round(property.price / property.size).toLocaleString('tr-TR')} ₺/m²
                </div>
              </div>

              {agent && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Danışmanınız
                  </h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={agent.image} 
                      alt={agent.name}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-100"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">{agent.name}</div>
                      <div className="text-gray-600 text-sm">{agent.title}</div>
                      <div className="text-blue-600 text-sm font-medium">{agent.experience}</div>
                      {agent.specialties && agent.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {agent.specialties.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href={`tel:${agent.phone}`}
                      className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Hemen Ara
                    </a>
                    <a 
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      E-posta Gönder
                    </a>
                    {agent.portfolioUrl && (
                      <a 
                        href={agent.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Briefcase className="w-5 h-5 mr-2" />
                        Portföyü Görüntüle
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Agent yoksa genel bilgi */}
              {!agent && (
                <div className="border-t pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">İlan Sahibi</h3>
                    <p className="text-gray-600 text-sm mb-4">Bu ilan için detaylı bilgi almak üzere bizimle iletişime geçin.</p>
                    <Link 
                      to="/iletisim"
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      İletişime Geç
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;