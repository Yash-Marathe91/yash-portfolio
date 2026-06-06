export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  type: "Competition" | "Open Source" | "Hackathon" | "Recognition";
  image?: string;
  url?: string;
}

export const achievements: Achievement[] = [
  {
    id: "gssoc-2024",
    title: "GSSOC Contributor",
    issuer: "GirlScript Summer of Code",
    date: "2024",
    description: "Actively contributed to various open-source projects including HerFlow, Career Pilot, and QuantumGuard Blockchain.",
    type: "Open Source"
  },
  {
    id: "ai-systems-build",
    title: "AI Systems Engineering Excellence",
    issuer: "University / Hackathon",
    date: "2023",
    description: "Built scalable AI architectures leveraging advanced language models for real-world applications.",
    type: "Hackathon"
  }
];
