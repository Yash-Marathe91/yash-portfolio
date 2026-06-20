'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const vfs: Record<string, string> = {
  'resume.pdf': '[BINARY FILE] - Use "cat resume.pdf" to open securely.',
  'about.md': '# Yash Marathe\n> AI Systems Engineer & Full Stack Developer\n> Building intelligent systems, scalable architectures, and next-gen robotics.',
  'contact.json': '{\n  "email": "hello@yashmarathe.com",\n  "status": "Available for new connections",\n  "location": "Earth"\n}',
  'secrets.log': '[192.168.1.1] - Unauthorized login attempt blocked.\n[10.0.0.5] - Quantum core stabilized.\n[127.0.0.1] - Coffee machine API unreachable.',
};

export default function SudoTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cmdInput, setCmdInput] = useState('');
  const [themeColor, setThemeColor] = useState('#00ff00');
  const [pwd, setPwd] = useState('/root/yash');
  
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) return;
      if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
        const newBuffer = (inputBuffer + e.key).slice(-4).toLowerCase();
        setInputBuffer(newBuffer);
        
        if (newBuffer === 'sudo') {
          setIsOpen(true);
          setInputBuffer('');
          startBootSequence();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputBuffer, isOpen]);

  useEffect(() => {
    if (isOpen && !isBooting && !isProcessing) {
      inputRef.current?.focus();
    }
  }, [isOpen, isBooting, isProcessing, logs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  const startBootSequence = () => {
    setLogs([]);
    setIsBooting(true);
    setThemeColor('#00ff00'); // Reset to default green
    const sequence = [
      "INIT: Booting Quantum Core...",
      "SYSTEM: Bypassing standard security protocols...",
      "ROOT ACCESS GRANTED.",
      "Loading Yash Marathe's Neural Network...",
      "Fetching classified architectural blueprints...",
      "Connection Established. Welcome, Admin.",
      "Type 'help' for a list of available commands."
    ];

    sequence.forEach((text, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, text]);
        if (i === sequence.length - 1) {
          setIsBooting(false);
        }
      }, i * 400 + Math.random() * 150);
    });
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim() || isProcessing) return;

    const fullCmd = cmdInput.trim();
    const args = fullCmd.split(' ').filter(Boolean);
    const cmd = args[0].toLowerCase();
    
    setCmdInput('');
    setLogs(prev => [...prev, `guest@terminal:${pwd}$ ${fullCmd}`]);

    let output: string[] = [];

    switch (cmd) {
      case 'help':
        output = [
          "Available Commands:",
          "  ls / dir - List directory contents",
          "  cat      - View file contents (e.g. 'cat resume.pdf')",
          "  pwd      - Print working directory",
          "  date     - Show current system time",
          "  echo     - Print text to terminal",
          "  theme    - Change terminal color (green, amber, blue, white, matrix)",
          "  whoami   - Display current user identity",
          "  projects - List classified projects",
          "  skills   - Display neural network capabilities",
          "  github   - Open GitHub profile",
          "  clear    - Clear terminal output",
          "  exit     - Terminate connection"
        ];
        break;
      case 'ls':
      case 'dir':
        output = [Object.keys(vfs).join('   ')];
        break;
      case 'cat':
        if (args.length < 2) {
          output = ["cat: missing file operand"];
        } else {
          const fileName = args[1];
          if (fileName === 'resume.pdf') {
            setIsProcessing(true);
            setLogs(prev => [...prev, "Decrypting and downloading resume.pdf..."]);
            const supabase = createClient();
            const { data } = await supabase.from('profile_settings').select('resume_file_url').single();
            if (data?.resume_file_url) {
              window.open(data.resume_file_url, '_blank');
              output = ["Resume successfully opened in secure viewer."];
            } else {
              output = ["cat: resume.pdf: File is corrupted or not uploaded yet."];
            }
            setIsProcessing(false);
          } else if (vfs[fileName]) {
            output = vfs[fileName].split('\n');
          } else {
            output = [`cat: ${fileName}: No such file or directory`];
          }
        }
        break;
      case 'pwd':
        output = [pwd];
        break;
      case 'cd':
        if (args.length < 2 || args[1] === '~') setPwd('/root/yash');
        else if (args[1] === '..') setPwd('/root');
        else output = [`cd: ${args[1]}: Not a directory`];
        break;
      case 'date':
        output = [new Date().toString()];
        break;
      case 'echo':
        output = [args.slice(1).join(' ')];
        break;
      case 'theme':
        if (args.length < 2) {
          output = ["Usage: theme [green|amber|blue|white|matrix]"];
        } else {
          const color = args[1].toLowerCase();
          const colors: Record<string, string> = {
            green: '#00ff00',
            amber: '#ffb000',
            blue: '#00ccff',
            white: '#ffffff',
            matrix: '#03A062'
          };
          if (colors[color]) {
            setThemeColor(colors[color]);
            output = [`Theme updated to ${color}.`];
          } else {
            output = [`theme: invalid color '${color}'`];
          }
        }
        break;
      case 'github':
        output = ["Opening secure connection to GitHub..."];
        window.open('https://github.com/Yash-Marathe91', '_blank');
        break;
      case 'whoami':
        output = [
          "Identity: Guest Visitor",
          "Access Level: Restricted (Read-Only)"
        ];
        break;
      case 'projects':
        output = [
          "Loading projects...",
          "- Construction ERP System [SECURE]",
          "- LocalHost AI [ACTIVE]",
          "- Campus Connect for AI Core [ACTIVE]"
        ];
        break;
      case 'skills':
        output = [
          "Core Directives:",
          "- Frontend: React 19, Next.js 15, TailwindCSS",
          "- Backend: Node.js, Supabase, PostgreSQL",
          "- AI: Vercel AI SDK, Gemini API",
          "- Systems: C++, Python, IoT, WebGL"
        ];
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'exit':
        setIsOpen(false);
        return;
      case 'sudo':
        output = ["yash is not in the sudoers file. This incident will be reported."];
        break;
      default:
        output = [`bash: ${cmd}: command not found`];
    }

    if (output.length > 0) {
      setLogs(prev => [...prev, ...output]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-12"
          onClick={() => inputRef.current?.focus()}
        >
          <div 
            className="w-full max-w-4xl h-full max-h-[600px] bg-black border shadow-2xl flex flex-col font-mono relative overflow-hidden transition-colors duration-500"
            style={{ borderColor: `${themeColor}40`, boxShadow: `0 0 40px ${themeColor}20` }}
            onClick={e => e.stopPropagation()}
          >
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-30 z-0" />
            
            {/* Header */}
            <div className="h-10 border-b flex items-center justify-between px-4 z-10 transition-colors duration-500" style={{ borderColor: `${themeColor}40`, backgroundColor: `${themeColor}10` }}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors duration-500" style={{ color: themeColor }}>
                <TerminalIcon className="w-4 h-4" />
                BASH // {pwd}
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors" style={{ color: themeColor }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Terminal Body */}
            <div 
              className="flex-1 p-6 overflow-y-auto text-sm sm:text-base leading-relaxed z-10 font-bold tracking-wide scroll-smooth transition-colors duration-500"
              style={{ color: themeColor, textShadow: `0 0 8px ${themeColor}40`, boxShadow: `inset 0 0 30px ${themeColor}10` }}
            >
              {logs.map((log, i) => (
                <div key={i} className="mb-1.5 flex items-start gap-3">
                  {!log.startsWith('guest@terminal') && !log.startsWith('Available') && !log.startsWith('  ') && !log.startsWith('-') && !log.startsWith('INIT') && !log.startsWith('SYSTEM') && !log.startsWith('ROOT') && !log.startsWith('Loading') && !log.startsWith('Fetching') && !log.startsWith('Connection') && !log.startsWith('Type') && (
                    <span className="opacity-70 whitespace-nowrap hidden sm:inline">&gt;</span>
                  )}
                  <span className={`whitespace-pre-wrap ${log.includes('GRANTED') ? 'text-white drop-shadow-md' : ''}`}>{log}</span>
                </div>
              ))}
              
              {isBooting ? (
                <div className="mt-4 flex items-center gap-3">
                  <span className="opacity-70">guest@terminal:{pwd}$</span>
                  <span className="animate-pulse w-2.5 h-5 inline-block" style={{ backgroundColor: themeColor, boxShadow: `0 0 8px ${themeColor}` }}></span>
                </div>
              ) : (
                <form onSubmit={handleCommandSubmit} className="mt-2 flex items-center gap-3">
                  <span className="opacity-70 whitespace-nowrap">guest@terminal:{pwd}$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={cmdInput}
                    onChange={e => setCmdInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-mono p-0 focus:ring-0 w-full transition-colors duration-500"
                    style={{ color: themeColor }}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                  />
                </form>
              )}
              
              <div ref={endRef} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
