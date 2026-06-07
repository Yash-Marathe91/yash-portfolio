"use client";

import { LineChart, Activity, Users, Eye, Mail } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-border-glass pb-6">
        <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground flex items-center gap-3">
          <LineChart className="w-8 h-8 text-primary" />
          Analytics & Telemetry
        </h1>
        <p className="text-on-surface-variant font-mono text-sm">View traffic patterns and user engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget title="Total Visits" icon={Users} />
        <StatWidget title="GitHub Clicks" icon={Activity} />
        <StatWidget title="Contact Requests" icon={Mail} />
        <StatWidget title="Project Views" icon={Eye} />
      </div>

      <div className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4 mt-4 h-96">
        <div className="flex items-center justify-between border-b border-border-glass pb-4">
          <h2 className="font-heading uppercase tracking-wider">Traffic Over Time</h2>
          <span className="text-xs font-mono text-on-surface-variant border border-border-glass px-2 py-1">LAST 30 DAYS</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-on-surface-variant/50 font-mono text-sm border border-border-glass border-dashed mt-4">
          [ CHART MODULE NOT INITIALIZED ]
        </div>
      </div>
    </div>
  );
}

function StatWidget({ title, icon: Icon }: { title: string, icon: any }) {
  return (
    <div className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="text-on-surface-variant text-sm font-mono uppercase tracking-wider">{title}</span>
        <Icon className="w-5 h-5 text-primary/70" />
      </div>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-heading">0</span>
      </div>
    </div>
  );
}
