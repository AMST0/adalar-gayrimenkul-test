import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
  <header className="bg-black shadow-lg fixed w-full top-0 z-50">
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
            <a
              href="/"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              Ana Sayfa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/biz-kimiz"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              Biz Kimiz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/danismanlar"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              Danışmanlar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/arsalar"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              Arsalar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/iletisim"
              className="text-white hover:text-red-600 transition-colors duration-300 font-semibold relative group"
            >
              İletişim
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="/iletisim"
              className="bg-gradient-to-r from-red-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              İletişime Geç
            </a>
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
          <a
            href="/"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Ana Sayfa
          </a>
          <a
            href="/biz-kimiz"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Biz Kimiz
          </a>
          <a
            href="/danismanlar"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Danışmanlar
          </a>
          <a
            href="/arsalar"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Arsalar
          </a>
          <a
            href="/iletisim"
            className="block py-3 text-white hover:text-red-600 transition-colors duration-300 font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            İletişim
          </a>
          <a
            href="/iletisim"
            className="block mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl text-center font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            İletişime Geç
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;