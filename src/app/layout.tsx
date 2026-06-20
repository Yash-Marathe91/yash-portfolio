import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { CommandPalette } from "@/components/CommandPalette";
import AiAssistant from "@/components/AiAssistant";
import SudoTerminal from "@/components/SudoTerminal";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: 'Yash Marathe | AI Systems Engineer & Full Stack Developer',
  description: 'Portfolio of Yash Marathe. Building intelligent systems, scalable architectures, and next-generation robotics.',
  openGraph: {
    title: 'Yash Marathe | Portfolio',
    description: 'AI Systems Engineer & Full Stack Developer building intelligent systems, scalable architectures, and next-generation robotics.',
    url: 'https://yashmarathe.dev',
    siteName: 'Yash Marathe Portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop', // Placeholder OG Image
        width: 1200,
        height: 630,
        alt: 'Yash Marathe - AI Systems Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Marathe | AI Systems Engineer',
    description: 'Building intelligent systems, scalable architectures, and next-generation robotics.',
    images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop'], // Placeholder Twitter Image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary-container">
        <SmoothScroll>
          <Navbar />
          <CustomCursor />
          <CommandPalette />
          <AiAssistant />
          <SudoTerminal />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
