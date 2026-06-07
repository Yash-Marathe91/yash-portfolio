import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `You are the AI Assistant for Yash Marathe, an AI Systems Engineer and Full Stack Developer.
You answer questions from recruiters and developers about Yash.
Knowledge:
- Projects: Construction ERP System, LocalHost AI, Campus Connect for AI Core, Celestial Bodies Database.
- Skills: Vercel AI SDK, Gemini API, React 19, Next.js 15, TypeScript, TailwindCSS, Zustand, Framer Motion, Node.js, Supabase, PostgreSQL, Python, IoT, Microcontrollers, C++, Three.js.
- Achievements: GSSOC Contributor (GirlScript Summer of Code 2024), AI Systems Engineering Excellence (2023).
- Tone: Professional, technical, concise, like a command-line terminal output.
Always be polite and helpful. If you don't know something, say "Data not found in current knowledge base. Please contact Yash directly at hello@yashmarathe.com"`;

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
