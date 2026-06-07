'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ role: 'user', content: input });
    setInput('');
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-surface-elevated border border-border-glass p-4 rounded-none hover:border-primary transition-colors group flex items-center gap-3"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
        </span>
        <span className="font-mono text-technical-label text-on-surface uppercase">Ask Yash AI</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-50 bg-surface/90 backdrop-blur-xl border border-border-glass flex flex-col transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-[400px] h-[500px]'}`}>
      {/* Header */}
      <div className="h-14 border-b border-border-glass flex items-center justify-between px-4 bg-surface-elevated">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono text-technical-label text-on-surface">Terminal // Ask Yash AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-on-surface-variant hover:text-on-surface">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-technical-code">
            <div className="text-primary-container">
              &gt; AI System Initialized.<br/>
              &gt; Loading knowledge base... Done.<br/>
              &gt; How can I assist you with Yash's profile?
            </div>
            
            {messages.map((m) => {
              const textContent = m.content || (m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '');
              return (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 flex ${m.role === 'user' ? 'bg-surface-elevated text-on-surface rounded-l-xl rounded-tr-xl' : 'text-on-surface-variant'}`}>
                    {m.role === 'user' ? null : <span className="text-primary mr-2 flex-shrink-0">&gt;</span>}
                    <div className="flex-1 overflow-hidden">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          code: ({node, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return match ? (
                              <pre className="bg-surface-elevated border border-border-glass p-3 rounded my-2 overflow-x-auto text-primary">
                                <code className={className} {...props}>{children}</code>
                              </pre>
                            ) : (
                              <code className="bg-surface-elevated text-primary px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
                            );
                          },
                          pre: ({node, ...props}) => <div {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 flex flex-col gap-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 flex flex-col gap-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          a: ({node, ...props}) => <a className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-primary font-bold" {...props} />
                        }}
                      >
                        {textContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="text-on-surface-variant animate-pulse">
                <span className="text-primary mr-2">&gt;</span> Processing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={onFormSubmit} className="h-16 border-t border-border-glass p-2 bg-surface-elevated flex items-center">
            <span className="text-primary mx-2 font-mono">&gt;</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-technical-code text-on-surface placeholder:text-on-surface-variant/50"
            />
          </form>
        </>
      )}
    </div>
  );
}
