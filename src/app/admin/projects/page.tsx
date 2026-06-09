"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, FolderKanban, Save, Edit, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    short_description: '',
    long_description: '',
    live_url: '',
    github_url: '',
    status: 'published',
    thumbnail_url: '',
    selectedSkills: [] as string[]
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch projects, skills, and the linking table
      const [projRes, skillsRes, techRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('id, name, category_id'),
        supabase.from('project_technologies').select('*')
      ]);

      if (projRes.error) throw projRes.error;
      if (skillsRes.error) throw skillsRes.error;

      // Merge technologies into projects
      const projectsWithTech = projRes.data.map(p => {
        const pTechs = techRes.data?.filter(t => t.project_id === p.id).map(t => t.skill_id) || [];
        return { ...p, selectedSkills: pTechs };
      });

      setProjects(projectsWithTech);
      setSkills(skillsRes.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug if it's a new project
    if (!formData.id) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, title, slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSkill = (skillId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedSkills.includes(skillId);
      if (isSelected) {
        return { ...prev, selectedSkills: prev.selectedSkills.filter(id => id !== skillId) };
      } else {
        return { ...prev, selectedSkills: [...prev.selectedSkills, skillId] };
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        long_description: formData.long_description,
        live_url: formData.live_url,
        github_url: formData.github_url,
        status: formData.status,
        thumbnail_url: formData.thumbnail_url,
      };

      let projectId = formData.id;

      if (projectId) {
        // Update existing
        const { error } = await supabase.from('projects').update(projectData).eq('id', projectId);
        if (error) throw error;
        // Delete old tech links
        await supabase.from('project_technologies').delete().eq('project_id', projectId);
      } else {
        // Insert new
        const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
        if (error) throw error;
        projectId = data.id;
      }

      // Insert new tech links
      if (formData.selectedSkills.length > 0) {
        const techLinks = formData.selectedSkills.map(skillId => ({
          project_id: projectId,
          skill_id: skillId
        }));
        const { error: techError } = await supabase.from('project_technologies').insert(techLinks);
        if (techError) throw techError;
      }

      await fetchData(); // Refresh data
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Ensure slug is unique.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '', title: '', slug: '', short_description: '', long_description: '',
      live_url: '', github_url: '', status: 'published', thumbnail_url: '', selectedSkills: []
    });
    setIsFormOpen(false);
  };

  const openEditForm = (project: any) => {
    setFormData({
      id: project.id,
      title: project.title,
      slug: project.slug,
      short_description: project.short_description || '',
      long_description: project.long_description || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      status: project.status || 'published',
      thumbnail_url: project.thumbnail_url || '',
      selectedSkills: project.selectedSkills || []
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase text-foreground flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-primary" />
            Projects CMS
          </h1>
          <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
            Manage your portfolio case studies and relational tech stacks.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary text-on-primary px-6 py-3 uppercase tracking-widest text-sm font-bold transition-all hover:bg-primary/80 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        )}
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-primary/50 p-6 md:p-8 flex flex-col gap-8 relative"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex justify-between items-center border-b border-border-glass pb-4">
            <h2 className="text-xl font-heading uppercase text-primary">
              {formData.id ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button onClick={resetForm} className="text-on-surface-variant hover:text-foreground text-sm uppercase font-mono tracking-widest">
              [Cancel]
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  required
                  className="bg-background border border-border-glass px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-on-surface-variant tracking-wider">Short Description (Card Subtitle)</label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                maxLength={150}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-on-surface-variant tracking-wider">Long Description (Markdown Supported)</label>
              <textarea
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                rows={5}
                className="bg-background border border-border-glass px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Live URL</label>
                <input
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase font-mono"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-on-surface-variant tracking-wider">Project Thumbnail</label>
              <div className="flex items-center gap-4">
                {formData.thumbnail_url && (
                  <img src={formData.thumbnail_url} alt="Thumbnail preview" className="w-16 h-16 object-cover border border-border-glass rounded" />
                )}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isUploading}
                  />
                  <button type="button" className="bg-surface-elevated border border-border-glass px-4 py-3 flex items-center gap-2 text-sm uppercase font-mono hover:bg-surface-elevated/80">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
                {formData.thumbnail_url && <span className="text-xs text-primary truncate max-w-xs">{formData.thumbnail_url}</span>}
              </div>
            </div>

            {/* Relational Tech Stack Selection */}
            <div className="flex flex-col gap-4 pt-4 border-t border-border-glass mt-2">
              <label className="text-sm font-heading uppercase text-primary">Select Tech Stack</label>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => {
                  const isSelected = formData.selectedSkills.includes(skill.id);
                  return (
                    <div 
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`cursor-pointer border px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-2 select-none
                        ${isSelected ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border-glass text-on-surface-variant hover:border-on-surface-variant'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-primary' : 'bg-transparent border border-on-surface-variant'}`}></div>
                      {skill.name}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects List Grid */}
      {!isFormOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center p-12 border border-border-glass border-dashed text-on-surface-variant">
              No projects created yet. Click "New Project" to start building your portfolio.
            </div>
          ) : (
            projects.map(project => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface border border-border-glass flex flex-col overflow-hidden group"
              >
                {project.thumbnail_url ? (
                  <div className="h-48 w-full relative overflow-hidden bg-background">
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-2 py-1 text-[10px] uppercase font-mono tracking-widest border border-border-glass text-primary">
                      {project.status}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 w-full bg-surface-elevated/50 flex items-center justify-center border-b border-border-glass">
                    <span className="text-on-surface-variant font-mono text-sm uppercase">No Image</span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="text-xl font-heading text-primary uppercase">{project.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{project.short_description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-glass/50">
                    {project.selectedSkills.slice(0, 4).map((skillId: string) => {
                      const skill = skills.find(s => s.id === skillId);
                      if (!skill) return null;
                      return <span key={skillId} className="text-[10px] font-mono uppercase bg-primary-container text-on-primary-container px-2 py-1">{skill.name}</span>
                    })}
                    {project.selectedSkills.length > 4 && (
                      <span className="text-[10px] font-mono uppercase bg-surface-elevated text-on-surface px-2 py-1">+{project.selectedSkills.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border-glass p-3 flex justify-between items-center bg-surface-elevated/50">
                  <div className="flex gap-2">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" title="View Live">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(project)} className="text-on-surface-variant hover:text-primary transition-colors p-2" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-on-surface-variant hover:text-error transition-colors p-2" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
