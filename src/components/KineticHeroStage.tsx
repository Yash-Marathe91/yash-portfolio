"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface KineticHeroStageProps {
  children: ReactNode;
}

export default function KineticHeroStage({ children }: KineticHeroStageProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const charLayerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoStageRef = useRef<HTMLDivElement | null>(null);

  /**
   * Audio Telemetry System State & Audio Element Reference
   */
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Responsive interaction states for photo stage
  const [isScrollActive, setIsScrollActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  /**
   * 3D Lerped Parallax Physics & Mouse/Touch Vector Tracking
   */
  const mouseRef = useRef({ x: 0, y: 0 });
  const charPosRef = useRef({ x: 0, y: 0 });
  const petalsWindRef = useRef(0);

  // Detect mobile or touch capabilities
  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        window.innerWidth < 1024 ||
        "ontouchstart" in window ||
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
      setIsMobileDevice(isMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /**
   * Passive Scroll Detector for Mobile Screen Active Zone (30% to 80% Viewport Height)
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!photoStageRef.current) return;
      const rect = photoStageRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Calculate ratio of photo stage center relative to viewport height
      const stageCenterY = rect.top + rect.height / 2;
      const centerRatio = stageCenterY / viewportHeight;

      // Active when stage center is between 30% (0.30) and 80% (0.80) of viewport height
      const active = centerRatio >= 0.30 && centerRatio <= 0.80;
      setIsScrollActive(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Photo active trigger: Scroll position ONLY for mobile screens (<1024px / touch), ONLY Mouse Hover for desktop screens (>=1024px)
  const isPhotoActive = isMobileDevice ? isScrollActive : isHovered;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
        y: (e.clientY - innerHeight / 2) / (innerHeight / 2),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { innerWidth, innerHeight } = window;
        mouseRef.current = {
          x: (touch.clientX - innerWidth / 2) / (innerWidth / 2),
          y: (touch.clientY - innerHeight / 2) / (innerHeight / 2),
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Smooth lerped 3D parallax tilt loop
  useEffect(() => {
    let animId: number;

    const updateParallax = () => {
      const targetX = mouseRef.current.x * 20;
      const targetY = mouseRef.current.y * 14;
      const targetRotateY = mouseRef.current.x * 10;
      const targetRotateX = -mouseRef.current.y * 8;

      charPosRef.current.x += (targetX - charPosRef.current.x) * 0.08;
      charPosRef.current.y += (targetY - charPosRef.current.y) * 0.08;
      petalsWindRef.current += (-mouseRef.current.x * 15 - petalsWindRef.current) * 0.05;

      if (charLayerRef.current) {
        charLayerRef.current.style.transform = `perspective(1000px) translate3d(${charPosRef.current.x}px, ${charPosRef.current.y}px, 0px) rotateY(${targetRotateY}deg) rotateX(${targetRotateX}deg)`;
      }

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Floating embers & sakura petal canvas physics system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Petal {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedY: number = 0;
      speedX: number = 0;
      angle: number = 0;
      spin: number = 0;
      color: string = "";

      constructor(width: number, height: number) {
        this.reset(width, height, true);
      }

      reset(width: number, height: number, initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 5 + 3;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.8 - 0.4;

        const colors = [
          "rgba(239, 68, 68, 0.45)", // Fire red flame
          "rgba(249, 115, 22, 0.35)", // Neon orange spark
          "rgba(255, 180, 172, 0.40)", // Cyber blush petal
          "rgba(201, 42, 42, 0.55)", // Deep crimson
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(width: number, height: number, wind: number) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.3 + wind * 0.02;
        this.angle += this.spin;

        if (this.y > height + 20) {
          this.reset(width, height);
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate((this.angle * Math.PI) / 180);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 8;

        context.beginPath();
        context.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
        context.fill();
        context.restore();
      }
    }

    const petals: Petal[] = Array.from({ length: 45 }, () => new Petal(canvas.width, canvas.height));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.update(canvas.width, canvas.height, petalsWindRef.current);
        p.draw(ctx);
      });
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Simpler Audio Control Handlers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgressPercent((current / duration) * 100);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 border-b border-border-glass overflow-hidden pt-24 pb-12 bg-[#060608] bg-[radial-gradient(circle_at_center,#2b0404_0%,#060608_100%)] select-none"
    >
      {/* Peripheral Vignette Mask */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(6,6,8,0.88)_100%)]" />

      {/* Cyber Dot Matrix Grid Overlay */}
      <div className="absolute inset-0 z-2 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.05)_15%,transparent_16%)] bg-[size:6px_6px]" />

      {/* Corner UI Brackets */}
      <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary/40 z-13 pointer-events-none" />
      <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary/40 z-13 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary/40 z-13 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary/40 z-13 pointer-events-none" />

      {/* Background Animated Watermark - Pure Technical & Engineering Marquee */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%] font-heading text-[12rem] sm:text-[18rem] font-black text-white/[0.03] tracking-[30px] whitespace-nowrap z-1 pointer-events-none animate-[moveText_35s_linear_infinite]">
        AI SYSTEMS ENGINEER // FULL STACK DEVELOPER // SCALABLE ARCHITECTURES // NEURAL COMPUTING // YASH MARATHE // DISTRIBUTED PLATFORMS
      </div>

      {/* HTML5 Petals / Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://www.dropbox.com/scl/fi/ersb17v6uwmcelmvapgxp/Fall-To-Hell-DOLLWAVE-Darkwave-Lyrics-visualizer.mp3?rlkey=3pfivpdswvsnwxwzqnix01wnl&st=vs1tmdms&dl=1"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Content Layout Container */}
      <div className="z-20 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-10 lg:gap-12 my-auto">

        {/* Left Hero Text & CTA Content */}
        <div className="flex flex-col max-w-4xl lg:max-w-2xl flex-1 text-center lg:text-left items-center lg:items-start w-full">
          {children}

          {/* Simpler Professional Audio Control Pill */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="magnetic flex items-center gap-3 bg-[#0a0a0e]/90 border border-primary/40 hover:border-primary px-5 py-2.5 rounded-full text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(201,42,42,0.4)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span>{isPlaying ? "⏸ PAUSE AUDIO TELEMETRY" : "▶ PLAY AUDIO TELEMETRY"}</span>
            </button>
            {isPlaying && (
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden border border-border-glass hidden sm:block">
                <div
                  className="h-full bg-gradient-to-r from-primary to-white transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Character Photo Stage with SVG Organic Blob Frame & Orbiting Technical Text */}
        <div
          ref={photoStageRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[480px] aspect-square flex-shrink-0 flex items-center justify-center p-2 transition-all duration-700 ${
            isPhotoActive ? "scale-105" : "scale-100"
          }`}
        >
          {/* Parallax Layer for 3D lerped mouse tilt */}
          <div
            ref={charLayerRef}
            className="relative w-full h-full z-10 transition-transform duration-200 ease-out will-change-transform flex items-center justify-center group"
          >
            {/* SVG Blob Photo Frame with Orbiting Technical Text */}
            <svg
              viewBox="-20 -20 240 240"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Yash Marathe Photo Stage"
              className={`w-full h-full overflow-visible transition-all duration-500 ${
                isPhotoActive
                  ? "scale-105 drop-shadow-[0_0_45px_rgba(201,42,42,0.95)] drop-shadow-[0_0_20px_rgba(255,180,172,0.6)]"
                  : "scale-100 drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(201,42,42,0.25)]"
              }`}
            >
              <defs>
                {/* Theme-oriented Crimson & Obsidian Radial Background Gradient */}
                <linearGradient id="blobBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2b0404" />
                  <stop offset="50%" stopColor="#120710" />
                  <stop offset="100%" stopColor="#1f0507" />
                </linearGradient>

                <clipPath id="blobClip">
                  <path
                    d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                    transform="translate(100 100)"
                  />
                </clipPath>
              </defs>

              {/* Theme-oriented Gradient Blob Background Fill & Border Stroke */}
              <path
                d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                transform="translate(100 100)"
                fill="url(#blobBgGrad)"
                stroke={isPhotoActive ? "#ffb4ac" : "rgba(255, 180, 172, 0.45)"}
                strokeWidth={isPhotoActive ? "1.8" : "1.4"}
                className={`transition-all duration-500 ${
                  isPhotoActive ? "drop-shadow-[0_0_20px_rgba(201,42,42,0.95)]" : ""
                }`}
              />

              {/* Yash's Photo (photo.jpg) clipped by Organic Blob Shape */}
              <image
                href="/photo.jpg"
                x="-15"
                y="-12"
                width="230"
                height="230"
                preserveAspectRatio="xMidYMin slice"
                clipPath="url(#blobClip)"
              />

              {/* Invisible Path for Text to follow */}
              <path
                id="blobTextPath"
                d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                transform="translate(100 100)"
                fill="none"
                stroke="none"
                pathLength="100"
              />

              {/* Moving Technical Words orbiting around the Organic Frame */}
              <text
                className={`font-mono text-[6.5px] font-bold tracking-[1.8px] uppercase transition-colors duration-300 ${
                  isPhotoActive ? "fill-white" : "fill-primary"
                }`}
              >
                <textPath href="#blobTextPath" startOffset="0%">
                  ✦ AI SYSTEMS ENGINEER ✦ FULL STACK DEVELOPER ✦ SCALABLE ARCHITECTURES ✦ HIGH PERFORMANCE SYSTEMS
                  <animate attributeName="startOffset" from="0%" to="100%" dur="22s" repeatCount="indefinite" />
                </textPath>
                <textPath href="#blobTextPath" startOffset="100%">
                  ✦ AI SYSTEMS ENGINEER ✦ FULL STACK DEVELOPER ✦ SCALABLE ARCHITECTURES ✦ HIGH PERFORMANCE SYSTEMS
                  <animate attributeName="startOffset" from="-100%" to="0%" dur="22s" repeatCount="indefinite" />
                </textPath>
              </text>
            </svg>

            {/* Bottom Cyber Badge Overlay */}
            <div className="absolute bottom-2 inset-x-8 z-20 pointer-events-none flex items-center justify-center font-mono text-[10px] text-white/80">
              <div className="flex items-center gap-2 bg-[#06050a]/90 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                <span className="text-primary font-bold">YASH MARATHE</span>
                <span className="text-white/30">•</span>
                <span className="text-white/60">矢手 (SYSTEMS ENGINEER)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
