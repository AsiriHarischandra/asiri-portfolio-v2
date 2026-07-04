import { Syne, DM_Sans, DM_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata = {
  title: 'Asiri Harischandra — Software Developer',
  description:
    'Portfolio of Asiri Harischandra, CS undergraduate at the University of Moratuwa. Full-stack web development and AI/ML.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Asiri Harischandra — Software Developer',
    description: 'Full-stack developer & CS student at UoM. Building fast web apps and exploring AI.',
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} bg-bg text-white antialiased`}
      >
        <ParticleCanvas />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
