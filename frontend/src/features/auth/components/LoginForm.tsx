'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login, loading, error: authError } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const email = identifier.includes('@')
        ? identifier
        : `${identifier.replace(/[^0-9]/g, '')}@citizen.nyayasetu.gov.in`;

      await login({
        email: email,
        username: email,
        password: password,
      });
    } catch (err: any) {
      // Error handled in hook or shown here
    }
  };

  const displayError = localError || authError;

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-6 sm:p-8 relative shadow-sm border-l-4 border-l-primary-container">
        <div className="flex items-center justify-between pb-space-sm mb-space-lg border-b border-outline-variant">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[18px]">verified_user</span>
            <span className="font-code-md text-code-md text-on-surface-variant font-medium tracking-wide">
              PORTAL ACCESS // E-COURTS
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#EEF2F9] text-primary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            Official Desk
          </span>
        </div>

        <div className="mb-space-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
            Welcome Back
          </h1>
          <p className="font-body-md text-body-md text-outline">
            Log in to see your case documents and summaries.
          </p>
        </div>

        {displayError && (
          <div className="mb-space-md p-space-sm bg-[#FDF0F0] border border-[#F5BDBD] text-error font-body-sm text-body-sm rounded flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{displayError}</span>
          </div>
        )}

        <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between" htmlFor="identifier">
              <span>Phone Number or Email</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">Registered ID</span>
            </label>
            <div className="relative">
              <input
                className="w-full h-12 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors"
                id="identifier"
                name="identifier"
                placeholder="Enter registered phone or email"
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between" htmlFor="password">
              <span>Password</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">Secure Key</span>
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full h-12 pl-space-md pr-11 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                aria-label="Toggle password visibility"
                className="absolute right-3 text-outline hover:text-primary-container transition-colors p-1 flex items-center justify-center focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-1">
            <a className="font-label-sm text-label-sm text-primary-container hover:underline font-semibold transition-colors" href="#">
              Forgot your password?
            </a>
          </div>

          <button
            className="w-full h-12 mt-space-xs bg-primary-container hover:bg-[#294678] active:bg-[#132B50] text-on-primary font-label-lg text-label-lg font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            <span>{loading ? 'Verifying...' : 'Log In'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="mt-space-lg pt-space-md border-t border-outline-variant flex flex-col items-center gap-space-sm text-center">
          <p className="font-body-md text-body-md text-on-surface">
            New here?{' '}
            <Link className="font-title-md text-title-md text-primary-container hover:underline font-semibold ml-1" href="/auth/signup">
              Create an account
            </Link>
          </p>
          <div className="w-full mt-space-xs bg-surface-container-low border border-outline-variant p-3 rounded text-left flex items-start gap-2.5">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5 shrink-0">support_agent</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
              Need help logging in? Call our citizen court support desk at{' '}
              <span className="font-code-md text-code-md font-semibold text-primary-container whitespace-nowrap">
                1800-202-NYAYA
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-space-md flex items-center justify-center gap-space-sm text-outline font-body-sm text-body-sm">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          Encrypted Citizen Registry
        </span>
        <span>•</span>
        <span>National Judicial Data Grid Aligned</span>
      </div>
    </div>
  );
}
