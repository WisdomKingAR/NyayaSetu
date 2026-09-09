import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { NavBar } from '@/components/layout/NavBar';

export const metadata: Metadata = {
  title: 'NyayaSetu — Understand Your Court Case',
  description:
    'Upload a court order or judgment and get a plain-language summary in English or Marathi — in under a minute. NyayaSetu: Legal Document Intelligence for Citizens and Advocates.',
  keywords: [
    'court document',
    'legal summary',
    'Marathi',
    'OCR',
    'Indian courts',
    'NyayaSetu',
    'न्यायसेतु',
  ],
  openGraph: {
    title: 'NyayaSetu — न्यायसेतु',
    description: 'Understand Your Court Papers in Your Own Language',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Material Symbols Outlined — loaded via CSS @import in globals.css */}
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
        <Providers>
          <NavBar />
          <div className="flex-1 flex flex-col pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
