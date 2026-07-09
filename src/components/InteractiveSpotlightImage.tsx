"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface InteractiveSpotlightImageProps {
  baseImage: string;
  revealImage: string;
}

export default function InteractiveSpotlightImage({ baseImage, revealImage }: InteractiveSpotlightImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex-1 border-2 border-border-glass group-hover:border-primary/50 transition-colors duration-700 overflow-hidden bg-surface group"
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
    >
      {/* Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] z-30 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />

      {/* Default State: Base Image (Always Background) */}
      <Image
        src={baseImage}
        alt="Wanted Poster"
        fill
        className="object-cover object-[center_25%] scale-[1.12] opacity-80 grayscale-[30%] sepia-[50%] transition-all duration-700 ease-out z-10"
        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
        priority
      />

      {/* Hover State: True Identity Spotlight (Reveal Image in B&W) */}
      <Image
        src={revealImage}
        alt="Revealed Identity"
        fill
        className="object-cover object-center grayscale opacity-90 [clip-path:circle(0%_at_var(--mouse-x)_var(--mouse-y))] group-hover:[clip-path:circle(25%_at_var(--mouse-x)_var(--mouse-y))] transition-[clip-path] duration-[300ms] ease-out z-20"
        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
        priority
      />
    </div>
  );
}
