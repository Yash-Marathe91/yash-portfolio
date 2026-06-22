'use client';

import React, { useState, useEffect } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  speed = 1, 
  enableShadows = true, 
  enableOnHover = true, 
  className = '' 
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isOverloaded, setIsOverloaded] = useState(false);

  useEffect(() => {
    if (clickCount >= 5 && !isOverloaded) {
      setIsOverloaded(true);
      
      // Apply extreme screen glitch
      const originalFilter = document.body.style.filter;
      const originalTransform = document.body.style.transform;
      
      document.body.style.transition = "all 0.05s ease-in-out";
      
      let glitchInterval = setInterval(() => {
        const blur = Math.random() * 4;
        const invert = Math.random() > 0.5 ? 1 : 0;
        const skew = (Math.random() - 0.5) * 10;
        document.body.style.filter = `invert(${invert}) blur(${blur}px) hue-rotate(90deg)`;
        document.body.style.transform = `skewX(${skew}deg)`;
      }, 50);

      // Auto-recover after 2 seconds
      setTimeout(() => {
        clearInterval(glitchInterval);
        document.body.style.filter = originalFilter;
        document.body.style.transform = originalTransform;
        document.body.style.transition = "";
        setIsOverloaded(false);
        setClickCount(0);
      }, 2000);
    }

    // Reset counter if they stop clicking
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        if (clickCount < 5) setClickCount(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clickCount, isOverloaded]);

  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 var(--primary-container, red)' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
    cursor: 'pointer'
  } as React.CSSProperties;

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <div 
      className={`glitch ${hoverClass} ${className} transition-transform ${clickCount > 0 ? 'scale-105' : ''}`} 
      style={inlineStyles} 
      data-text={children}
      onClick={() => setClickCount(c => c + 1)}
    >
      {children}
      {isOverloaded && (
        <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference bg-red-500/50 uppercase font-mono text-9xl flex items-center justify-center font-black animate-pulse">
          SYSTEM OVERLOAD
        </div>
      )}
    </div>
  );
};

export default GlitchText;
