import { Code, Star, GitFork, Calendar } from 'lucide-react';
import { Project } from '@/data/projects';

async function getRepoData(repo: string) {
  if (!repo) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function ProjectCard({ project }: { project: Project }) {
  // Extract owner/repo path for GitHub API
  const repoPath = project.github?.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '') || '';
  
  // Create correct hyperlink URL
  const githubUrl = project.github?.startsWith('http') 
    ? project.github 
    : (project.github ? `https://github.com/${project.github}` : '#');

  const repoData = await getRepoData(repoPath);
  
  return (
    <div className="group relative bg-surface-elevated border border-border-glass p-8 flex flex-col hover:border-outline transition-colors h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-3xl font-heading uppercase text-foreground">{project.title}</h3>
        {project.github && (
          <a href={githubUrl} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
            <Code className="w-6 h-6" />
          </a>
        )}
      </div>
      
      <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
        {repoData?.description || project.description}
      </p>

      {/* GitHub Metrics */}
      {repoData && (
        <div className="flex gap-4 mb-6 text-technical-label text-on-surface-variant font-mono">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-primary-container" /> {repoData.stargazers_count}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3 text-primary-container" /> {repoData.forks_count}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary-container" /> 
            {new Date(repoData.updated_at).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-3 mt-auto">
        {project.stack.map(tech => (
          <span key={tech} className="text-technical-label bg-surface-container px-3 py-1 border border-border-glass text-on-surface">
            {tech}
          </span>
        ))}
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-100 mix-blend-screen transition-opacity pointer-events-none rounded-none blur-3xl" />
    </div>
  );
}
