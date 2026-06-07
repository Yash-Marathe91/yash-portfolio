"use client";

import { Settings, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-border-glass pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            System Configuration
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">Manage profile, social links, and theme</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-4 py-2 font-mono uppercase tracking-wider text-sm transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-6">
          <h2 className="font-heading uppercase tracking-wider border-b border-border-glass pb-4">Profile Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">Name</label>
              <input type="text" defaultValue="Yash Marathe" className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">Title</label>
              <input type="text" defaultValue="AI Systems Engineer & Full Stack Developer" className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">Bio</label>
              <textarea rows={4} defaultValue="Building intelligent systems, scalable architectures, and next-generation robotics..." className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
          </div>
        </section>

        <section className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-6">
          <h2 className="font-heading uppercase tracking-wider border-b border-border-glass pb-4">Social & Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">GitHub URL</label>
              <input type="text" defaultValue="https://github.com/Yash-Marathe91" className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">LinkedIn URL</label>
              <input type="text" defaultValue="https://linkedin.com/in/yashmarathe" className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-on-surface-variant">Resume Link</label>
              <input type="text" defaultValue="https://docs.google.com/..." className="bg-surface border border-border-glass px-4 py-2 text-sm focus:outline-none focus:border-primary-container transition-colors" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
