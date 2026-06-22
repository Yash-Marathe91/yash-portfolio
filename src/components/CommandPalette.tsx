'use client';

import * as React from 'react';
import {
  Mail,
  Briefcase,
  Trophy,
  Code,
  Terminal,
  Download
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const downloadResume = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('profile_settings').select('resume_file_url').single();
    if (data?.resume_file_url) {
      window.open(data.resume_file_url, '_blank');
    } else {
      alert('Resume not found or currently unavailable.');
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="System & Overrides">
          <CommandItem onSelect={() => runCommand(() => window.dispatchEvent(new Event('open-sudo-terminal')))}>
            <Terminal className="mr-2 h-4 w-4 text-primary" />
            <span className="text-primary font-bold">Initialize Root Override (Sudo Mode)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(downloadResume)}>
            <Download className="mr-2 h-4 w-4 text-primary" />
            <span className="text-primary font-bold">Decrypt & Download Resume</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('#projects'))}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('#skills'))}>
            <Code className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('#achievements'))}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Achievements</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Socials">
          <CommandItem onSelect={() => runCommand(() => window.open('https://github.com/Yash-Marathe91', '_blank'))}>
            <Code className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open('https://linkedin.com/in/yash-marathe', '_blank'))}>
            <span>LinkedIn</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.location.href = 'mailto:hello@yashmarathe.com')}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
