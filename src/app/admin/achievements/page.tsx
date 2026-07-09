"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Award, Save, Edit, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    issuer: '',
    type: 'certification',
    issue_date: '',
    description: '',
    credential_url: '',
    image_url: '',
    is_featured: true
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `achievement-${Date.now()}.${fileExt}`;
      const filePath = `achievements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const achievementData = {
        title: formData.title,
        issuer: formData.issuer,
        type: formData.type,
        issue_date: formData.issue_date || null,
        description: formData.description,
        credential_url: formData.credential_url,
        image_url: formData.image_url,
        is_featured: formData.is_featured
      };

      if (formData.id) {
        const { error } = await supabase.from('achievements').update(achievementData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('achievements').insert([achievementData]);
        if (error) throw error;
      }

      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving achievement:", error);
      alert("Failed to save achievement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '', title: '', issuer: '', type: 'certification', issue_date: '',
      description: '', credential_url: '', image_url: '', is_featured: true
    });
    setIsFormOpen(false);
  };

  const openEditForm = (achievement: any) => {
    setFormData({
      id: achievement.id,
      title: achievement.title,
      issuer: achievement.issuer,
      type: achievement.type,
      issue_date: achievement.issue_date || '',
      description: achievement.description || '',
      credential_url: achievement.credential_url || '',
      image_url: achievement.image_url || '',
      is_featured: achievement.is_featured
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase text-foreground flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            Achievements Log
          </h1>
          <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
            Manage certifications, awards, hackathons, and milestones.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary text-on-primary px-6 py-3 uppercase tracking-widest text-sm font-bold transition-all hover:bg-primary/80 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New
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
              {formData.id ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
            <button onClick={resetForm} className="text-on-surface-variant hover:text-foreground text-sm uppercase font-mono tracking-widest">
              [Cancel]
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Issuer / Organization</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  required
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase font-mono"
                >
                  <option value="certification">Certification</option>
                  <option value="award">Award</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="milestone">Milestone</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Issue Date</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Credential URL</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-on-surface-variant tracking-wider">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-background border border-border-glass px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-on-surface-variant tracking-wider">Badge / Image</label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-contain border border-border-glass bg-surface-elevated rounded p-1" />
                )}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isUploading}
                  />
                  <button type="button" className="bg-surface-elevated border border-border-glass px-4 py-3 flex items-center gap-2 text-sm uppercase font-mono hover:bg-surface-elevated/80">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Saving...' : 'Save Achievement'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List Grid */}
      {!isFormOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.length === 0 ? (
            <div className="col-span-full text-center p-12 border border-border-glass border-dashed text-on-surface-variant">
              No achievements logged yet. Click "Add New" to record one.
            </div>
          ) : (
            achievements.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface border border-border-glass flex flex-col overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 bg-primary/10 text-primary border-b border-l border-border-glass px-3 py-1 text-[10px] uppercase font-mono tracking-widest">
                  {item.type}
                </div>
                
                <div className="p-6 flex flex-col gap-4 flex-1 mt-4">
                  <div className="flex items-start gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-12 h-12 object-contain bg-surface-elevated p-1 border border-border-glass rounded-sm" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-surface-elevated border border-border-glass rounded-sm">
                        <Award className="w-6 h-6 text-on-surface-variant" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading text-foreground">{item.title}</h3>
                      <p className="text-xs font-mono text-primary uppercase mt-1">{item.issuer}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-on-surface-variant line-clamp-3">{item.description}</p>
                </div>

                <div className="border-t border-border-glass p-3 flex justify-between items-center bg-surface-elevated/50">
                  <div className="flex gap-2">
                    {item.credential_url && (
                      <a href={item.credential_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors p-2" title="View Credential">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs text-on-surface-variant items-center px-2 font-mono">
                    {item.issue_date ? new Date(item.issue_date).getFullYear() : 'N/A'}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(item)} className="text-on-surface-variant hover:text-primary transition-colors p-2" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-2" title="Delete">
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
