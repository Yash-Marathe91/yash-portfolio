import HeroScene from '@/components/HeroScene';
import { projects } from '@/data/projects';
import { skillsData } from '@/data/skills';
import { achievements } from '@/data/achievements';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import TrueFocus from '@/components/TrueFocus';
import GlitchText from '@/components/GlitchText';
import { Code, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)]"></div>

      {/* Hero Section */}
      <section id="home" className="relative w-full h-screen flex flex-col justify-center items-start px-4 sm:px-8 md:px-24 border-b border-border-glass overflow-hidden">
        <HeroScene />
        <div className="z-10 flex flex-col max-w-5xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-2 w-2 bg-primary-container rounded-full animate-pulse shrink-0"></span>
            <span className="text-technical-label text-primary uppercase text-[10px] sm:text-xs">System Online // Identity Confirmed</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-foreground mb-4 sm:mb-6 uppercase leading-tight">
            <GlitchText speed={1} enableShadows={true} enableOnHover={true}>
              YASH MARATHE
            </GlitchText>
          </h1>
          <div className="text-xl sm:text-2xl md:text-4xl text-on-surface-variant font-sans tracking-wide">
            <TrueFocus 
              sentence="AI Systems Engineer & Full Stack Developer" 
              separator=" & "
              manualMode={true} 
              blurAmount={4}
              animationDuration={0.3}
            />
          </div>
          <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl font-sans leading-relaxed">
            Building intelligent systems, scalable architectures, and next-generation robotics. 
            Currently engineering AI-driven solutions and contributing to high-impact open source projects.
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-6 font-mono text-technical-code w-full sm:w-auto">
            <Link 
              href="#projects"
              className="magnetic group flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 uppercase hover:bg-primary transition-colors w-full md:w-auto text-center"
            >
              View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#contact"
              className="magnetic flex items-center justify-center gap-2 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center"
            >
              <Terminal className="w-4 h-4" /> Initialize Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 border-b border-border-glass bg-surface">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4">
            <span className="text-primary-container font-mono text-xl">[01]</span>
            <h2 className="text-5xl md:text-7xl uppercase">Intelligent Solutions</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Skills & Architecture Section */}
      <section id="skills" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 border-b border-border-glass bg-surface-dim">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4">
            <span className="text-primary-container font-mono text-xl">[02]</span>
            <h2 className="text-5xl md:text-7xl uppercase">Technical Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillsData.map((category) => (
              <div key={category.name} className="flex flex-col gap-6">
                <h3 className="text-xl font-mono text-primary border-b border-border-glass pb-4 uppercase">
                  // {category.name}
                </h3>
                <ul className="flex flex-col gap-4">
                  {category.skills.map(skill => (
                    <li key={skill} className="text-body-md text-on-surface font-sans flex items-center gap-3">
                      <span className="h-px w-4 bg-outline-variant"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 bg-surface">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4">
            <span className="text-primary-container font-mono text-xl">[03]</span>
            <h2 className="text-5xl md:text-7xl uppercase">Operational Milestones</h2>
          </div>
          
          <div className="flex flex-col gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border border-border-glass hover:bg-surface-elevated transition-colors gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-heading uppercase text-foreground">{item.title}</h3>
                  <span className="text-technical-label text-primary">{item.issuer}</span>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <span className="text-technical-code text-on-surface-variant">{item.date}</span>
                  <span className="text-technical-label bg-surface-container px-3 py-1 border border-border-glass">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-24 sm:py-32 px-4 sm:px-8 md:px-24 bg-surface-dim border-b border-border-glass">
        <Reveal className="flex flex-col gap-16 max-w-7xl mx-auto items-center">
          <ContactForm />
        </Reveal>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 md:px-24 border-t border-border-glass bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-technical-code text-on-surface-variant">
          © {new Date().getFullYear()} Yash Marathe. All rights reserved.
        </div>
        <div className="flex gap-6 text-technical-label">
          <p className="text-primary-container">Press Ctrl + K for Command Palette</p>
        </div>
      </footer>
    </main>
  );
}
