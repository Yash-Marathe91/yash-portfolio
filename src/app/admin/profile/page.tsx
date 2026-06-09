"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, UploadCloud, Save, UserCircle, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const { error } = await supabase
        .from('profile_settings')
        .update({
          full_name: profile.full_name,
          hero_title: profile.hero_title,
          bio: profile.bio,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          contact_email: profile.contact_email,
          availability_status: profile.availability_status
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSuccessMsg("Profile information updated successfully!");
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    setSuccessMsg(null);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Math.random()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      // 3. Update profile_settings table with the new URL
      const { error: updateError } = await supabase
        .from('profile_settings')
        .update({
          resume_file_url: publicUrl,
          resume_last_updated: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, resume_file_url: publicUrl, resume_last_updated: new Date().toISOString() });
      setSuccessMsg("Resume uploaded successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Did you create the 'portfolio-assets' bucket and set it to public?");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-error">No profile found. Did you run the SQL seed query?</div>;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading uppercase text-foreground flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-primary" />
          Profile & Resume
        </h1>
        <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
          Manage your global portfolio metadata and downloadable assets.
        </p>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-container/20 border border-primary text-primary px-4 py-3 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-mono text-sm uppercase">{successMsg}</span>
        </motion.div>
      )}

      {/* Resume Upload Section */}
      <div className="bg-surface border border-border-glass p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <h2 className="text-xl font-heading uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Resume Document
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-on-surface-variant text-sm">
              Current Resume URL: 
              {profile.resume_file_url ? (
                <a href={profile.resume_file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline ml-2 break-all">
                  [View Current PDF]
                </a>
              ) : (
                <span className="text-error ml-2">None uploaded</span>
              )}
            </p>
            {profile.resume_last_updated && (
              <p className="text-technical-label text-on-surface-variant">
                Last updated: {new Date(profile.resume_last_updated).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isUploading}
            />
            <button 
              disabled={isUploading}
              className="flex items-center gap-2 bg-surface-elevated border border-border-glass px-6 py-3 hover:bg-surface-elevated/80 transition-colors uppercase font-mono text-sm disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Upload New PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-surface border border-border-glass p-6 md:p-8 flex flex-col gap-8">
        <h2 className="text-xl font-heading uppercase">General Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name || ''}
              onChange={handleChange}
              required
              className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">Availability Status</label>
            <input
              type="text"
              name="availability_status"
              value={profile.availability_status || ''}
              onChange={handleChange}
              className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
              placeholder="e.g. Open to opportunities"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase text-on-surface-variant tracking-wider">Hero Title (Job Description)</label>
          <input
            type="text"
            name="hero_title"
            value={profile.hero_title || ''}
            onChange={handleChange}
            required
            className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase text-on-surface-variant tracking-wider">Bio (Hero Paragraph)</label>
          <textarea
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
            rows={4}
            className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors resize-y"
          />
        </div>

        <h2 className="text-xl font-heading uppercase mt-4">Contact & Social Links</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">Public Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={profile.contact_email || ''}
              onChange={handleChange}
              className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={profile.github_url || ''}
              onChange={handleChange}
              className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={profile.linkedin_url || ''}
              onChange={handleChange}
              className="bg-background border border-border-glass px-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
