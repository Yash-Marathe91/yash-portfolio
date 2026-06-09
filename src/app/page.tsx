import HeroScene from '@/components/HeroScene';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import TrueFocus from '@/components/TrueFocus';
import GlitchText from '@/components/GlitchText';
import { ArrowRight, Terminal, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase.from('profile_settings').select('*').single();

  // 2. Fetch Skills & Categories
  const { data: categories } = await supabase.from('skill_categories').select('*').order('sort_order', { ascending: true });
  const { data: skillsDataRaw } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
  
  const skillsData = (categories || []).map(cat => {
    const catSkills = skillsDataRaw?.filter(s => s.category_id === cat.id).map(s => s.name) || [];
    return { name: cat.name, skills: catSkills };
  }).filter(cat => cat.skills.length > 0);

  // 3. Fetch Projects
  const { data: projectsData } = await supabase.from('projects').select('*').eq('status', 'published').order('sort_order', { ascending: true });
  const { data: projectTech } = await supabase.from('project_technologies').select('*');
  
  const projects = (projectsData || []).map(p => {
    const techIds = projectTech?.filter(t => t.project_id === p.id).map(t => t.skill_id) || [];
    const stack = techIds.map(id => skillsDataRaw?.find(s => s.id === id)?.name).filter(Boolean);
    return {
      id: p.slug,
      title: p.title,
      description: p.short_description || '',
      stack: stack,
      github: p.github_url || '',
      demo: p.live_url || '',
      images: p.thumbnail_url ? [p.thumbnail_url] : [],
      metrics: [],
      category: 'Full Stack' as const
    };
  });

  // 4. Fetch Achievements
  const { data: achievementsData } = await supabase.from('achievements').select('*').order('issue_date', { ascending: false });
  const achievements = (achievementsData || []).map(a => ({
    id: a.id,
    title: a.title,
    issuer: a.issuer,
    date: a.issue_date ? new Date(a.issue_date).getFullYear().toString() : 'Present',
    description: a.description || '',
    type: (a.type === 'milestone' ? 'Open Source' : a.type === 'hackathon' ? 'Hackathon' : 'Recognition') as any,
    image: a.image_url || '',
    url: a.credential_url || ''
  }));

  // Fallbacks if profile isn't populated
  const heroTitle = profile?.hero_title || "AI Systems Engineer & Full Stack Developer";
  const heroBio = profile?.bio || "Building intelligent systems, scalable architectures, and next-generation robotics.";
  const fullName = profile?.full_name || "YASH MARATHE";

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
              {fullName}
            </GlitchText>
          </h1>
          <div className="text-xl sm:text-2xl md:text-4xl text-on-surface-variant font-sans tracking-wide">
            <TrueFocus 
              sentence={heroTitle} 
              separator=" & "
              manualMode={true} 
              blurAmount={4}
              animationDuration={0.3}
            />
          </div>
          <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl font-sans leading-relaxed">
            {heroBio}
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-6 font-mono text-technical-code w-full sm:w-auto">
            <Link 
              href="#projects"
              className="magnetic group flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 uppercase hover:bg-primary transition-colors w-full md:w-auto text-center"
            >
              View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {profile?.resume_file_url ? (
              <a 
                href={profile.resume_file_url}
                target="_blank"
                rel="noreferrer"
                className="magnetic flex items-center justify-center gap-2 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center"
              >
                <Terminal className="w-4 h-4" /> Download Resume
              </a>
            ) : (
              <Link 
                href="#contact"
                className="magnetic flex items-center justify-center gap-2 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center"
              >
                <Terminal className="w-4 h-4" /> Initialize Contact
              </Link>
            )}
          </div>
          
          {/* Social Links */}
          <div className="mt-8 flex items-center gap-6">
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2 -ml-2" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
            )}
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
            {projects.length === 0 ? (
              <div className="col-span-full py-12 text-on-surface-variant font-mono uppercase tracking-widest text-center">
                Fetching projects from database...
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project as any} />
              ))
            )}
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
          © {new Date().getFullYear()} {fullName}. All rights reserved.
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 text-technical-label">
          <div className="flex gap-4">
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="hidden md:block w-px h-6 bg-border-glass"></div>
          <p className="text-primary-container">Press Ctrl + K for Command Palette</p>
        </div>
      </footer>
    </main>
  );
}
