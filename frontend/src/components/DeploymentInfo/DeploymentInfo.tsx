'use client';

// Deployment Info Component
// Shows build information in the UI for tracking deployments

import React, { useState } from 'react';
import { DeploymentInfo as DeploymentInfoType } from './DeploymentInfo.types';

export const DeploymentInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const deploymentInfo: DeploymentInfoType = {
    branch: process.env.NEXT_PUBLIC_BUILD_BRANCH,
    commit: process.env.NEXT_PUBLIC_BUILD_COMMIT,
    commitFull: process.env.NEXT_PUBLIC_BUILD_COMMIT_FULL,
    timestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP,
    user: process.env.NEXT_PUBLIC_BUILD_USER,
    env: process.env.NEXT_PUBLIC_ENV,
  };

  // Only show in development or if explicitly enabled
  const shouldShow = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_DEPLOYMENT_INFO === 'true';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 transition-colors"
        title="Show deployment information"
      >
        ℹ️ Build Info
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white rounded-lg p-4 shadow-lg border border-gray-700 min-w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Deployment Information</h3>
            <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Environment:</span>
              <span className={`font-mono ${deploymentInfo.env === 'production' ? 'text-red-400' : 'text-green-400'}`}>
                {deploymentInfo.env || 'unknown'}
              </span>
            </div>

            {deploymentInfo.branch && (
              <div className="flex justify-between">
                <span className="text-gray-400">Branch:</span>
                <span className="font-mono text-blue-400">{deploymentInfo.branch}</span>
              </div>
            )}

            {deploymentInfo.commit && (
              <div className="flex justify-between">
                <span className="text-gray-400">Commit:</span>
                <span className="font-mono text-yellow-400" title={deploymentInfo.commitFull}>
                  {deploymentInfo.commit}
                </span>
              </div>
            )}

            {deploymentInfo.timestamp && (
              <div className="flex justify-between">
                <span className="text-gray-400">Built:</span>
                <span className="font-mono text-gray-300">{new Date(deploymentInfo.timestamp).toLocaleString()}</span>
              </div>
            )}

            {deploymentInfo.user && (
              <div className="flex justify-between">
                <span className="text-gray-400">By:</span>
                <span className="font-mono text-gray-300">{deploymentInfo.user}</span>
              </div>
            )}
          </div>

          {deploymentInfo.commitFull && (
            <div className="mt-3 pt-2 border-t border-gray-700">
              <a
                href={`https://github.com/starsbro/academico-ai/commit/${deploymentInfo.commitFull}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                View commit on GitHub →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
