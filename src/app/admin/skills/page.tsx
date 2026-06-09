"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Database, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillsManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 80,
    category_id: '',
    icon_name: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, skillRes] = await Promise.all([
        supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true })
      ]);
      
      if (catRes.error) throw catRes.error;
      if (skillRes.error) throw skillRes.error;

      setCategories(catRes.data || []);
      setSkills(skillRes.data || []);
      
      if (catRes.data && catRes.data.length > 0 && !newSkill.category_id) {
        setNewSkill(prev => ({ ...prev, category_id: catRes.data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching skills data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .insert([{ name: newCategoryName.trim() }])
        .select()
        .single();

      if (error) throw error;
      setCategories([...categories, data]);
      setNewCategoryName('');
      if (!newSkill.category_id) setNewSkill({ ...newSkill, category_id: data.id });
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete all skills inside this category too.")) return;
    try {
      const { error } = await supabase.from('skill_categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
      setSkills(skills.filter(s => s.category_id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.category_id) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([newSkill])
        .select()
        .single();

      if (error) throw error;
      setSkills([...skills, data]);
      setNewSkill({ ...newSkill, name: '', icon_name: '' }); // Reset form but keep category
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading uppercase text-foreground flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          Skills Matrix
        </h1>
        <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
          Manage technical categories and individual proficiencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Management Forms */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          
          {/* Add Category Form */}
          <div className="bg-surface border border-border-glass p-6 flex flex-col gap-4">
            <h2 className="text-lg font-heading uppercase">Add Category</h2>
            <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="e.g. Frontend, Backend"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="bg-background border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors"
              />
              <button
                type="submit"
                className="bg-primary-container text-on-primary-container px-4 py-2 uppercase tracking-widest text-xs font-bold transition-all hover:bg-primary-container/80 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </form>
          </div>

          {/* Add Skill Form */}
          <div className="bg-surface border border-border-glass p-6 flex flex-col gap-4">
            <h2 className="text-lg font-heading uppercase">Add Skill</h2>
            <form onSubmit={handleAddSkill} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Category</label>
                <select
                  value={newSkill.category_id}
                  onChange={(e) => setNewSkill({ ...newSkill, category_id: e.target.value })}
                  required
                  className="bg-background border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {categories.length === 0 && <option value="">Create a category first</option>}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React, Python"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  required
                  className="bg-background border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase text-on-surface-variant tracking-wider">
                  Proficiency ({newSkill.proficiency}%)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <button
                type="submit"
                disabled={categories.length === 0}
                className="bg-primary-container text-on-primary-container px-4 py-2 uppercase tracking-widest text-xs font-bold transition-all hover:bg-primary-container/80 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Preview & List */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {categories.length === 0 ? (
            <div className="text-center p-12 border border-border-glass border-dashed text-on-surface-variant">
              No categories found. Create one to start adding skills.
            </div>
          ) : (
            categories.map(category => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border-glass p-6"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-glass">
                  <h3 className="text-xl font-heading uppercase text-primary">
                    // {category.name}
                  </h3>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-error/50 hover:text-error transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-4">
                  {skills.filter(s => s.category_id === category.id).length === 0 ? (
                    <p className="text-sm text-on-surface-variant italic">No skills added yet.</p>
                  ) : (
                    skills.filter(s => s.category_id === category.id).map(skill => (
                      <div key={skill.id} className="flex items-center justify-between group">
                        <div className="flex-1 flex items-center gap-4">
                          <span className="font-mono text-sm uppercase w-32 truncate">{skill.name}</span>
                          <div className="flex-1 h-2 bg-background border border-border-glass relative overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="absolute top-0 left-0 h-full bg-primary"
                            />
                          </div>
                          <span className="text-xs font-mono text-primary w-10 text-right">{skill.proficiency}%</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="ml-4 text-error/0 group-hover:text-error/80 hover:!text-error transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
