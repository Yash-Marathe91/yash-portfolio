"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import './Certificates3DSlider.css';

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: string;
  description: string;
  url: string;
  image: string;
};

export default function Certificates3DSlider({ certificates }: { certificates: Certificate[] }) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  
  // Filter out any without images just to be safe
  const validCerts = certificates.filter(c => c.image);

  if (validCerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[300px] py-12 text-on-surface-variant font-mono text-sm uppercase">
        [ No Certificates Uploaded Yet ]
      </div>
    );
  }

  useEffect(() => {
    const slider = document.getElementById('slider');
    if (!slider) return;
    
    let ctrl = false;
    let is3D = true;
    const slideLength = slider.querySelectorAll('.slide').length - 1;

    const lastElem = () => {
      const slides = slider.querySelectorAll('.slide');
      return slides[slides.length - 1];
    };

    const playSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Cyberpunk/Mechanical slide sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // keep volume low
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        // Ignore audio errors (like strict browser autoplay policies)
      }
    };

    const nextSlide = () => {
      playSound();
      lastElem()?.classList.add("active");
      slider.classList.add("transfomer");
      setTimeout(function(){
          const slides = slider.querySelectorAll('.slide');
          const slicedSlide = slides[slideLength];
          if (slicedSlide) slider.prepend(slicedSlide);
          document.querySelector(".slide.active")?.classList.remove("active");
          slider.classList.remove("transfomer");
      }, 300);
    };

    const prevSlide = () => {
      playSound();
      const slides = slider.querySelectorAll('.slide');
      const slicedSlide = slides[0];
      if(slicedSlide) {
        slicedSlide.classList.add("active");
        slider.append(slicedSlide);
      }
      setTimeout(function(){
          lastElem()?.classList.remove("active");
      }, 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.keyCode === 17) {
            ctrl = true;
            slider.classList.remove("_3D");
            document.querySelector(".key.ctrl")?.classList.add("active");
        }
        if (e.ctrlKey && e.key === 'Enter') {
            const frontSlide = lastElem();
            if (frontSlide) {
                const idx = parseInt(frontSlide.getAttribute('data-idx') || '0', 10);
                setSelectedCert(validCerts[idx]);
            }
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if(e.which === 17){
            ctrl = false;
            slider.classList.add("_3D");
            document.querySelector(".key.ctrl")?.classList.remove("active");
        }
        if (e.key === 'Enter' || e.which === 13) {
            setSelectedCert(null);
        }
        if(e.which === 39 || e.which === 40){
            nextSlide();
            return;
        }
        if(e.which === 37 || e.which === 38){
            prevSlide();
            return;
        }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Mouse events for keys
    const keys = document.querySelectorAll(".key");
    
    const handleMouseDown = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.classList.contains("ctrl")) {
          if(target.classList.contains("active")) is3D = true;
          slider.classList.remove("_3D");
      }
      target.classList.add("active");
    };

    const handleMouseUp = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if(target.classList.contains("down") || target.classList.contains("right")) nextSlide();
      if(target.classList.contains("up") || target.classList.contains("left")) prevSlide();
      if(target.classList.contains("enter")) {
          const frontSlide = lastElem();
          if (frontSlide) {
              const idx = parseInt(frontSlide.getAttribute('data-idx') || '0', 10);
              setSelectedCert(validCerts[idx]);
          }
      }
      
      if(target.classList.contains("ctrl") && target.classList.contains("active")){
          if(is3D){
              target.classList.remove("active");
              slider.classList.add("_3D");
              is3D=false;
          } 
      } else {
          target.classList.remove("active");
      }
    };

    keys.forEach(key => {
      key.addEventListener("mousedown", handleMouseDown);
      key.addEventListener("mouseup", handleMouseUp);
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      keys.forEach(key => {
        key.removeEventListener("mousedown", handleMouseDown);
        key.removeEventListener("mouseup", handleMouseUp);
      });
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] py-12 relative overflow-hidden perspective-[2000px]">
      <motion.div 
        animate={{ 
          x: selectedCert ? -250 : 0,
          scale: selectedCert ? 0.9 : 1
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full relative z-10 hidden md:block"
      >
        <div id="slider-wrapp">
          <div id="slider" className="_3D">
              {validCerts.map((cert, idx) => (
                  <div className="slide cursor-pointer" key={cert.id} data-idx={idx} onClick={() => setSelectedCert(cert)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cert.image} alt={cert.title} />
                  </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile view fallback for slider (no shifting) */}
      <div className="w-full relative z-10 md:hidden">
        <div id="slider-wrapp">
          <div id="slider" className="_3D">
              {validCerts.map((cert, idx) => (
                  <div className="slide cursor-pointer" key={cert.id} data-idx={idx} onClick={() => setSelectedCert(cert)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cert.image} alt={cert.title} />
                  </div>
              ))}
          </div>
        </div>
      </div>
      
      <div className={`keyboard transition-opacity duration-300 ${selectedCert ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-end mb-4">
              <div className="key ctrl">Ctrl</div>
              <div className="arrows flex flex-col items-center"> 
                  <div className="key up mb-1">&uarr;</div>
                  <div className="flex gap-1">
                    <div className="key left">&larr;</div>
                    <div className="key down">&darr;</div>
                    <div className="key right">&rarr;</div>
                  </div>
              </div>
          </div>
          <p className="text-sm leading-relaxed mt-2 text-on-surface-variant">
              Press <kbd className="text-primary font-bold">Arrows</kbd> to navigate <br/>
              Hold <kbd className="text-primary font-bold">Ctrl</kbd> + <kbd className="text-primary font-bold">Arrows</kbd> for flat mode <br/>
              Hold <kbd className="text-primary font-bold">Ctrl</kbd> + <kbd className="text-primary font-bold">Enter</kbd> (or click) to view details
          </p>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 100, rotateY: -15 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute right-[5%] lg:right-[10%] top-1/2 -translate-y-1/2 z-50 w-full max-w-md hidden md:block"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-surface/90 backdrop-blur-md border border-border-glass shadow-2xl h-[450px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 pb-0 mt-4">
                <span className="text-technical-label bg-primary/10 text-primary px-3 py-1 border border-primary/20 mb-4 inline-block">
                  {selectedCert.type}
                </span>
                <h3 className="text-2xl font-heading uppercase text-foreground mb-2">{selectedCert.title}</h3>
                <div className="flex flex-col gap-1 text-sm font-mono text-on-surface-variant">
                  <span className="text-primary">{selectedCert.issuer}</span>
                  <span>{selectedCert.date}</span>
                </div>
              </div>

              <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
                <p className="text-on-surface-variant font-mono text-sm leading-relaxed overflow-y-auto pr-2 custom-scrollbar">
                  {selectedCert.description || "No description provided for this certificate."}
                </p>
                
                {selectedCert.url && (
                  <div className="pt-4 border-t border-border-glass mt-4">
                    <a 
                      href={selectedCert.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors font-mono uppercase tracking-widest text-xs"
                    >
                      <ExternalLink className="w-4 h-4" /> Verify Credential
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Modal Fallback */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4 md:hidden"
          >
            <div className="bg-surface border border-border-glass shadow-2xl p-6 relative">
              <button onClick={() => setSelectedCert(null)} className="absolute top-4 right-4 text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-heading uppercase text-foreground mb-2 pr-6">{selectedCert.title}</h3>
              <p className="text-on-surface-variant font-mono text-xs mb-4">{selectedCert.issuer}</p>
              {selectedCert.url && (
                <a href={selectedCert.url} target="_blank" rel="noreferrer" className="text-primary text-xs uppercase font-mono flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Verify
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
