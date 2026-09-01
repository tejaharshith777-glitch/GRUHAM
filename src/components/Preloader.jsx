import React, { useEffect, useState, useRef } from "react";

export default function Preloader({ onComplete, duration = 2200 }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Smooth cubic easing
      const easedProgress = Math.floor(rawProgress);
      setProgress(easedProgress);

      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 700); // match transition duration
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [duration]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0A0A0C] text-white flex flex-col items-center justify-between py-10 px-4 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      aria-label="Loading GRUHAM"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F190B]/60 via-[#0A0A0C]/90 to-[#0A0A0C] pointer-events-none" />

      {/* Floating sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E5C158] opacity-40 animate-pulse"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              boxShadow: "0 0 8px #E5C158",
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Left Mandala Art */}
      <div className="absolute -left-28 sm:-left-20 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] opacity-15 pointer-events-none text-[#E5C158]">
        <svg viewBox="0 0 400 400" className="w-full h-full fill-none stroke-current stroke-[0.75]">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="170" strokeDasharray="3,3" />
          <circle cx="200" cy="200" r="140" />
          <polygon points="200,10 364,293 35,293" />
          <polygon points="200,390 364,106 35,106" />
          <polygon points="200,30 347,347 53,347" />
          <polygon points="200,370 347,53 53,53" />
          <circle cx="200" cy="200" r="90" />
          <circle cx="200" cy="200" r="40" />
        </svg>
      </div>

      {/* Right Mandala Art */}
      <div className="absolute -right-28 sm:-right-20 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] opacity-15 pointer-events-none text-[#E5C158]">
        <svg viewBox="0 0 400 400" className="w-full h-full fill-none stroke-current stroke-[0.75]">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="170" strokeDasharray="3,3" />
          <circle cx="200" cy="200" r="140" />
          <polygon points="200,10 364,293 35,293" />
          <polygon points="200,390 364,106 35,106" />
          <polygon points="200,30 347,347 53,347" />
          <polygon points="200,370 347,53 53,53" />
          <circle cx="200" cy="200" r="90" />
          <circle cx="200" cy="200" r="40" />
        </svg>
      </div>

      {/* TOP: Vastu Compass Dial */}
      <div className="relative pt-4 flex flex-col items-center z-10">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          {/* Rotating outer ring arrow */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#E5C158]/50 animate-[spin_20s_linear_infinite]" />
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-[#E5C158] filter drop-shadow-[0_0_8px_rgba(229,193,88,0.5)]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
          >
            {/* Outer Dial Circle */}
            <circle cx="50" cy="50" r="45" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="41" strokeWidth="0.8" strokeDasharray="1,2" />
            <circle cx="50" cy="50" r="35" strokeWidth="1" />
            
            {/* Cardinal Letters */}
            <text x="50" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E5C158" stroke="none">N</text>
            <text x="86" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E5C158" stroke="none">E</text>
            <text x="50" y="90" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E5C158" stroke="none">S</text>
            <text x="14" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E5C158" stroke="none">W</text>

            {/* Compass Star Points */}
            <path d="M50 20 L54 44 L78 50 L54 56 L50 80 L46 56 L22 50 L46 44 Z" fill="url(#goldGrad)" strokeWidth="0.5" />
            <path d="M50 26 L52.5 46.5 L73 50 L52.5 53.5 L50 74 L47.5 53.5 L27 50 L47.5 46.5 Z" fill="#E5C158" opacity="0.6" stroke="none" />
            
            {/* Center Pin */}
            <circle cx="50" cy="50" r="4" fill="#FFF5D0" stroke="#997320" strokeWidth="1" />

            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF5D0" />
                <stop offset="50%" stopColor="#E5C158" />
                <stop offset="100%" stopColor="#997320" />
              </linearGradient>
            </defs>
          </svg>
          {/* Curved Arrow on Top Right of Compass */}
          <svg className="absolute -top-1 -right-1 w-7 h-7 text-[#E5C158] animate-spin" style={{ animationDuration: '12s' }} viewBox="0 0 40 40" fill="none">
            <path d="M 10,20 A 15,15 0 0,1 30,12" stroke="#E5C158" strokeWidth="1.8" strokeLinecap="round" />
            <polygon points="32,8 32,16 25,12" fill="#E5C158" />
          </svg>
        </div>
      </div>

      {/* MIDDLE: Detailed Luxury Indian Villa Gold Line Art */}
      <div className="relative my-auto flex flex-col items-center z-10 max-w-2xl w-full px-4">
        <div className="relative w-full max-w-[460px] aspect-[16/10] flex items-center justify-center">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-[#E5C158]/10 blur-3xl rounded-full transform scale-75" />

          {/* SVG Luxury Indian Villa Line Art matching Image 1 */}
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full text-[#E5C158] filter drop-shadow-[0_0_12px_rgba(229,193,88,0.4)]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Base ground line */}
            <line x1="40" y1="365" x2="560" y2="365" strokeWidth="1.5" opacity="0.6" />
            <line x1="80" y1="375" x2="520" y2="375" strokeWidth="1" opacity="0.4" />

            {/* Front Entrance Steps */}
            <polygon points="250,365 350,365 345,350 255,350" strokeWidth="1.2" />
            <polygon points="260,350 340,350 336,338 264,338" strokeWidth="1.2" />

            {/* Front Porch Gabled Portico (with "G" emblem) */}
            <path d="M245 338 L245 285 L355 285 L355 338" strokeWidth="1.8" />
            <path d="M235 285 L300 240 L365 285 Z" strokeWidth="2" fill="#0A0A0C" />
            <path d="M245 280 L300 248 L355 280" strokeWidth="1" />
            {/* Porch Pillars */}
            <line x1="260" y1="285" x2="260" y2="338" strokeWidth="1.5" />
            <line x1="340" y1="285" x2="340" y2="338" strokeWidth="1.5" />
            {/* Porch Door Archway */}
            <path d="M275 338 L275 300 Q300 290 325 300 L325 338" strokeWidth="1.5" />
            {/* G Emblem on gable */}
            <circle cx="300" cy="265" r="7" strokeWidth="1" />
            <text x="300" y="268" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#E5C158" stroke="none">G</text>

            {/* Main Ground Floor Structure */}
            <rect x="180" y="240" width="240" height="125" strokeWidth="2" />
            <rect x="110" y="260" width="70" height="105" strokeWidth="1.8" />
            <rect x="420" y="260" width="70" height="105" strokeWidth="1.8" />

            {/* Ground Floor Windows & Railings */}
            <rect x="125" y="280" width="40" height="50" strokeWidth="1.2" />
            <line x1="145" y1="280" x2="145" y2="330" strokeWidth="1" />
            <line x1="125" y1="305" x2="165" y2="305" strokeWidth="1" />

            <rect x="435" y="280" width="40" height="50" strokeWidth="1.2" />
            <line x1="455" y1="280" x2="455" y2="330" strokeWidth="1" strokeDasharray="1,1" />
            <line x1="435" y1="305" x2="475" y2="305" strokeWidth="1" />

            {/* Middle Floor / First Floor Structure */}
            <rect x="160" y="140" width="280" height="100" strokeWidth="2" />

            {/* Balcony Railings on First Floor */}
            <rect x="220" y="200" width="160" height="40" strokeWidth="1.5" />
            {[...Array(15)].map((_, idx) => (
              <line key={idx} x1={228 + idx * 10} y1="200" x2={228 + idx * 10} y2="240" strokeWidth="0.8" />
            ))}
            
            {/* First Floor Center Double Windows */}
            <rect x="250" y="155" width="40" height="40" strokeWidth="1.2" />
            <rect x="310" y="155" width="40" height="40" strokeWidth="1.2" />
            <line x1="270" y1="155" x2="270" y2="195" strokeWidth="0.8" />
            <line x1="330" y1="155" x2="330" y2="195" strokeWidth="0.8" />

            {/* First Floor Left & Right Wing Windows */}
            <rect x="180" y="160" width="30" height="50" strokeWidth="1.2" />
            <line x1="195" y1="160" x2="195" y2="210" strokeWidth="0.8" />
            
            <rect x="390" y="160" width="30" height="50" strokeWidth="1.2" />
            <line x1="405" y1="160" x2="405" y2="210" strokeWidth="0.8" />

            {/* Top Second Floor / Pavilion Tower */}
            <rect x="230" y="70" width="140" height="70" strokeWidth="1.8" />
            <rect x="250" y="85" width="30" height="35" strokeWidth="1.2" />
            <rect x="290" y="85" width="30" height="35" strokeWidth="1.2" />
            <rect x="330" y="85" width="30" height="35" strokeWidth="1.2" />

            {/* Pitched Rooflines (Traditional Indian Villa Roofs) */}
            {/* Main Upper Roof */}
            <path d="M210 70 L300 25 L390 70 Z" strokeWidth="2.2" fill="#0A0A0C" />
            <path d="M220 65 L300 32 L380 65" strokeWidth="1" />
            <path d="M300 25 L300 15 L303 15 L303 25" strokeWidth="1" />

            {/* First Floor Roof Wings */}
            <path d="M140 140 L300 95 L460 140 Z" strokeWidth="2" fill="#0A0A0C" />
            <path d="M150 135 L300 102 L450 135" strokeWidth="1" />

            {/* Left Side Roof Gables */}
            <path d="M90 260 L145 220 L200 260 Z" strokeWidth="1.8" fill="#0A0A0C" />

            {/* Right Side Roof Gables */}
            <path d="M400 260 L455 220 L510 260 Z" strokeWidth="1.8" fill="#0A0A0C" />
          </svg>
        </div>

        {/* Brand Name & Tagline */}
        <div className="mt-2 text-center flex flex-col items-center">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D0] via-[#E5C158] to-[#997320] drop-shadow-[0_0_20px_rgba(229,193,88,0.45)]">
            GRUHAM
          </h1>
          <p className="tracking-[0.3em] text-[#E5C158] text-[11px] sm:text-xs font-semibold uppercase mt-2 opacity-95">
            DESIGNING YOUR DREAM HOME
          </p>
        </div>
      </div>

      {/* BOTTOM: Progress Bar & Sparkle Beam */}
      <div className="relative pb-6 w-full flex flex-col items-center z-10 px-4">
        {/* Progress bar border container */}
        <div className="relative w-full max-w-[320px] sm:max-w-[480px] h-3 bg-black/80 rounded-full border border-[#E5C158]/50 p-[1.5px] shadow-[0_0_20px_rgba(229,193,88,0.3)] overflow-hidden">
          {/* Fill track */}
          <div
            className="h-full bg-gradient-to-r from-[#997320] via-[#E5C158] to-[#FFF5D0] rounded-full transition-all duration-150 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Leading edge bright flare */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_12px_#FFF5D0] animate-pulse" />
          </div>
          {/* Shimmer light beam moving across */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        {/* Progress % indicator */}
        <div className="mt-2 flex items-center justify-between w-full max-w-[320px] sm:max-w-[480px] text-[11px] text-[#E5C158]/80 font-mono tracking-widest">
          <span>INITIALIZING VASTU & DESIGN ENGINE</span>
          <span className="font-bold text-[#E5C158]">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
