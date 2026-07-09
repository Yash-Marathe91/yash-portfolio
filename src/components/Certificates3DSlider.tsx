"use client";

import { useEffect } from 'react';
import './Certificates3DSlider.css';

export default function Certificates3DSlider({ certificates }: { certificates: { id: string, image: string }[] }) {
  const images = certificates.map(c => c.image).filter(Boolean);

  if (images.length === 0) {
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
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if(e.which === 17){
            ctrl = false;
            slider.classList.add("_3D");
            document.querySelector(".key.ctrl")?.classList.remove("active");
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
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] py-12 relative overflow-hidden">
      <div id="slider-wrapp">
        <div id="slider" className="_3D">
            {images.map((src, idx) => (
                <div className="slide" key={idx}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Certificate ${idx + 1}`} />
                </div>
            ))}
        </div>
      </div>
      
      <div className="keyboard">
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
          <p className="text-sm">
              Press <kbd>Arrows</kbd> to change slide <br/>
              Press <kbd>Ctrl</kbd> + <kbd>Arrows</kbd> for flat mode
          </p>
      </div>
    </div>
  );
}
