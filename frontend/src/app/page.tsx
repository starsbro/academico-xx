'use client';

import React from 'react';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { ThemeToggle } from './components/ThemeToggle';
import { Button } from './components/Button';
// import { FeatureCard, FeatureCardProps } from './components/FeatureCard';
// import {
//   ModernStackDetails,
//   StylingFreedomDetails,
//   DevToolsDetails,
//   ResponsiveDesignDetails,
// } from './components/FeatureCard/details';
import { Search } from 'lucide-react';
import { Input } from './components/ui/input';

// type FeatureData = Omit<FeatureCardProps, 'onClick' | 'isExpanded'>;

// const featureData: FeatureData[] = [
//   {
//     id: 'modern-stack',
//     icon: '🚀',
//     title: 'Modern Stack',
//     description: 'Next.js 15, React 19, TypeScript. Fast, efficient, and type-safe development.',
//     details: <ModernStackDetails />,
//   },
//   {
//     id: 'styling-freedom',
//     icon: '🎨',
//     title: 'Styling Freedom',
//     description: 'Styling agnostic! Choose Tailwind, CSS Modules, Emotion, or your favorite solution.',
//     details: <StylingFreedomDetails />,
//   },
//   {
//     id: 'dev-tools',
//     icon: '🛠️',
//     title: 'Dev Tools Ready',
//     description: 'ESLint, Prettier, Husky hooks, and Jest testing pre-configured for quality code.',
//     details: <DevToolsDetails />,
//   },
//   {
//     id: 'responsive-design',
//     icon: '📱',
//     title: 'Responsive Design',
//     description: 'Built with a responsive layout in mind. Looks great on all devices.',
//     details: <ResponsiveDesignDetails />,
//   },
// ];

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}

function HomePageContent() {
  // const openLink = (url: string) => window.open(url, '_blank');
  // const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // const handleCardClick = (cardId: string) => {
  //   setExpandedCardId((prevId) => (prevId === cardId ? null : cardId));
  // };

  // Split featureData into two columns
  // const column1Features = featureData.filter((_, index) => index % 2 === 0);
  // const column2Features = featureData.filter((_, index) => index % 2 === 1);

  return (
    <div className="flex flex-col flex-1 p-8 box-border">
      <div className="fixed top-5 right-5 z-[1000]">
        <ThemeToggle />
      </div>

      <main className="flex-grow">
        <section className="text-center py-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Spark Your Next Creation! ✨
          </h1>
          <div className="flex space-x-3 w-full gap-4">
            <Input
              type="text"
              name="search-content"
              placeholder="What are you thinking?"
              className="rounded-full flex-1 h-14 px-6 text-lg border-4 border-red-500  bg-white focus:border-gray-400 focus:ring-0"
            />
            <Button size="large" className="rounded-lg h-14 px-8  bg-gray-300 hover:bg-gray-400 text-gray-700">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          {/* <p className={styles.subtitle}>
            A Next.js & TypeScript template designed for rapid development and learning industry best practices.
          </p> */}
          {/* <div className={styles.ctaButtons}>
            <Button variant="primary" size="large" onClick={() => openLink('https://nextjs.org/docs')}>
              Explore Next.js Docs
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => openLink('https://github.com/BU-Spark/TEMPLATE-next-js-starter')}
            >
              View on GitHub
            </Button>
          </div> */}
        </section>

        {/* <section className={styles.featuresContainer}>
          <div className={styles.featureColumn}>
            {column1Features.map((feature) => (
              <FeatureCard
                key={feature.id}
                {...feature}
                isExpanded={expandedCardId === feature.id}
                onClick={handleCardClick}
              />
            ))}
          </div>
          <div className={styles.featureColumn}>
            {column2Features.map((feature) => (
              <FeatureCard
                key={feature.id}
                {...feature}
                isExpanded={expandedCardId === feature.id}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </section> */}
      </main>

      <footer className="text-center py-8 px-4 mt-auto border-t border-gray-200 dark:border-gray-700 text-sm opacity-70">
        <p>@Academico.ai 2025 all rights reserved. Happy research!</p>
      </footer>
    </div>
  );
}
