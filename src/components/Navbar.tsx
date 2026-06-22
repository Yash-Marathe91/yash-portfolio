"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import SystemStatusBadge from './SystemStatusBadge';

const navItems = [
  { name: 'HOME', href: '#home' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'ACHIEVEMENTS', href: '#achievements' },
  { name: 'CONTACT', href: '#contact' },
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border-glass py-4' : 'bg-transparent py-4 md:py-6'}`}>
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
            className="text-on-surface hover:text-primary transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-surface-elevated border-b border-border-glass shadow-xl lg:hidden flex flex-col px-6 py-4 gap-4"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`text-sm font-mono uppercase tracking-wider py-2 border-b border-border-glass/50 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link 
              href="/system-auth"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 text-center border border-on-surface px-4 py-3 text-sm bg-surface hover:bg-surface/80 transition-colors font-mono font-medium"
            >
              ADMIN PORTAL
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
