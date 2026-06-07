"use client";

import { FolderKanban, Plus } from 'lucide-react';
import { projects } from '@/data/projects';

export default function AdminProjects() {
  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-border-glass pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-primary" />
            Project Management
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">Create, Edit, Delete, and Publish Projects</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-4 py-2 font-mono uppercase tracking-wider text-sm transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-border-glass bg-surface-elevated/30 flex flex-col hover:border-primary/50 transition-colors">
            <div className="aspect-video bg-surface-dim border-b border-border-glass overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm transition-all gap-4">
                <button className="px-4 py-2 border border-primary text-primary font-mono text-xs uppercase hover:bg-primary/10">Edit</button>
                <button className="px-4 py-2 border border-error text-error font-mono text-xs uppercase hover:bg-error/10">Delete</button>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-heading uppercase tracking-wider text-lg truncate">{project.title}</h3>
              <p className="text-on-surface-variant font-sans text-sm line-clamp-2">{project.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-1 bg-surface-container border border-border-glass">STATUS: PUBLISHED</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
