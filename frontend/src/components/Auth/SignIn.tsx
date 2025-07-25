'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Sparkles, GraduationCap } from 'lucide-react';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative w-full max-w-xl mx-2 animate-fade-in">
        {/* Main card */}
        <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 px-6 sm:px-10 md:px-16 lg:px-24 py-20 sm:py-28 transition-transform duration-300 hover:scale-[1.01] hover:shadow-3xl space-y-12">
          {/* Header */}
          <div className="text-center mb-20">
            {/* Increased bottom margin */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-xl mb-7 animate-fade-in-down">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            {/* Slightly increased bottom margin */}
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 animate-fade-in-down">
              Welcome back!
            </h1>
            {/* Added bottom margin */}
            <p className="text-gray-600 dark:text-gray-400 text-lg animate-fade-in-down mb-4">
              Sign in to continue your academic journey
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-10 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl animate-fade-in">
              <p className="text-red-700 dark:text-red-400 text-base font-medium">{error}</p>
            </div>
          )}

          {/* Sign in form */}
          <div className="space-y-8 px-2 sm:px-6 md:px-8 flex flex-col">
            {/* Increased vertical spacing */}
            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
              {/* Email field */}
              <div className="space-y-4 flex flex-col gap-4 mb-6">
                <label htmlFor="email" className="text-lg font-medium text-gray-700 dark:text-gray-300 block mb-3 pl-2">
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
                    className="block w-full pr-6 pl-10 py-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xl shadow-sm focus:shadow-lg"
                    placeholder="Enter your email"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-4 flex flex-col gap-4 mb-12">
                <label
                  htmlFor="password"
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 block mb-3 pl-2"
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-16 pl-10 py-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xl shadow-sm focus:shadow-lg"
                    placeholder="Enter your password"
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

              {/* Forgot password */}
              <div className="flex justify-end mb-6">
                {/* Increased bottom margin */}
                <Link
                  href="/reset-password"
                  className="text-lg text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Sign in button */}
              <div className="flex justify-center pt-4 mt-4 mb-8">
                {/* Increased bottom margin */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-300 font-bold py-6 px-12 rounded-3xl shadow-xl hover:shadow-2xl disabled:cursor-not-allowed transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1 disabled:transform-none min-w-[240px] text-xl border-2 border-blue-700/30 hover:border-blue-600/50 backdrop-blur-sm"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <span
                    className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity text-white font-bold tracking-wide relative z-10`}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-14">
              {/* Increased vertical margin */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="px-4 bg-white/90 dark:bg-gray-800/95 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google sign in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/90 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 font-semibold hover:bg-white dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-[1.01] text-xl backdrop-blur-sm shadow-sm"
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

          {/* Sign up link */}
          <div className="mt-20 text-center">
            {/* Increased top margin */}
            <p className="text-lg text-gray-600 dark:text-gray-400 py-4">
              Don&apos;t have an account?{' '}
              <Link
                href="/sign-up"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-20 text-center">
          {/* Increased top margin */}
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

export default SignIn;
