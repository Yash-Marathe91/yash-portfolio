"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown } from 'lucide-react';

type MilestoneProps = {
  item: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    type: string;
    description: string;
    url: string;
  };
};

export default function ExpandableMilestone({ item }: MilestoneProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col p-6 sm:p-8 border border-border-glass hover:bg-surface-elevated transition-colors gap-6 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-heading uppercase text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
            {item.title}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-on-surface-variant">
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </h3>
          <span className="text-technical-label text-primary">{item.issuer}</span>
        </div>
        <div className="flex flex-col gap-2 md:items-end shrink-0">
          <span className="text-technical-code text-on-surface-variant">{item.date}</span>
          <span className="text-technical-label bg-surface-container px-3 py-1 border border-border-glass">
            {item.type}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-4 overflow-hidden border-t border-border-glass pt-6 mt-2"
          >
            <p className="text-on-surface-variant font-mono text-sm leading-relaxed max-w-4xl">
              {item.description || "No description provided."}
            </p>
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-primary hover:text-foreground transition-colors font-mono uppercase tracking-widest text-xs w-fit"
              >
                <ExternalLink className="w-4 h-4" /> View Credential
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
