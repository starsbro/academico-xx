import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
//import { UserButton } from '../components/Auth/UserButton';

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
        <body suppressHydrationWarning={true}>
          <Toaster />
          <ErrorBoundary>
            <div className="main-content-container">{children}</div>
          </ErrorBoundary>
        </body>
      </html>
    </AuthProvider>
  );
}
