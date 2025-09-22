import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, MapPin, Phone, Mail, Image as ImageIcon, ChevronLeft, ChevronRight, Home, User, Briefcase, Download, Share, Share2, FileText, Instagram } from 'lucide-react';
import { generatePropertyPDF, generateInstagramStory, PropertyForShare } from '../utils/shareUtils';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, agents } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const property = properties.find(p => p.id === id);
  
  // Agent ID'yi direkt kullan (Supabase'den gelen ham veri)
  const agent = property?.danismanId ? 
    agents.find(a => 
      a.id === property.danismanId || 
      a.id === (property.danismanId?.replace('-supabase', '') + '-supabase')
    ) : 
    null;

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

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key >= '1' && event.key <= '9') {
        const index = parseInt(event.key) - 1;
        if (index < images.length) {
          setCurrentImageIndex(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, images.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // PDF raporu oluştur
  const handleGeneratePDF = async () => {
    if (!property) return;
    
    setIsGeneratingPDF(true);
    try {
      const propertyForShare: PropertyForShare = {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        size: property.size,
        description: property.description,
        images: images,
        property_type: property.nitelik || 'Arsa',
        agent: agent ? {
          name: agent.name,
          phone: agent.phone,
          email: agent.email,
          image: agent.image
        } : undefined,
        zoning: property.nitelik,
        coastline: undefined,
        island: property.ada,
        deed_status: undefined,
        electricity: undefined,
        water: undefined,
        road_access: undefined
      };
      
      await generatePropertyPDF(propertyForShare);
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Instagram story oluştur
  const handleGenerateStory = async () => {
    if (!property) return;
    
    setIsGeneratingStory(true);
    try {
      const propertyForShare: PropertyForShare = {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        size: property.size,
        description: property.description,
        images: images,
        property_type: property.nitelik || 'Arsa',
        agent: agent ? {
          name: agent.name,
          phone: agent.phone,
          email: agent.email,
          image: agent.image
        } : undefined,
        zoning: property.nitelik,
        coastline: undefined,
        island: property.ada,
        deed_status: undefined,
        electricity: undefined,
        water: undefined,
        road_access: undefined
      };
      
      await generateInstagramStory(propertyForShare);
    } catch (error) {
      console.error('Instagram story oluşturulurken hata:', error);
      alert('Instagram story oluşturulurken bir hata oluştu.');
    } finally {
      setIsGeneratingStory(false);
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Sol Kolon - Görseller ve Açıklama (Daha Geniş) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Görsel Galerisi */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Ana Resim */}
              <div className="relative bg-gray-100">
                <img 
                  src={images[currentImageIndex]} 
                  alt={property.title}
                  className="main-property-image w-full h-80 md:h-[500px] lg:h-[650px] xl:h-[700px] object-contain bg-gray-100 cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsFullscreen(true)}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi';
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
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
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  {currentImageIndex + 1}/{images.length}
                </div>
                
                {/* Tam Ekran Butonu */}
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm z-10"
                  title="Tam ekran görüntüle"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>

              {/* Küçük Resim Galerisi */}
              {images.length > 1 && (
                <div className="p-3 md:p-4 bg-gray-50">
                  <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsFullscreen(true);
                        }}
                        className={`relative flex-shrink-0 w-20 h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 rounded-lg overflow-hidden transition-all duration-200 cursor-zoom-in ${
                          index === currentImageIndex 
                            ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg' 
                            : 'hover:scale-105 opacity-70 hover:opacity-100 shadow-md hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-full object-contain bg-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/128x96?text=Resim';
                          }}
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          </div>
                        )}
                        {/* Resim numarası */}
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Resim Bilgisi ve Navigasyon İpuçları */}
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Toplam </span>{images.length} resim
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>
                        {currentImageIndex + 1} / {images.length}
                      </span>
                      <span className="hidden lg:inline text-xs text-gray-500">
                        • ← → okları veya 1-{Math.min(images.length, 9)} tuşları
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobil için kaydırma ipucu */}
                  {images.length > 4 && (
                    <div className="mt-2 flex items-center justify-center md:hidden">
                      <span className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">👆</span>
                        Yan kaydırarak diğer resimleri görün
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Resim tek ise bilgi */}
              {images.length === 1 && (
                <div className="p-3 md:p-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      <span>1 resim mevcut</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="hidden sm:inline">📸</span>
                      <span>Tek görsel</span>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Sağ Kolon - Fiyat ve İletişim (Daha Dar) */}
          <div className="lg:col-span-2 space-y-6">
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
                  
                  {/* Paylaşım Butonları */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">İlanı Paylaş</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleGeneratePDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                        ) : (
                          <FileText className="w-3 h-3 mr-1" />
                        )}
                        PDF
                      </button>
                      
                      <button
                        onClick={handleGenerateStory}
                        disabled={isGeneratingStory}
                        className="flex items-center bg-gradient-to-r from-purple-600 to-red-600 text-white px-3 py-1.5 rounded text-xs hover:from-purple-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingStory ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                        ) : (
                          <Instagram className="w-3 h-3 mr-1" />
                        )}
                        Story
                      </button>

                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: property.title,
                              text: `${property.title} - ${property.location} - ${formatPrice(property.price)}`,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Bağlantı kopyalandı!');
                          }
                        }}
                        className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Paylaş
                      </button>
                    </div>
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
                    
                    {/* Paylaşım Butonları */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">İlanı Paylaş</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleGeneratePDF}
                          disabled={isGeneratingPDF}
                          className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingPDF ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                          ) : (
                            <FileText className="w-3 h-3 mr-1" />
                          )}
                          PDF
                        </button>
                        
                        <button
                          onClick={handleGenerateStory}
                          disabled={isGeneratingStory}
                          className="flex items-center bg-gradient-to-r from-purple-600 to-red-600 text-white px-3 py-1.5 rounded text-xs hover:from-purple-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingStory ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                          ) : (
                            <Instagram className="w-3 h-3 mr-1" />
                          )}
                          Story
                        </button>

                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: property.title,
                                text: `${property.title} - ${property.location} - ${formatPrice(property.price)}`,
                                url: window.location.href
                              });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert('Bağlantı kopyalandı!');
                            }
                          }}
                          className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Paylaş
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-7xl max-h-full p-4">
            <img 
              src={images[currentImageIndex]} 
              alt={property.title}
              className="max-w-full max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-black p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-black p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Close Button */}
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 text-black p-2 rounded-full hover:bg-opacity-100 transition-all"
            >
              ✕
            </button>
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 text-black px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;