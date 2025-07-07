import { auth } from '../lib/firebase';

export async function getIdToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
}
