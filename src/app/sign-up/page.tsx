'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function getPostAuthPath() {
  const requestedPath = new URLSearchParams(window.location.search).get('next');
  return requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/';
}
export default function SignUpPage() {
  const router = useRouter();
  const { signup, loginWithSocial } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await signup(fullName, email, password);
      router.replace(getPostAuthPath());
    } catch {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    await loginWithSocial(provider);
    router.replace(getPostAuthPath());
  };

  return (
    <div className="auth-shell min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Logo */}
      <div className="flex justify-center pt-4">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/images/gcc-logo-full.jpg"
            alt="The GCC Foundation"
            width={220}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Card */}
      <div className="auth-glass-card auth-enter w-full max-w-md mx-auto my-6 rounded-3xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight">
            Create a local preview account
          </h1><p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-950">Accounts are stored only in this browser. Authentication is not connected: passwords are not checked or sent to a server. Do not enter a password you use elsewhere.</p>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-[#02A95C] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Social Sign-In Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocial('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google sign-up unavailable in this preview
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
            or with email
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                First name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#02A95C] focus:ring-2 focus:ring-[#02A95C]/20 outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#02A95C] focus:ring-2 focus:ring-[#02A95C]/20 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#02A95C] focus:ring-2 focus:ring-[#02A95C]/20 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:border-[#02A95C] focus:ring-2 focus:ring-[#02A95C]/20 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1">
            <div className="flex items-start">
              <input
                id="newsletter"
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#02A95C] focus:ring-[#02A95C] border-gray-300"
              />
              <label htmlFor="newsletter" className="ml-2 text-xs text-gray-600 leading-normal">
                Send me stories of hope and notifications on fundraising milestones in East Africa.
              </label>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#02A95C] focus:ring-[#02A95C] border-gray-300"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600 leading-normal">
                I agree to the{' '}
                <Link href="/transparency" className="text-[#02A95C] hover:underline">
                  Terms of Service
                </Link>{' '}
                and understand the{' '}
                <Link href="/transparency" className="text-[#02A95C] hover:underline">
                  Institutional Escrow Guarantee
                </Link>
                .
              </label>
            </div>
          </div>

          {/* Primary GoFundMe Green Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-[#02A95C] hover:bg-[#008748] text-white font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 pt-3"
          >
            {isLoading ? 'Creating account...' : 'Create my account'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Trust Guarantee Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <Lock className="w-3.5 h-3.5 text-[#02A95C]" />
          <span>256-bit Bank-Grade Encryption & Escrow Protection</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 py-4 space-y-1">
        <p>Â© 2026 GCC Foundation. Regulated Crowdfunding Platform for East Africa.</p>
      </div>
    </div>
  );
}




