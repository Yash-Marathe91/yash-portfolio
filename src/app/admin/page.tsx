"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Activity, Users, Eye, Mail, Cpu, Database, Network, Briefcase, Award, Code, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    achievementsCount: 0,
    unreadMessages: 0,
    totalMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Projects
        const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        
        // Skills
        const { count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: true });

        // Achievements
        const { count: achievementsCount } = await supabase.from('achievements').select('*', { count: 'exact', head: true });

        // Messages
        const { count: unreadMessages } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread');
        const { count: totalMessages } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });

        setStats({
          projectsCount: projectsCount || 0,
          skillsCount: skillsCount || 0,
          achievementsCount: achievementsCount || 0,
          unreadMessages: unreadMessages || 0,
          totalMessages: totalMessages || 0
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground">Command Center</h1>
        <p className="text-on-surface-variant font-mono text-sm">System Overview & Analytics</p>
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Projects" value={stats.projectsCount.toString()} icon={Briefcase} trend="ONLINE" />
          <StatCard title="Tracked Skills" value={stats.skillsCount.toString()} icon={Code} trend="MAPPED" />
          <StatCard title="Achievements" value={stats.achievementsCount.toString()} icon={Award} trend="LOGGED" />
          <StatCard 
            title="Unread Inbox" 
            value={`${stats.unreadMessages} / ${stats.totalMessages}`} 
            icon={Mail} 
            trend={stats.unreadMessages > 0 ? "ATTENTION" : "CLEAR"} 
            highlight={stats.unreadMessages > 0}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-glass pb-4">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="font-heading uppercase tracking-wider">System Traffic Logs</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-on-surface-variant/50 font-mono text-sm">
            [ EXTERNAL TRAFFIC API DISCONNECTED - V2 FEATURE ]
          </div>
        </div>

        <div className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-glass pb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-heading uppercase tracking-wider">System Status</h2>
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <StatusRow label="Database Connection" status="ONLINE" />
            <StatusRow label="Row Level Security" status="SECURE" />
            <StatusRow label="Realtime Sockets" status="ACTIVE" />
            <StatusRow label="Asset Storage" status="OK" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, highlight = false }: { title: string, value: string, icon: any, trend: string, highlight?: boolean }) {
  return (
    <div className={`border p-6 flex flex-col gap-4 transition-colors ${highlight ? 'border-primary bg-primary/5' : 'border-border-glass bg-surface-elevated/30'}`}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-mono uppercase tracking-wider ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}>{title}</span>
        <Icon className={`w-5 h-5 ${highlight ? 'text-primary' : 'text-primary/70'}`} />
      </div>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-heading">{value}</span>
        <span className={`text-sm font-mono mb-1 ${highlight ? 'text-error animate-pulse' : 'text-primary'}`}>{trend}</span>
      </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string, status: string }) {
  const isOk = status === 'ONLINE' || status === 'SECURE' || status === 'ACTIVE' || status === 'OK';
  return (
    <div className="flex justify-between items-center text-sm font-mono">
      <span className="text-on-surface-variant">{label}</span>
      <span className={isOk ? "text-primary" : "text-error"}>[{status}]</span>
    </div>
  );
}
