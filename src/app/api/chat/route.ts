import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Initialize Supabase Client
  const supabase = await createClient();

  // Fetch dynamic context from CMS
  const { data: profile } = await supabase.from('profile_settings').select('*').single();
  const { data: projects } = await supabase.from('projects').select('title, short_description, status').eq('status', 'published');
  const { data: skills } = await supabase.from('skills').select('name, proficiency_level');
  const { data: achievements } = await supabase.from('achievements').select('title, issuer, description');

  const projectNames = projects?.map(p => `${p.title}: ${p.short_description}`).join(' | ') || 'None listed.';
  const skillNames = skills?.map(s => `${s.name}`).join(', ') || 'None listed.';
  const achievementNames = achievements?.map(a => `${a.title} by ${a.issuer}`).join(' | ') || 'None listed.';

  const systemPrompt = `You are the AI Assistant for ${profile?.full_name || 'Yash Marathe'}, an ${profile?.hero_title || 'AI Systems Engineer'}.
You answer questions from recruiters and developers about Yash based strictly on the following real-time database context.

Knowledge Base:
- Bio: ${profile?.bio || 'Building intelligent systems.'}
- Projects: ${projectNames}
- Skills: ${skillNames}
- Achievements/Milestones: ${achievementNames}

Instructions:
- Tone: Professional, technical, concise, like a high-tech command-line terminal output.
- Always be polite and helpful. 
- If a user asks a question not covered by the Knowledge Base, say: "Data not found in current knowledge base. Please initialize contact via the form."`;

  // Sanitize messages to ensure 'content' is a string, which is required by streamText
  const formattedMessages = messages.map((m: any) => {
    if (m.role === 'assistant' && m.parts) {
      return {
        role: m.role,
        content: m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(''),
      };
    }
    return {
      role: m.role,
      content: m.content || '',
    };
  });

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: formattedMessages,
  });

  return result.toUIMessageStreamResponse();
}
