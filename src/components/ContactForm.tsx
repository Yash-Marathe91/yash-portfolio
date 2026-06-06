'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const email = formData.get('email') as string;
      const name = formData.get('name') as string;
      const message = formData.get('message') as string;
      
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address provided.');
      }
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-elevated border border-border-glass p-8 w-full max-w-2xl">
      <div className="mb-8">
        <h3 className="text-3xl font-heading uppercase text-foreground mb-2">Initialize Contact</h3>
        <p className="text-body-md text-on-surface-variant font-mono text-sm">&gt; Send an encrypted transmission to the main server.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-technical-label text-primary uppercase">Identity [Name]</label>
          <input 
            type="text" 
            name="name"
            required
            disabled={loading || success}
            className="bg-surface-container border-b border-border-glass px-4 py-3 text-on-surface font-mono outline-none focus:border-primary transition-colors disabled:opacity-50"
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-technical-label text-primary uppercase">Locator [Email]</label>
          <input 
            type="email" 
            name="email"
            required
            disabled={loading || success}
            className="bg-surface-container border-b border-border-glass px-4 py-3 text-on-surface font-mono outline-none focus:border-primary transition-colors disabled:opacity-50"
            placeholder="john@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-technical-label text-primary uppercase">Payload [Message]</label>
          <textarea 
            name="message"
            required
            rows={5}
            disabled={loading || success}
            className="bg-surface-container border-b border-border-glass px-4 py-3 text-on-surface font-mono outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
            placeholder="Enter transmission payload here..."
          ></textarea>
        </div>

        {error && (
          <div className="bg-error/10 border border-error p-4 text-error font-mono text-sm">
            [ERROR]: {error}
          </div>
        )}

        {success && (
          <div className="bg-primary-container/20 border border-primary-container p-4 text-on-surface font-mono text-sm">
            [SUCCESS]: Transmission received. Yash will respond shortly.
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || success}
          className="mt-4 magnetic bg-primary-container text-on-primary-container px-8 py-4 uppercase font-heading text-xl hover:bg-primary transition-colors disabled:opacity-50 flex justify-center items-center gap-3"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></span> Transmitting...</>
          ) : (
            'Send Transmission'
          )}
        </button>
      </form>
    </div>
  );
}
