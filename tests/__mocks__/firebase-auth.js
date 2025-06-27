// Mock Firebase Auth for testing
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
};

// Individual named exports for firebase/auth
export const User = mockUser;
export const signInWithEmailAndPassword = jest.fn().mockResolvedValue({ user: mockUser });
export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({ user: mockUser });
export const signOut = jest.fn().mockResolvedValue(void 0);
export const onAuthStateChanged = jest.fn((auth, callback) => {
  if (callback) callback(mockUser);
  return jest.fn(); // unsubscribe function
});
export const updateProfile = jest.fn().mockResolvedValue(void 0);
export const sendPasswordResetEmail = jest.fn().mockResolvedValue(void 0);
export const signInWithPopup = jest.fn().mockResolvedValue({ user: mockUser });
export const GoogleAuthProvider = jest.fn();

// Mock auth object
export const getAuth = jest.fn(() => ({
  currentUser: mockUser,
  onAuthStateChanged: onAuthStateChanged,
}));

// Default export for compatibility
export default {
  User: mockUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
};
