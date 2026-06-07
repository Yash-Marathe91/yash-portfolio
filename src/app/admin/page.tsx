"use client";

import { Activity, Users, Eye, Mail, Cpu, Database, Network } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading uppercase tracking-widest text-foreground">Command Center</h1>
        <p className="text-on-surface-variant font-mono text-sm">System Overview & Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder Stats */}
        <StatCard title="Total Visits" value="-- / --" icon={Users} trend="+--%" />
        <StatCard title="GitHub Clicks" value="-- / --" icon={Activity} trend="+--%" />
        <StatCard title="Contact Requests" value="-- / --" icon={Mail} trend="+--%" />
        <StatCard title="Project Views" value="-- / --" icon={Eye} trend="+--%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-glass pb-4">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="font-heading uppercase tracking-wider">System Traffic Logs</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-on-surface-variant/50 font-mono text-sm">
            [ INITIALIZING DATA STREAM... ]
          </div>
        </div>

        <div className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-glass pb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-heading uppercase tracking-wider">System Status</h2>
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <StatusRow label="Database Connection" status="ONLINE" />
            <StatusRow label="Authentication" status="SECURE" />
            <StatusRow label="API Endpoints" status="ACTIVE" />
            <StatusRow label="Storage" status="OK" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="border border-border-glass bg-surface-elevated/30 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="text-on-surface-variant text-sm font-mono uppercase tracking-wider">{title}</span>
        <Icon className="w-5 h-5 text-primary/70" />
      </div>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-heading">{value}</span>
        <span className="text-primary text-sm font-mono mb-1">{trend}</span>
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
