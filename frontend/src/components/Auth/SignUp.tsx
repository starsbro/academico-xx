'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, UserPlus } from 'lucide-react';
import styles from './SignUp.module.css';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, displayName);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-3000"></div>
      </div>

      <div className="relative w-xl max-w-xl mx-2">
        {/* Main card */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 px-8 sm:px-12 lg:px-16 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Join Academico AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Create your account and start your academic journey
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
              <p className="text-red-700 dark:text-red-400 text-base font-medium">{error}</p>
            </div>
          )}

          {/* Sign up form */}
          <div className={`space-y-8 px-4 sm:px-8 ${styles.formContainer}`} style={{ gap: '0.5rem' }}>
            <form onSubmit={handleSubmit} className={`space-y-8 ${styles.formContent}`} style={{ gap: '0.5rem' }}>
              {/* Display Name field */}
              <div className={`space-y-3 ${styles.fieldGroup}`} style={{ marginBottom: '0.5rem' }}>
                <label
                  htmlFor="displayName"
                  className={`text-lg font-medium text-gray-700 dark:text-gray-300 block ${styles.fieldLabel}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Display Name (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block w-full pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xl"
                    placeholder="Enter your display name"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>

              {/* Email field */}
              <div className={`space-y-3 ${styles.fieldGroup}`} style={{ marginBottom: '0.5rem' }}>
                <label
                  htmlFor="email"
                  className={`text-lg font-medium text-gray-700 dark:text-gray-300 block ${styles.fieldLabel}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xl"
                    placeholder="Enter your email"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className={`space-y-3 ${styles.fieldGroup}`} style={{ marginBottom: '0.5rem' }}>
                <label
                  htmlFor="password"
                  className={`text-lg font-medium text-gray-700 dark:text-gray-300 block ${styles.fieldLabel}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-16 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xl"
                    placeholder="Create a password"
                    style={{ paddingLeft: '2rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-xl transition-colors z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password field */}
              <div className={`space-y-3 ${styles.fieldGroup}`} style={{ marginBottom: '2rem' }}>
                <label
                  htmlFor="confirmPassword"
                  className={`text-lg font-medium text-gray-700 dark:text-gray-300 block ${styles.fieldLabel}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pr-16 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xl"
                    placeholder="Confirm your password"
                    style={{ paddingLeft: '2rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-xl transition-colors z-10"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Create account button */}
              <div
                className={`flex justify-center pt-8 ${styles.buttonContainer}`}
                style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white hover:from-green-700 hover:via-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-300 font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl disabled:cursor-not-allowed transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1 disabled:transform-none min-w-[240px] text-xl border-2 border-green-700/30 hover:border-green-600/50 backdrop-blur-sm"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <span
                    className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity text-white font-bold tracking-wide relative z-10`}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className={`relative my-10 ${styles.dividerContainer}`} style={{ margin: '1rem 0' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="px-4 bg-white/80 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google sign in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 font-semibold hover:bg-white dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-[1.01] text-xl backdrop-blur-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign in link */}
          <div className={`mt-5 text-center ${styles.signInContainer}`}>
            <p className="text-lg text-gray-600 dark:text-gray-400" style={{ padding: '1rem 0' }}>
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className={`mt-10 text-center ${styles.footerContainer}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by Academico AI
            <Sparkles className="w-3 h-3" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
