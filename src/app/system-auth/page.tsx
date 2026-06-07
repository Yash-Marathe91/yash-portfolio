"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Terminal, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SystemAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error("Invalid Credentials");
      }

      if (data.user) {
        // Enforce specific admin email if required
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (adminEmail && data.user.email !== adminEmail) {
          await supabase.auth.signOut();
          throw new Error("ACCESS DENIED: Unauthorized User");
        }
        
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'ACCESS DENIED');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono text-foreground">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-glass to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-glass to-transparent opacity-50"></div>
      
      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute bottom-8 left-8 z-20 flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Return
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md bg-surface-elevated/50 backdrop-blur-md border border-border-glass p-8 relative"
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-container"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-container"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary-container"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary-container"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-surface border border-border-glass mb-4 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading tracking-widest uppercase">System Auth</h1>
          <p className="text-technical-label text-on-surface-variant mt-2 tracking-widest uppercase text-xs">
            Restricted Access Portal
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-error/10 border border-error/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-error font-bold uppercase text-sm">Access Denied</span>
              <span className="text-error/80 text-xs mt-1">{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">Identity (Email)</label>
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-border-glass pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors placeholder:text-on-surface-variant/30"
                placeholder="admin@system.local"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase text-on-surface-variant tracking-wider">Passphrase</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-border-glass pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-container transition-colors placeholder:text-on-surface-variant/30"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container py-3 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Initialize Session</span>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
