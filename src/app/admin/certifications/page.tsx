"use client";

import { GraduationCap, Plus } from 'lucide-react';

export default function AdminCertifications() {
  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-border-glass pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            Certifications
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">Manage professional certificates and credentials</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-4 py-2 font-mono uppercase tracking-wider text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Add Cert
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 border border-border-glass border-dashed text-on-surface-variant">
        <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-mono text-sm uppercase tracking-widest">No Certifications Found</p>
      </div>
    </div>
  );
}
