'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';

export default function SudoTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);
  const [cmdInput, setCmdInput] = useState('');
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
    if (isOpen && !isBooting) {
      inputRef.current?.focus();
    }
  }, [isOpen, isBooting, logs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  const startBootSequence = () => {
    setLogs([]);
    setIsBooting(true);
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
      }, i * 500 + Math.random() * 200);
    });
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim().toLowerCase();
    const newLogs = [...logs, `root@yash:~# ${cmdInput}`];

    switch (cmd) {
      case 'help':
        newLogs.push(
          "Available Commands:",
          "  help     - Show this message",
          "  whoami   - Display current user identity",
          "  projects - List classified projects",
          "  skills   - Display neural network capabilities",
          "  clear    - Clear terminal output",
          "  exit     - Terminate connection"
        );
        break;
      case 'whoami':
        newLogs.push("Identity: Guest Visitor");
        newLogs.push("Access Level: Restricted (Read-Only)");
        break;
      case 'projects':
        newLogs.push("Loading projects...");
        newLogs.push("- Construction ERP System [SECURE]");
        newLogs.push("- LocalHost AI [ACTIVE]");
        newLogs.push("- Campus Connect for AI Core [ACTIVE]");
        break;
      case 'skills':
        newLogs.push("Core Directives:");
        newLogs.push("- Frontend: React 19, Next.js 15, TailwindCSS");
        newLogs.push("- Backend: Node.js, Supabase, PostgreSQL");
        newLogs.push("- AI: Vercel AI SDK, Gemini API");
        newLogs.push("- Systems: C++, Python, IoT, WebGL");
        break;
      case 'clear':
        setLogs([]);
        setCmdInput('');
        return;
      case 'exit':
        setIsOpen(false);
        setCmdInput('');
        return;
      case 'sudo':
        newLogs.push("Nice try. You already have root access.");
        break;
      default:
        newLogs.push(`Command not found: ${cmd}`);
        newLogs.push("Type 'help' to see available commands.");
    }

    setLogs(newLogs);
    setCmdInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-12"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="w-full max-w-4xl h-full max-h-[600px] bg-black border border-[#00ff00]/30 shadow-[0_0_40px_rgba(0,255,0,0.15)] flex flex-col font-mono relative overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-20 z-0" />
            
            {/* Header */}
            <div className="h-10 border-b border-[#00ff00]/30 flex items-center justify-between px-4 bg-[#00ff00]/5 z-10">
              <div className="flex items-center gap-2 text-[#00ff00] text-xs uppercase tracking-widest font-bold">
                <TerminalIcon className="w-4 h-4" />
                ROOT SHELL OVERRIDE
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#00ff00] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Terminal Body */}
            <div className="flex-1 p-6 overflow-y-auto text-[#00ff00] text-sm sm:text-base leading-relaxed z-10 font-bold tracking-wide shadow-[inset_0_0_20px_rgba(0,255,0,0.05)] scroll-smooth">
              
              {logs.map((log, i) => (
                <div key={i} className="mb-2 flex items-start gap-3">
                  {!log.startsWith('root@yash') && !log.startsWith('Available') && !log.startsWith('  ') && !log.startsWith('-') && (
                    <span className="opacity-70 whitespace-nowrap hidden sm:inline">&gt;</span>
                  )}
                  <span className={`whitespace-pre-wrap ${log.includes('GRANTED') ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}>{log}</span>
                </div>
              ))}
              
              {isBooting ? (
                <div className="mt-4 flex items-center gap-3">
                  <span className="opacity-70">root@yash:~#</span>
                  <span className="animate-pulse w-2.5 h-5 bg-[#00ff00] inline-block shadow-[0_0_8px_#00ff00]"></span>
                </div>
              ) : (
                <form onSubmit={handleCommandSubmit} className="mt-4 flex items-center gap-3">
                  <span className="opacity-70 whitespace-nowrap">root@yash:~#</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={cmdInput}
                    onChange={e => setCmdInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[#00ff00] font-mono p-0 focus:ring-0 w-full"
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
