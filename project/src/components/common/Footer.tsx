import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold"><img src="https://i.hizliresim.com/noxmykv.png" alt="" /></h3>
                <p className="text-red-300 text-sm font-semibold">Premium Real Estate</p>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed">
              Adalar'ın en prestijli gayrimenkul danışmanlık firması. 
              15 yılı aşkın deneyimimizle rüya arsanızı bulmanızda size yardımcı olmaktan gurur duyuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative">
              Hızlı Erişim
              <span className="absolute bottom-0 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <nav className="space-y-3">
              <a 
                href="/" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → Ana Sayfa
              </a>
              <a 
                href="/biz-kimiz" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → Biz Kimiz
              </a>
              <a 
                href="/danismanlar" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → Danışmanlar
              </a>
              <a 
                href="/arsalar" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → Arsalar
              </a>
              <a 
                href="/iletisim" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → İletişim
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative">
              İletişim Bilgileri
              <span className="absolute bottom-0 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-200 group-hover:text-white transition-colors">+90 216 382 1234</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-200 group-hover:text-white transition-colors">info@adalargayrimenkul.com</span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-200 group-hover:text-white transition-colors">
                  Büyükada Mah. İskele Caddesi<br />
                  No: 15/A Adalar/İstanbul
                </span>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative">
              Bizi Takip Edin
              <span className="absolute bottom-0 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-8">
              <p className="text-blue-200 text-sm mb-4">
                Özel fırsatlardan ilk siz haberdar olun!
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 text-sm bg-blue-800/50 border border-blue-700 rounded-l-xl text-white placeholder-blue-300 focus:outline-none focus:border-red-500 backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-r-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © 2024 Adalar Gayrimenkul. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                Kullanım Koşulları
              </a>
              <a href="/admin" className="text-red-400 hover:text-red-300 transition-colors duration-300 font-semibold">
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;