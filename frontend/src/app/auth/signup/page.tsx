'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/auth.store';

export default function SignUpPage() {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [contactIdentifier, setContactIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = contactIdentifier.includes('@')
        ? contactIdentifier
        : `${contactIdentifier.replace(/[^0-9]/g, '')}@citizen.nyayasetu.gov.in`;

      const response = await signUp({
        name: fullName,
        email: email,
        password: password,
      });

      setSession({
        user: response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });

      router.push('/auth/select-role');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md py-space-xl">
      <div className="w-full max-w-[460px] mx-auto">
        <div className="mb-space-lg flex items-center justify-between text-on-surface-variant font-code-md text-code-md">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-title-md">assured_workload</span>
            <span className="font-semibold tracking-wider text-primary-container">PORTAL REGISTRATION</span>
          </div>
          <span className="text-label-sm font-label-sm uppercase bg-surface-container-high text-on-surface-variant px-space-xs py-space-xxs rounded-[2px]">
            FORM REF: NS-2025
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-primary-container rounded-[6px] p-space-xl relative shadow-sm">
          <div className="mb-space-lg">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight leading-snug">
              Create Your Account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              It only takes a minute, and you won&apos;t need to fill in any legal details.
            </p>
          </div>

          <div className="w-full h-px bg-outline-variant mb-space-lg"></div>

          {error && (
            <div className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-[4px] font-body-sm text-body-sm flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-space-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-lg text-label-lg font-semibold text-on-surface" htmlFor="fullName">
                Your Name
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-12 px-space-md bg-surface-container-lowest border border-outline-variant rounded-[4px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Meenakshi Deshpande"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-lg text-label-lg font-semibold text-on-surface" htmlFor="contactIdentifier">
                Phone Number or Email
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-12 px-space-md bg-surface-container-lowest border border-outline-variant rounded-[4px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  id="contactIdentifier"
                  name="contactIdentifier"
                  placeholder="e.g. 98200 12345 or name@example.com"
                  required
                  type="text"
                  value={contactIdentifier}
                  onChange={(e) => setContactIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg font-semibold text-on-surface" htmlFor="accountPassword">
                  Create a Password
                </label>
                <span className="font-label-sm text-label-sm text-outline">Minimum 8 characters</span>
              </div>
              <div className="relative flex items-center">
                <input
                  className="w-full h-12 pl-space-md pr-12 bg-surface-container-lowest border border-outline-variant rounded-[4px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  id="accountPassword"
                  minLength={8}
                  name="accountPassword"
                  placeholder="At least 8 characters"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-outline hover:text-on-surface transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-title-md">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-space-xs">
              <div className="bg-surface-container-low p-space-sm rounded-[4px] border border-outline-variant">
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  By continuing, you agree to the{' '}
                  <span className="underline font-semibold text-primary-container">
                    Judicial Accessibility Terms
                  </span>{' '}
                  and verified data confidentiality standards.
                </p>
              </div>
            </div>

            <div className="pt-space-xs">
              <button
                className="w-full h-12 bg-primary-container text-on-primary font-label-lg text-label-lg uppercase tracking-wider font-semibold rounded-[4px] flex items-center justify-center gap-space-xs hover:bg-[#294678] active:bg-[#132B50] transition-colors focus:outline-none disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <span className="material-symbols-outlined text-title-md">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-space-lg text-center pt-space-md border-t border-outline-variant">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{' '}
              <Link className="font-semibold text-primary-container hover:underline ml-space-xxs inline-flex items-center" href="/auth/login">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-space-md flex items-center justify-center gap-space-xs text-center px-space-sm py-space-xs bg-surface-container-low border border-outline-variant rounded-[4px]">
          <span className="material-symbols-outlined text-secondary text-title-md shrink-0">verified_user</span>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Secured for citizen &amp; advocate access across District &amp; High Courts
          </p>
        </div>

        <div className="mt-space-lg flex justify-between items-center text-outline font-code-md text-body-sm px-space-xs">
          <span>DIGITAL COURTS MISSION</span>
          <span>SEC-256 COMPLIANT</span>
        </div>
      </div>
    </main>
  );
}
