import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde en üste scroll yap
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Yumuşak scroll animasyonu
    });
  }, [pathname]); // pathname değiştiğinde çalış

  return null; // Bu bileşen hiçbir şey render etmez
};

export default ScrollToTop;