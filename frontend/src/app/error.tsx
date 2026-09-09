'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md">
      <div className="flex flex-col w-full items-center justify-center py-space-xl">
        <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg p-space-xl sm:p-space-2xl text-center relative overflow-hidden shadow-sm">
          <div className="flex justify-center mb-space-lg">
            <div className="w-16 h-16 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[36px]">sync_problem</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-space-sm">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>Notice of Interruption</span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-primary-container mb-space-sm tracking-tight">
            Something Went Wrong
          </h1>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-space-xl leading-relaxed">
            We ran into a problem loading this information. It&apos;s not something you did — please try refreshing or checking back in a moment.
          </p>

          <div className="bg-surface-container-low rounded-lg p-space-md mb-space-xl text-left flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">verified_user</span>
            <div className="flex-1">
              <p className="font-label-lg text-label-lg text-on-surface font-semibold">Your Records Are Safe</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Your uploaded documents and case summaries are safely stored in the national archive ledger.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm mb-space-xl">
            <button
              onClick={() => reset()}
              type="button"
              className="w-full h-12 inline-flex items-center justify-center gap-space-sm bg-primary-container text-on-primary font-label-lg rounded-lg hover:bg-surface-tint active:bg-primary transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Try Again</span>
            </button>
            <Link
              href="/dashboard"
              className="w-full h-12 inline-flex items-center justify-center gap-space-sm bg-surface-container-lowest text-primary-container border border-primary-container font-label-lg rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Go Back to Dashboard</span>
            </Link>
          </div>

          <div className="pt-space-md border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-space-xs text-outline font-code-md text-body-sm">
            <span>REF: ERR-CIVIL-PORTAL-TIMEOUT</span>
            <span className="text-on-surface-variant font-body-sm">Helpline: <strong className="font-semibold text-on-surface">1800-202-NYAYA</strong></span>
          </div>
        </div>
      </div>
    </main>
  );
}
