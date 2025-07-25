'use client';

import type { FeatureCardProps } from './FeatureCard.types';

export const FeatureCard = ({ id, icon, title, description, details, isExpanded, onClick }: FeatureCardProps) => {
  return (
    <div
      className={`
        bg-blue-100 dark:bg-purple-900/20 
        border border-blue-200 dark:border-purple-800/50 
        rounded-xl 
        p-8 
        text-center 
        shadow-lg 
        transition-all duration-300 ease-in-out
        cursor-pointer 
        overflow-hidden
        hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl
        ${isExpanded ? 'border-2 border-transparent bg-gradient-to-br from-blue-600 to-green-500 p-2' : ''}
      `}
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(id);
        }
      }}
      aria-expanded={isExpanded}
      aria-controls={`details-${id}`}
    >
      {/* Inner content wrapper for gradient border effect */}
      <div className={`${isExpanded ? 'bg-blue-100 dark:bg-purple-900/20 rounded-lg p-6' : ''}`}>
        <div className="text-5xl mb-4 text-blue-600 dark:text-purple-500">{icon}</div>
        <h2 className="text-2xl font-semibold mb-3 text-center text-gray-900 dark:text-white">{title}</h2>
        <p className="text-base opacity-80 leading-relaxed mb-4 text-gray-700 dark:text-gray-300">{description}</p>
        <div
          id={`details-${id}`}
          className={`
            text-left 
            border-t border-dashed border-blue-200 dark:border-purple-800/50
            transition-all duration-300 ease-out
            ${
              isExpanded
                ? 'max-h-96 opacity-100 pt-4 mt-4 translate-y-0 overflow-y-auto'
                : 'max-h-0 opacity-0 pt-0 mt-0 -translate-y-2 overflow-hidden'
            }
          `}
          aria-hidden={!isExpanded}
          data-testid="feature-details"
        >
          <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:opacity-90 [&>ul]:text-sm [&>li]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>a]:text-blue-600 [&>a]:dark:text-purple-400 [&>a]:no-underline [&>a:hover]:underline">
            {details}
          </div>
        </div>
      </div>
    </div>
  );
};
