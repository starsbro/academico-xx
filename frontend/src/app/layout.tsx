import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';
import { UserButton } from '../components/Auth/UserButton';
import { DeploymentInfo } from '../components/DeploymentInfo/DeploymentInfo';

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
          <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
            <UserButton />
            <nav className="flex items-center gap-6 sm:gap-8 lg:gap-12">
              <Link
                href="/"
                className="px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/academic-chat"
                className="px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Academic Chat
              </Link>
            </nav>
            <div className="w-8"></div>
          </header>
          <ErrorBoundary>
            <div className="main-content-container">{children}</div>
          </ErrorBoundary>
          <DeploymentInfo />
        </body>
      </html>
    </AuthProvider>
  );
}
