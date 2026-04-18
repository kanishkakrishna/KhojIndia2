import React from "react";

const HERO_BG = "/images/kback.avif";

const Welcome = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      
      {/* ── Background Image Layer (Bulletproof Version) ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_BG} 
          alt="KhojIndia Background" 
          className="w-full h-full object-cover"
          style={{ 
            // Peela-pan (yellowish) kam karne ke liye wahi filter settings
            filter: "brightness(0.35) contrast(1.1) saturate(0.7)" 
          }}
        />
        {/* Gradient Overlay taaki text ekdum saaf chamke */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl">
        
        <h1 className="mb-6 font-bold leading-tight text-white text-4xl md:text-6xl lg:text-7xl" 
            style={{ fontFamily: "'Playfair Display', serif" }}>
          The India the <i className="text-[#C4622D] font-serif italic">guidebooks</i> forgot.
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-light">
          Discover hidden gems, read community stories, and let <span className="text-[#C4622D] font-medium text-white">Gen-AI</span> plan your perfect itinerary.
        </p>

      </div>
    </div>
  );
};

export default Welcome;