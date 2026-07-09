"use client";

import { motion } from 'framer-motion';

interface LogPoseProps {
  activeIndex: number;
  totalSections: number;
}

export default function LogPose({ activeIndex, totalSections }: LogPoseProps) {
  const safeIndex = activeIndex !== -1 ? activeIndex : 0;
  
  // Total span of the compass is 140 degrees
  const range = 140; 
  const step = totalSections > 1 ? range / (totalSections - 1) : 0;
  const angle = -(range / 2) + (safeIndex * step);

  return (
    <div className="relative flex items-center justify-center group cursor-default" title="Log Pose Tracker">
      {/* Cyberpunk HUD Outer Brackets */}
      <div className="absolute -left-1.5 -top-1.5 w-2 h-2 border-t border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
      <div className="absolute -right-1.5 -top-1.5 w-2 h-2 border-t border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
      <div className="absolute -left-1.5 -bottom-1.5 w-2 h-2 border-b border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
      <div className="absolute -right-1.5 -bottom-1.5 w-2 h-2 border-b border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />

      {/* Main Glass Sphere */}
      <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full border border-primary/30 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/70 group-hover:shadow-[0_0_20px_rgba(255,180,172,0.2)] transition-all duration-500">
        
        {/* Submarine/Radar Ping Animation */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />

        {/* Internal Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:4px_4px]" />
        
        {/* Spherical Depth Shadow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] z-10" />

        {/* Outer Compass Ticks (SVG for precise circular dashed line) */}
        <svg className="absolute inset-0 w-full h-full z-10 opacity-40 group-hover:opacity-80 transition-opacity duration-500" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5" className="text-primary" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/50" />
        </svg>

        {/* Cardinal Directions */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-primary z-10" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-primary z-10" />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-primary z-10" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-primary z-10" />

        {/* Magnetic Needle */}
        <motion.div 
          className="w-full h-full relative z-20"
          initial={false}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 150, damping: 8, mass: 1 }}
        >
          {/* North Target Needle (Glowing Red) */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[2px] h-[32%] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]">
            {/* Arrowhead */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-r-[3.5px] border-b-[5px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,1)]" />
          </div>
          
          {/* South Counter-weight Needle */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[1px] h-[30%] bg-primary/60" />
        </motion.div>

        {/* Central Pivot Hub */}
        <div className="absolute w-3 h-3 bg-background rounded-full z-30 border-[1.5px] border-primary shadow-[0_0_10px_rgba(255,180,172,0.5)] flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_5px_#fff]" />
        </div>

        {/* Convex Glass Dome Glare (Creates the 3D Sphere Effect) */}
        <div className="absolute -top-[40%] -left-[20%] w-[140%] h-[140%] bg-gradient-to-b from-white/10 to-transparent rounded-[50%] z-40 pointer-events-none rotate-12" />
      </div>
    </div>
  );
}
