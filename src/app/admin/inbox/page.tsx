"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Inbox, Mail, MailOpen, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactInbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription for new messages!
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, payload => {
        setMessages(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'unread' | 'read' | 'archived') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: newStatus } : msg
      ));

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSelectMessage = (msg: any) => {
    setSelectedMessage(msg);
    // Auto mark as read if it was unread
    if (msg.status === 'unread') {
      updateStatus(msg.id, 'read');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-heading uppercase text-foreground flex items-center gap-3">
          <Inbox className="w-8 h-8 text-primary" />
          Terminal Inbox
          {unreadCount > 0 && (
            <span className="bg-primary text-on-primary text-sm font-mono px-3 py-1 rounded-full animate-pulse">
              {unreadCount} Unread
            </span>
          )}
        </h1>
        <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
          Secure communication channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Message List */}
        <div className="lg:col-span-1 bg-surface border border-border-glass flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-glass bg-surface-elevated flex items-center justify-between shrink-0">
            <h2 className="font-heading uppercase text-sm tracking-widest text-primary">Incoming Transmissions</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-mono text-sm uppercase">
                No messages found.
              </div>
            ) : (
              messages.map(msg => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'unread';
                const isArchived = msg.status === 'archived';

                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-4 border-b border-border-glass transition-all
                      ${isSelected ? 'bg-primary-container/20 border-l-2 border-primary' : 'hover:bg-surface-elevated border-l-2 border-transparent'}
                      ${isArchived ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-primary' : 'text-foreground'}`}>
                        {msg.sender_name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`text-xs truncate ${isUnread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                      {msg.subject || 'No Subject'}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {isUnread ? (
                        <Mail className="w-3 h-3 text-primary" />
                      ) : isArchived ? (
                        <Archive className="w-3 h-3 text-on-surface-variant" />
                      ) : (
                        <MailOpen className="w-3 h-3 text-on-surface-variant" />
                      )}
                      <span className="text-[10px] uppercase font-mono tracking-widest text-on-surface-variant">
                        {msg.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Preview */}
        <div className="lg:col-span-2 bg-surface border border-border-glass flex flex-col overflow-hidden">
          {!selectedMessage ? (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 opacity-50">
              <Mail className="w-16 h-16 mb-4" />
              <p className="font-mono text-sm uppercase tracking-widest text-center">
                Select a transmission to<br/>decrypt and view contents.
              </p>
            </div>
          ) : (
            <motion.div 
              key={selectedMessage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-glass bg-surface-elevated shrink-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-heading text-foreground">{selectedMessage.subject || 'No Subject'}</h2>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-2">
                      <span className="uppercase tracking-widest font-mono text-xs text-primary">From:</span>
                      <span className="font-medium">{selectedMessage.sender_name}</span>
                      <span className="opacity-50">&lt;</span>
                      <a href={`mailto:${selectedMessage.sender_email}`} className="text-primary hover:underline">
                        {selectedMessage.sender_email}
                      </a>
                      <span className="opacity-50">&gt;</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono mt-1">
                      <span className="uppercase tracking-widest text-primary">Received:</span>
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {selectedMessage.status === 'archived' ? (
                      <button 
                        onClick={() => updateStatus(selectedMessage.id, 'read')}
                        className="p-2 border border-border-glass hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                        title="Unarchive"
                      >
                        <ArchiveRestore className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(selectedMessage.id, 'archived')}
                        className="p-2 border border-border-glass hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus(selectedMessage.id, 'unread')}
                      className="p-2 border border-border-glass hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                      title="Mark as Unread"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 border border-error/50 hover:bg-error/10 text-error transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background">
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-on-surface">
                  {selectedMessage.message}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
      </div>
    </div>
  );
}
