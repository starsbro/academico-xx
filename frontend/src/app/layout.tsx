import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';
import { UserButton } from '../components/Auth/UserButton';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'academico-ai',
  description: 'Spark! Next.js Template: Academico-ai',
  keywords: ['Next.js', 'React', 'TypeScript', 'Template'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className={`${outfit.variable}`}>
        <body>
          <header className="flex justify-between items-center p-4 gap-4 h-16">
            <UserButton />
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex justify-center items-center" style={{ fontFamily: 'cursive' }}>
                Home
              </Link>
              <Link href="/dashboard" className="mr-4" style={{ fontFamily: 'cursive' }}>
                Dashboard
              </Link>
              <Link href="/academic-chat" className="mr-4" style={{ fontFamily: 'cursive' }}>
                Academic-chat
              </Link>
            </div>
            <div className="w-8">{/* This div is just for spacing */}</div>
          </header>
          <ErrorBoundary>
            <div className="main-content-container">{children}</div>
          </ErrorBoundary>
        </body>
      </html>
    </AuthProvider>
  );
}
