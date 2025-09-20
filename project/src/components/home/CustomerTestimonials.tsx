// İsim sansürleme fonksiyonu
function maskName(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    // Tek isim: A******
    const first = parts[0][0].toUpperCase();
    const rest = '*'.repeat(parts[0].length - 1);
    return first + rest;
  }
  // Çoklu isim: A****** D****
  return parts.map(part => {
    const first = part[0].toUpperCase();
    const rest = '*'.repeat(part.length - 1);
    return first + rest;
  }).join(' ');
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Star } from 'lucide-react';
import { Quote } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { dbHelpers } from '../../utils/supabaseClient-new';

const CustomerTestimonials: React.FC = () => {
  const { testimonials } = useData();
  // Baloncuk görünürlüğü ve animasyon için state
  const [showBubble, setShowBubble] = useState(false);
  const bubbleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Bölüm ekrana gelince baloncuğu göster, 3.5sn sonra kaybolsun
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('testimonials-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !showBubble) {
        setShowBubble(true);
        if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
        bubbleTimeout.current = setTimeout(() => setShowBubble(false), 3500);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // İlk yüklemede de kontrol et
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
    };
  }, [showBubble]);

  // Yorum ekleme modalı için state
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rating, setRating] = useState(0);

  // Aktif testimonial (ön planda olan) state'i
  const [activeTestimonialId, setActiveTestimonialId] = useState<string | null>(null);

  // Hover ve click handler'ları
  const handleMouseEnter = (id: string) => {
    setActiveTestimonialId(id);
  };

  const handleMouseLeave = () => {
    setActiveTestimonialId(null);
  };

  const handleMobileClick = (id: string) => {
    setActiveTestimonialId(activeTestimonialId === id ? null : id);
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim() || rating === 0) return;
    
    const initials = newName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
    const newTestimonial = {
      name: newName,
      initials,
      comment: newComment,
      rating,
      is_active: false // admin onayı bekliyor
    };
    
    try {
      // Debug: Supabase bağlantısını kontrol et
      console.log('🔍 Yorum ekleme işlemi başladı...', { newName, newComment, rating });
      console.log('🔧 Supabase Config:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
      });
      
      // Supabase'a veri ekle
      const { data, error } = await dbHelpers.addTestimonial(newTestimonial);
      
      if (error) {
        console.error('❌ Supabase yorum ekleme hatası:', error);
        alert('Yorum eklenirken bir hata oluştu: ' + error.message + '\n\nLütfen .env dosyasındaki Supabase bilgilerini kontrol edin.');
        return;
      }
      
      console.log('✅ Yorum başarıyla Supabase\'a eklendi:', data);
      
      // Sadece Supabase'a eklendi, local state'i güncelleme
      // Admin panel auto-refresh sistemi otomatik olarak çekecek
      
      setNewName("");
      setNewComment("");
      setRating(0);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      alert('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const [floatingPositions, setFloatingPositions] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const activeTestimonials = useMemo(() => testimonials.filter(testimonial => testimonial.isActive), [testimonials]);

  useEffect(() => {
    // Daha iyi dağılım ile üst üste binmeyi önleme
    const count = activeTestimonials.length;
    const positions = activeTestimonials.map((_, i) => {
      const centerX = 50;
      const centerY = 50;
      
      if (count === 1) {
        return { x: centerX, y: centerY, delay: 0 };
      }
      
      if (count === 2) {
        // 2 yorum için sağ ve sol
        return {
          x: i === 0 ? 35 : 65,
          y: centerY,
          delay: i * 1.5,
        };
      }
      
      if (count === 3) {
        // 3 yorum için üçgen
        const positions = [
          { x: 50, y: 35 }, // üst
          { x: 35, y: 65 }, // sol alt
          { x: 65, y: 65 }, // sağ alt
        ];
        return { ...positions[i], delay: i * 1.5 };
      }
      
      // 4+ yorum için daire ama daha geniş yarıçap
      const angle = (i * 2 * Math.PI) / count;
      const radiusX = Math.min(30, 15 + count * 2); // Daha geniş yarıçap
      const radiusY = Math.min(25, 12 + count * 1.5);
      
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      
      return {
        x: Math.max(20, Math.min(80, x)), // %20-80 arası
        y: Math.max(30, Math.min(70, y)), // %30-70 arası
        delay: i * 1.5,
      };
    });
    setFloatingPositions(positions);
  }, [activeTestimonials.length]);

  if (activeTestimonials.length === 0) return null;

   return (
     <section id="testimonials-section" className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>


      {/* Yorum ekle baloncuğu (sadece bölüm görünürken ve showBubble true iken) */}
      {showBubble && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-amber-500 text-white rounded-full shadow-lg px-6 py-3 font-bold text-lg flex items-center gap-2 hover:bg-amber-600 transition-all duration-300 animate-bounce"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
          onClick={() => setShowModal(true)}
        >
          <span className="mr-2">Yorum yapmak ister misiniz?</span>
          <span className="inline-block animate-wave" role="img" aria-label="el">👋</span>
        </button>
      )}
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 1.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-fade-in transform transition-all duration-300 scale-100">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-light transition-colors duration-200 hover:rotate-90 transform" 
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            
            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Teşekkürler! 🎉</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yorumunuz başarıyla iletildi.<br/>
                    Admin onayından sonra sitede yayınlanacaktır.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-blue-800 text-sm font-medium">
                    💡 Yorumunuz incelendikten sonra anasayfada görünecektir
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Yorumunuzu Bırakın</h3>
                  <p className="text-gray-500">Deneyiminizi bizimle paylaşın</p>
                </div>
                
                <form onSubmit={handleAddTestimonial} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Puanınız *</label>
                    <div className="flex items-center justify-center gap-2">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                          aria-label={`Yıldız ${star}`}
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} transition-colors duration-200`} fill={star <= rating ? '#fbbf24' : 'none'} />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {rating === 5 ? "Mükemmel! 🌟" : rating === 4 ? "Çok iyi! 👍" : rating === 3 ? "İyi 👌" : rating === 2 ? "Fena değil" : "Geliştirebiliriz"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Adınız Soyadınız *</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)} 
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-200" 
                      placeholder="Adınızı girin" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Yorumunuz *</label>
                    <textarea 
                      value={newComment} 
                      onChange={e => setNewComment(e.target.value)} 
                      required 
                      rows={4} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg resize-none transition-all duration-200" 
                      placeholder="Deneyiminizi bizimle paylaşın..." 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Gönder
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-blue-200 text-lg">
            Müşterilerimizin memnuniyeti bizim en büyük başarımız
          </p>
        </div>

        <div className="relative h-96 md:h-[450px]">
          {activeTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-float"
              style={{
                left: `${floatingPositions[index]?.x || 50}%`,
                top: `${floatingPositions[index]?.y || 50}%`,
                animationDelay: `${floatingPositions[index]?.delay || 0}s`,
              }}
              onMouseEnter={() => handleMouseEnter(testimonial.id)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => handleMobileClick(testimonial.id)} // Mobilde tıklama için
            >
              <div
                id={`testimonial-${testimonial.id}`}
                className={`bg-white rounded-2xl p-6 shadow-2xl max-w-xs transition-all duration-500 group cursor-pointer ${
                  activeTestimonialId === testimonial.id 
                    ? 'scale-125 shadow-3xl ring-4 ring-amber-400' 
                    : activeTestimonialId && activeTestimonialId !== testimonial.id
                    ? 'scale-90 opacity-40 hover:opacity-70'
                    : 'hover:shadow-3xl hover:scale-105 hover:opacity-100'
                }`}
                style={{ 
                  zIndex: activeTestimonialId === testimonial.id ? 100 : activeTestimonialId ? 1 : 10,
                  transform: activeTestimonialId === testimonial.id 
                    ? 'translate(-50%, -50%) scale(1.25)' 
                    : activeTestimonialId && activeTestimonialId !== testimonial.id
                    ? 'translate(-50%, -50%) scale(0.9)'
                    : 'translate(-50%, -50%)'
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{maskName(testimonial.name)}</p>
                    <Quote className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                
                {/* Yıldız Rating Gösterimi */}
                {testimonial.rating && (
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= testimonial.rating! 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`}
                        fill={star <= testimonial.rating! ? '#fbbf24' : 'none'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 font-medium">
                      ({testimonial.rating}/5)
                    </span>
                  </div>
                )}
                
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> {/* max-w-7xl div kapanışı */}

      <style>{`
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
          animation: float 12s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default CustomerTestimonials;