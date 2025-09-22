import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold"><img src="https://i.hizliresim.com/noxmykv.png" alt="" /></h1>
            </div>
            <p className="text-blue-200 leading-relaxed">
              Adalar'ın en prestijli gayrimenkul danışmanlık firması. 
              15 yılı aşkın deneyimimizle rüya arsanızı bulmanızda size yardımcı olmaktan gurur duyuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative">
              {t.common.quickAccess}
              <span className="absolute bottom-0 left-0 w-8 h-1 bg-red-600 rounded-full"></span>
            </h4>
            <nav className="space-y-3">
              <a 
                href="/" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → {t.home}
              </a>
              <a 
                href="/biz-kimiz" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → {t.about}
              </a>
              <a 
                href="/danismanlar" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → {t.agents}
              </a>
              <a 
                href="/arsalar" 
                className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
              >
                → {t.properties}
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
              {t.common.contactInfo}
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
                  Çınar Mahallesi, Rıfkı Tongsir Caddesi, <br />
                  Küçükyalı Nidapark Maltepe/İstanbul
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
                href="https://www.instagram.com/realtyworld.adalar?igsh=am12NXN1amVvcTJ5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © 2024 Adalar Gayrimenkul. {t.common.rights}
            </p>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;