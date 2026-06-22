'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function SystemStatusBadge() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-2 border border-[#00ff00]/30 bg-[#00ff00]/5 px-3 py-1.5 rounded-sm font-mono text-xs text-[#00ff00] uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,0,0.1)]">
      <Activity className="w-3.5 h-3.5 animate-pulse" />
      <span className="hidden xl:inline">SYS_ON // UPTIME: {formatTime(uptime)}</span>
      <span className="xl:hidden">{formatTime(uptime)}</span>
    </div>
  );
}
