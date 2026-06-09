import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    
    // Basic XSS Sanitization
    const sanitize = (str: string) => 
      str?.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
      }[tag] || tag)) || '';

    const name = sanitize(rawData.name);
    const email = sanitize(rawData.email);
    const message = sanitize(rawData.message);

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase if keys exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{ sender_name: name, sender_email: email, subject: 'New Contact Request', message }]);
        
      if (dbError) {
        console.error('Supabase error:', dbError);
        // Continue even if DB fails, to try sending email
      }
    } else {
      console.warn('Supabase credentials missing. Skipping database insert.');
    }

    // Initialize Resend if key exists
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { error: emailError } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Use verified domain in prod
        to: process.env.CONTACT_EMAIL || 'yash@example.com',
        subject: `New Contact Request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });

      if (emailError) {
        console.error('Resend error:', emailError);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    } else {
      console.warn('Resend API key missing. Skipping email send.');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
