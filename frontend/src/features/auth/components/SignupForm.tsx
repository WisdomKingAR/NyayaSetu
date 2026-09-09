'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export function SignupForm() {
  const router = useRouter();
  const { register, loading, error: authError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [contactIdentifier, setContactIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const email = contactIdentifier.includes('@')
        ? contactIdentifier
        : `${contactIdentifier.replace(/[^0-9]/g, '')}@citizen.nyayasetu.gov.in`;

      await register({
        name: fullName,
        fullName: fullName,
        email: email,
        password: password,
      });

      router.push('/auth/select-role');
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
            <span className="material-symbols-outlined text-primary-container text-[18px]">how_to_reg</span>
            <span className="font-code-md text-code-md text-on-surface-variant font-medium tracking-wide">
              REGISTRATION // CITIZEN PORTAL
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#EEF2F9] text-primary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            Step 1 of 2
          </span>
        </div>

        <div className="mb-space-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
            Create an Account
          </h1>
          <p className="font-body-md text-body-md text-outline">
            Access, digitize, and understand your court orders and case files.
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
            <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between" htmlFor="fullName">
              <span>Full Legal Name</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">As on ID</span>
            </label>
            <input
              className="w-full h-12 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors"
              id="fullName"
              name="fullName"
              placeholder="e.g. Ramesh Shankar Patil"
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between" htmlFor="contact">
              <span>Mobile Number or Email</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">For OTP & Updates</span>
            </label>
            <input
              className="w-full h-12 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors"
              id="contact"
              name="contact"
              placeholder="e.g. 9876543210 or ramesh@example.com"
              required
              type="text"
              value={contactIdentifier}
              onChange={(e) => setContactIdentifier(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between" htmlFor="password">
              <span>Create Password</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">Min 8 characters</span>
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full h-12 pl-space-md pr-11 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors"
                id="password"
                name="password"
                placeholder="Choose a strong password"
                required
                minLength={8}
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

          <button
            className="w-full h-12 mt-space-xs bg-primary-container hover:bg-[#294678] active:bg-[#132B50] text-on-primary font-label-lg text-label-lg font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Select Role'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="mt-space-lg pt-space-md border-t border-outline-variant flex flex-col items-center gap-space-sm text-center">
          <p className="font-body-md text-body-md text-on-surface">
            Already registered?{' '}
            <Link className="font-title-md text-title-md text-primary-container hover:underline font-semibold ml-1" href="/auth/login">
              Log in to your account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-space-md flex items-center justify-center gap-space-sm text-outline font-body-sm text-body-sm">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">security</span>
          Data Protection compliant under DPDPA 2023
        </span>
      </div>
    </div>
  );
}
