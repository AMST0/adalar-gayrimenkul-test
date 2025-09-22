import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // Sadece mobilde scroll hiding özelliği çalışsın
    if (window.innerWidth < 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
    } else {
      setIsVisible(true); // Desktop'ta her zaman görünür
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-black shadow-lg fixed w-full top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-28  bg-gradient-to-r rounded-xl flex items-center justify-center shadow-lg">
              <img src="https://i.hizliresim.com/rs5qoel.png" alt="" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 bg-black">
            <Link
              to="/"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              {t.home}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/biz-kimiz"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              {t.about}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/danismanlar"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              {t.agents}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/arsalar"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              {t.properties}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/iletisim"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              {t.contact}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  language === 'tr'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                EN
              </button>
            </div>
            
            {/* CTA Button */}
            <Link
              to="/iletisim"
              className="bg-gradient-to-r from-red-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.buttons.contact}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-red-600 transition-colors duration-300 p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-6 bg-black border-t">
          <Link
            to="/"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.home}
          </Link>
          <Link
            to="/biz-kimiz"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.about}
          </Link>
          <Link
            to="/danismanlar"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.agents}
          </Link>
          <Link
            to="/arsalar"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.properties}
          </Link>
          <Link
            to="/iletisim"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.contact}
          </Link>
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-center space-x-2 bg-gray-800 rounded-lg p-1 my-4">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                language === 'tr'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                language === 'en'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              EN
            </button>
          </div>
          
          <Link
            to="/iletisim"
            className="block mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl text-center font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t.buttons.contact}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;