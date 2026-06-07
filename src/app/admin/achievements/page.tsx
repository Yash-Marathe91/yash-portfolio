"use client";

import { Award, Plus } from 'lucide-react';
import { achievements } from '@/data/achievements';

export default function AdminAchievements() {
  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-border-glass pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            Achievements
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">Manage GSSOC badges, Hackathon certificates, and more</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-4 py-2 font-mono uppercase tracking-wider text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-border-glass bg-surface-elevated/30 hover:border-primary/50 transition-colors gap-6 group">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-heading uppercase text-foreground">{item.title}</h3>
              <div className="flex gap-4">
                <span className="text-technical-label text-primary">{item.issuer}</span>
                <span className="text-technical-code text-on-surface-variant">{item.date}</span>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="px-4 py-2 border border-border-glass text-foreground font-mono text-xs uppercase hover:bg-surface-elevated">Edit</button>
              <button className="px-4 py-2 border border-error text-error font-mono text-xs uppercase hover:bg-error/10">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
