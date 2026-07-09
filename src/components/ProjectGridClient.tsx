"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ProjectGridClient({ cards }: { cards: React.ReactNode[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedCards = showAll ? cards : cards.slice(0, 4);

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.length === 0 ? (
          <div className="col-span-full py-12 text-on-surface-variant font-mono uppercase tracking-widest text-center">
            Fetching projects from database...
          </div>
        ) : (
          displayedCards
        )}
      </div>
      
      {cards.length > 4 && !showAll && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="group relative z-50 flex items-center justify-center gap-3 border border-border-glass text-on-surface px-8 py-4 uppercase hover:bg-surface-elevated transition-colors w-full md:w-auto text-center font-mono text-sm tracking-widest cursor-pointer"
          >
            View More Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
