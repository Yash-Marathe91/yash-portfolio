"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Award, GraduationCap, LineChart, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Achievements', href: '/admin/achievements', icon: Award },
  { name: 'Certifications', href: '/admin/certifications', icon: GraduationCap },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary-container">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-glass bg-surface/50 backdrop-blur-md flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-border-glass">
            <div className="flex items-center gap-3 text-primary">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="font-heading uppercase tracking-widest text-lg">System Core</h2>
            </div>
            <p className="text-technical-label text-on-surface-variant mt-2 text-xs uppercase tracking-widest">
              Admin Terminal Active
            </p>
          </div>
          
          <nav className="p-4 flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors ${
                    isActive 
                      ? 'bg-primary-container/20 text-primary border-l-2 border-primary' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-elevated border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border-glass">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border-glass bg-surface/50 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-technical-label text-on-surface-variant">
            <span>root</span>
            <span className="text-primary">@</span>
            <span>yash-portfolio</span>
            <span className="mx-2">~</span>
            <span className="text-foreground">{pathname}</span>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
