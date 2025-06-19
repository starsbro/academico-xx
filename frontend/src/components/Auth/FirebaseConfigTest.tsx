'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';

export default function FirebaseConfigTest() {
  const [configStatus, setConfigStatus] = useState<string>('Testing...');

  useEffect(() => {
    const testConfig = async () => {
      try {
        // Check if Firebase is properly initialized
        console.log('Firebase Auth instance:', auth);
        console.log('Firebase config:', {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing',
        });

        // Test if we can access Firebase Auth
        await auth.authStateReady;
        setConfigStatus('✅ Firebase Authentication is properly configured!');
      } catch (error) {
        console.error('Firebase config error:', error);
        setConfigStatus(`❌ Firebase Configuration Error: ${error}`);
      }
    };

    testConfig();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Firebase Configuration Test</h3>
      <p className={configStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>{configStatus}</p>

      <div className="mt-4 text-sm">
        <h4 className="font-semibold">Environment Variables:</h4>
        <ul className="mt-2 space-y-1">
          <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing'}</li>
          <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}</li>
          <li>Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ Missing'}</li>
          <li>Messaging Sender ID: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}</li>
          <li>App ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
    </div>
  );
}
