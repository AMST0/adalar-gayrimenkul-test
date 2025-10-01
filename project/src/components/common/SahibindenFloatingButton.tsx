import React from 'react';

const SahibindenFloatingButton: React.FC = () => {
  return (
    <a
      href="https://adalargayrimenkul.sahibinden.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Sahibinden.com İlanlarımız"
      className="group fixed left-3 bottom-3 sm:left-4 sm:bottom-4 z-40"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
        <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="rounded-full shadow-xl border border-yellow-500/40 bg-black overflow-hidden w-full h-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
          <img
            src="https://s0.shbdn.com/assets/images/sahibindencom-logo-s:6af6f8af6cb352097d43a6709122523d.png"
            alt="Sahibinden.com"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </a>
  );
};

export default SahibindenFloatingButton;
