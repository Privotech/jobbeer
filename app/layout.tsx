import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'GlobalHire — Smart Global Job-Finding Platform',
  description: 'Intelligent full-stack job matching platform connecting global candidates and employers with timezone-aware search, smart match scoring, and ATS pipeline.',
  openGraph: {
    title: 'GlobalHire — Smart Global Job-Finding Platform',
    description: 'Intelligent full-stack job matching platform connecting global candidates and employers with timezone-aware search, smart match scoring, and ATS pipeline.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalHire — Smart Global Job-Finding Platform',
    description: 'Intelligent full-stack job matching platform connecting global candidates and employers with timezone-aware search, smart match scoring, and ATS pipeline.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
