"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import SystemStatusBadge from './SystemStatusBadge';

const navItems = [
  { name: 'HOME', href: '#home', symbol: '~/' },
  { name: 'PROJECTS', href: '#projects', symbol: './' },
  { name: 'SKILLS', href: '#skills', symbol: '{}' },
  { name: 'ACHIEVEMENTS', href: '#achievements', symbol: '[]' },
  { name: 'CONTACT', href: '#contact', symbol: '->' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems.map(item => document.getElementById(item.href.substring(1)));
      
      let currentActive = 'home';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is above the middle of the screen
          if (rect.top <= window.innerHeight / 2) {
            currentActive = navItems[i].href.substring(1);
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check (delay slightly to ensure DOM is ready)
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu if open
    
    const targetId = href.substring(1);
    const elem = document.getElementById(targetId);
    if (elem) {
      // Offset slightly to account for the sticky navbar
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border-glass py-4' : 'max-md:bg-background max-md:border-b max-md:border-border-glass md:bg-transparent py-4 md:py-6'}`}>
      <div className="w-full mx-auto px-6 md:px-12 flex justify-between items-center relative">
        {/* Logo - Left */}
        <div className="flex-1 flex justify-start">
          <Link href="#home" onClick={(e) => handleClick(e, '#home')} className="text-xl md:text-2xl font-heading uppercase tracking-wider text-foreground whitespace-nowrap z-50">
            YASH MARATHE
          </Link>
        </div>
        
        {/* Navigation Links - Desktop Center */}
        <div className="hidden lg:flex flex-1 justify-center gap-8 items-center">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative text-sm font-mono uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Admin & Badge - Desktop Right */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-4">
          <SystemStatusBadge />
          <Link href="/system-auth">
            <span className="border border-on-surface px-4 py-1.5 text-sm bg-surface-elevated hover:bg-surface-elevated/80 transition-colors cursor-pointer font-mono font-medium whitespace-nowrap">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle - Right */}
        <div className="lg:hidden flex justify-end z-50">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`transition-colors p-2 rounded-lg ${mobileMenuOpen ? 'bg-primary/10 text-primary' : 'text-on-surface hover:text-primary'}`}
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown - Right Aligned Tech Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20, transformOrigin: "top right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-[calc(100%+10px)] right-4 w-44 bg-surface-elevated/90 backdrop-blur-2xl border border-primary/20 shadow-[0_0_40px_rgba(255,180,172,0.1)] rounded-xl lg:hidden flex flex-col overflow-hidden z-50 p-2"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.div
                    key={item.name}
                    custom={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05, duration: 0.4, ease: "easeOut" }}
                  >
                    <Link 
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className={`group relative overflow-hidden block px-3 py-3 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-bright hover:text-primary'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-mobile-indicator"
                          className="absolute left-0 top-0 w-1 h-full bg-primary shadow-[0_0_10px_rgba(255,180,172,0.8)]"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-primary/60 font-bold group-hover:text-primary transition-colors min-w-[20px]">
                          {item.symbol}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: navItems.length * 0.05 + 0.1, duration: 0.4 }}
                className="mt-1 pt-2 border-t border-border-glass"
              >
                <Link 
                  href="/system-auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between group rounded-lg border border-primary/30 px-3 py-2.5 text-[10px] bg-primary/5 hover:bg-primary/20 text-primary transition-all font-mono font-medium tracking-widest"
                >
                  <span>SYS_ADMIN</span>
                  <span className="opacity-0 group-hover:opacity-100 animate-pulse text-primary font-bold">_</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
