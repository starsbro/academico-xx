import type { Metadata } from 'next';
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from './components/ErrorBoundary';

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
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable}`}>
        <body>
          <header className="flex justify-start items-center p-4 gap-4 h-16">
            {/* <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut> */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <ErrorBoundary>
            <div className="main-content-container">{children}</div>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
