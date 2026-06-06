export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  demo?: string;
  architecture?: string;
  images: string[];
  metrics: { label: string; value: string }[];
  category: "Full Stack" | "AI" | "Robotics" | "Other";
}

export const projects: Project[] = [
  {
    id: "construction-erp-system",
    title: "Construction ERP System",
    description: "A comprehensive Enterprise Resource Planning system tailored for the construction industry, featuring advanced analytics and inventory management.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "Yash-Marathe91/construction-erp-system",
    demo: "https://construction-erp-system.vercel.app/",
    images: [],
    metrics: [
      { label: "Performance", value: "99" },
      { label: "Accessibility", value: "100" }
    ],
    category: "Full Stack",
  },
  {
    id: "localhost-ai",
    title: "LocalHost AI",
    description: "Local AI environment for running powerful LLMs locally with optimal performance and privacy.",
    stack: ["Python", "React", "AI Tooling"],
    github: "Yash-Marathe91/LocalHost-AI",
    images: [],
    metrics: [],
    category: "AI",
  },
  {
    id: "campus-connect",
    title: "Campus Connect for AI Core",
    description: "An AI-powered campus networking and resource sharing platform.",
    stack: ["Next.js", "AI Integration"],
    github: "Yash-Marathe91/Campus-Connect-for-AI-core",
    images: [],
    metrics: [],
    category: "AI",
  },
  {
    id: "celestial-bodies",
    title: "Celestial Bodies Database",
    description: "A relational database project mapping celestial bodies and their properties.",
    stack: ["PostgreSQL", "SQL"],
    github: "Yash-Marathe91/celestial-bodies-database",
    images: [],
    metrics: [],
    category: "Other",
  },
  {
    id: "codealpha",
    title: "CodeAlpha Internship Projects",
    description: "Collection of projects built during the CodeAlpha internship.",
    stack: ["Web Technologies"],
    github: "Yash-Marathe91/CodeAlpha_Internship",
    images: [],
    metrics: [],
    category: "Full Stack",
  }
];
