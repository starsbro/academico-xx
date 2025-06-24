// components/BackendData.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

//1. Define an interface for the shape of my backend data.
//   Customize this to match the actual JSON response from my API.
interface ProtectedData {
  // Example properties
  message: string;
  user: {
    id: string;
    firstName: string;
  };
  accessLevel: string;
  //Use an index signature if the data can have various dynamic keys
  //[key: string]: any;
}

export default function BackendData() {
  const { user } = useAuth();

  // Use the new interface in my useState hook instead of <any>.
  const [backendData, setBackendData] = useState<ProtectedData | null>(null);
  //const [backendData, setBackendData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get Firebase ID token
        const token = await user.getIdToken();

        if (!token) {
          throw new Error('No authentication token found.');
        }

        // Example fetch call (replace URL with your backend endpoint)
        const response = await fetch('/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch protected data.');
        }

        const data = await response.json();
        setBackendData(data);
        // Catch the error as 'unknown' (the default) and perform a type check.
        // } catch (err: any) {
        //   setError(err.message || 'An error occurred.');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, [user]);

  if (loading) return <div>Loading backend data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Sign in to see protected backend data.</div>;

  return (
    <div>
      <h2>Backend Data from Node.js Backend</h2>
      <pre>{JSON.stringify(backendData, null, 2)}</pre>
    </div>
  );
}
