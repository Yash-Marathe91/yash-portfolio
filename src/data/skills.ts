export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    name: "AI & Machine Learning",
    skills: ["Vercel AI SDK", "Gemini API", "Local LLMs", "Prompt Engineering", "RAG Systems", "Python"]
  },
  {
    name: "Frontend Architecture",
    skills: ["React 19", "Next.js 15", "TypeScript", "TailwindCSS", "Zustand", "Framer Motion", "GSAP"]
  },
  {
    name: "Backend & Systems",
    skills: ["Node.js", "Supabase", "PostgreSQL", "REST APIs", "System Design"]
  },
  {
    name: "Robotics & Hardware",
    skills: ["IoT", "Microcontrollers", "C++", "Sensor Integration"]
  },
  {
    name: "3D & Creative Coding",
    skills: ["Three.js", "React Three Fiber", "WebGL", "Creative Styling"]
  }
];
