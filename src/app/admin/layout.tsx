"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UserCircle, Database, FolderKanban, Award, Inbox, LogOut, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Profile & Resume', href: '/admin/profile', icon: UserCircle },
  { name: 'Skills', href: '/admin/skills', icon: Database },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Achievements', href: '/admin/achievements', icon: Award },
  { name: 'Inbox', href: '/admin/inbox', icon: Inbox },
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
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary-container pt-[64px] md:pt-[80px]">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)]"></div>
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-r border-border-glass bg-surface/50 backdrop-blur-md flex flex-col justify-between md:sticky top-[64px] md:top-[80px] z-20 md:h-[calc(100vh-80px)]">
        <div>
          <div className="p-4 md:p-6 border-b border-border-glass hidden md:block">
            <div className="flex items-center gap-3 text-primary">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="font-heading uppercase tracking-widest text-lg">System Core</h2>
            </div>
            <p className="text-technical-label text-on-surface-variant mt-2 text-xs uppercase tracking-widest">
              Admin Terminal Active
            </p>
          </div>
          
          <nav className="p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto overflow-y-hidden no-scrollbar">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary-container/20 text-primary border-b-2 md:border-b-0 md:border-l-2 border-primary' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-elevated border-b-2 md:border-b-0 md:border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 hidden sm:block md:block" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 md:p-4 border-t border-border-glass hidden md:block">
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
        <header className="h-12 md:h-16 border-b border-border-glass bg-surface/50 backdrop-blur-md flex items-center px-4 md:px-8 sticky top-[114px] md:top-[80px] z-10 overflow-x-auto no-scrollbar">
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
