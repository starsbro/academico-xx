import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';
//import { UserButton } from '../components/Auth/UserButton';
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
          <header className="flex justify-center items-center px-8 sm:px-12 lg:px-16 py-6 min-h-20 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
            {/* <UserButton /> */}
            <nav className="flex items-center gap-8 sm:gap-12 lg:gap-16">
              <Link
                href="/"
                className="px-12 py-4 text-lg sm:text-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="px-12 py-4 text-lg sm:text-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/academic-chat"
                className="px-12 py-4 text-lg sm:text-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
              >
                Academic Chat
              </Link>
            </nav>
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
