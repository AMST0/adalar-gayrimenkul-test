import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const ContactContent: React.FC = () => {
  const { addContactRequest } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    addContactRequest({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-fade-in">
            <span className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg mb-6">
              İletişim
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Bizimle İletişime Geçin
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto">
              Rüya arsanızı bulmak için buradayız. Uzman ekibimiz size en uygun çözümleri sunacak.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 transform hover:scale-105 transition-all duration-500">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-4">Mesaj Gönderin</h3>
                <p className="text-gray-600">
                  Size en kısa sürede dönüş yapacağız
                </p>
              </div>
              
              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-8 flex items-center animate-bounce">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  <span className="font-semibold">
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg group-hover:border-red-300"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </div>

                <div className="relative group">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                    E-posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg group-hover:border-red-300"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                <div className="relative group">
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 resize-none text-lg group-hover:border-red-300"
                    placeholder="Nasıl yardımcı olabiliriz? Aradığınız arsa özelliklerini belirtir misiniz?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center group hover:scale-105 transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900 text-xl mb-3">Telefon</h4>
                  <p className="text-gray-600 mb-2">+90 216 382 1234</p>
                  <p className="text-gray-600">+90 555 123 4567</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center group hover:scale-105 transition-all duration-500">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900 text-xl mb-3">E-posta</h4>
                  <p className="text-gray-600">info@adalargayrimenkul.com</p>
                  <p className="text-gray-600">satis@adalargayrimenkul.com</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-xl mb-3">Adres</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Büyükada Mah. İskele Caddesi<br />
                      No: 15/A Adalar/İstanbul
                    </p>
                    <a
                      href="https://maps.google.com"
                      className="inline-flex items-center mt-4 text-red-600 hover:text-red-700 font-semibold group-hover:translate-x-2 transition-all duration-300"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Haritada Göster
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-xl mb-3">Çalışma Saatleri</h4>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-semibold">Pazartesi - Cuma:</span> 09:00 - 18:00</p>
                      <p><span className="font-semibold">Cumartesi:</span> 09:00 - 17:00</p>
                      <p><span className="font-semibold">Pazar:</span> 10:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Ofis Konumumuz</h2>
            <p className="text-gray-600 text-lg">
              Büyükada'da merkezi konumumuzda sizleri bekliyoruz
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.7739901707894!2d29.1264645!3d40.8772956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac402bb3dbe69%3A0x6b7e2e3e2e1b1c9e!2sB%C3%BCy%C3%BCkada%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1699000000000!5m2!1str!2str"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Adalar Gayrimenkul Konum"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <style jsx>{`
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactContent;