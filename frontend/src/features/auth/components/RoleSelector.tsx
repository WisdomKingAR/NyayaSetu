'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

export function RoleSelector() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'citizen');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (user) {
      setUser({ ...user, role: selectedRole });
    }
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-[800px] flex flex-col items-center">
      {/* Institutional Docket Header Stamp */}
      <div className="flex items-center gap-space-xs mb-space-sm">
        <span className="font-code-md text-code-md uppercase tracking-wider text-outline">
          PORTAL ONBOARDING // DISPOSITION 04
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="font-headline-lg text-headline-lg text-primary text-center tracking-tight">
        How will you be using NyayaSetu?
      </h1>
      <p className="font-body-md text-body-md text-outline text-center mt-space-xs max-w-xl">
        This just helps us show you the right screen — you can change this later at any time.
      </p>

      {/* Two-Card Role Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg w-full mt-space-xl text-left">
        {/* Card 1: Citizen Litigant */}
        <div
          id="card-citizen"
          role="button"
          tabIndex={0}
          onClick={() => handleSelectRole('citizen')}
          className={`role-card relative bg-surface-container-lowest border-l-4 border-l-primary-container p-space-lg flex flex-col justify-between cursor-pointer transition-all duration-150 rounded-[4px] ${
            selectedRole === 'citizen'
              ? 'border-t-2 border-r-2 border-b-2 border-primary-container bg-surface-container-low shadow-sm'
              : 'border-t border-r border-b border-outline-variant hover:bg-surface-container-low'
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-space-md">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-[2px] text-primary-container">
                <span className="material-symbols-outlined text-[28px]">person_outline</span>
              </div>
              <div
                className={`w-5 h-5 rounded-[2px] border flex items-center justify-center ${
                  selectedRole === 'citizen'
                    ? 'bg-primary-container border-primary-container text-on-primary'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                {selectedRole === 'citizen' && (
                  <span className="material-symbols-outlined text-[16px] text-white">check</span>
                )}
              </div>
            </div>

            <div className="inline-block mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-semibold px-2 py-0.5 bg-surface-container text-primary-container border border-outline-variant rounded-[2px]">
                Recommended for citizens, litigants &amp; families
              </span>
            </div>

            <h2 className="font-title-lg text-title-lg text-on-surface font-bold tracking-tight mb-space-xs">
              I&apos;m following my own case
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              See simple summaries, your next hearing date, and ask questions about your documents in plain English or Marathi.
            </p>

            <div className="mt-space-md pt-space-md border-t border-outline-variant space-y-space-xs">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-primary-container text-[18px]">gavel</span>
                <span>Next hearing alerts &amp; causelist tracker</span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-primary-container text-[18px]">translate</span>
                <span>Regional Marathi explanations on demand</span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-primary-container text-[18px]">chat_bubble_outline</span>
                <span>Ask questions about orders in plain words</span>
              </div>
            </div>
          </div>

          <div className="mt-space-lg pt-space-sm">
            <button
              type="button"
              className={`w-full py-2 px-3 text-label-md font-label-md font-semibold rounded-[2px] transition-colors border ${
                selectedRole === 'citizen'
                  ? 'bg-primary-container text-on-primary border-primary-container'
                  : 'bg-surface-container border-outline-variant text-on-surface-variant'
              }`}
            >
              {selectedRole === 'citizen' ? 'Selected' : 'Choose Citizen Mode'}
            </button>
          </div>
        </div>

        {/* Card 2: Legal Practitioner / Advocate */}
        <div
          id="card-advocate"
          role="button"
          tabIndex={0}
          onClick={() => handleSelectRole('advocate')}
          className={`role-card relative bg-surface-container-lowest border-l-4 border-l-secondary p-space-lg flex flex-col justify-between cursor-pointer transition-all duration-150 rounded-[4px] ${
            selectedRole === 'advocate'
              ? 'border-t-2 border-r-2 border-b-2 border-secondary bg-surface-container-low shadow-sm'
              : 'border-t border-r border-b border-outline-variant hover:bg-surface-container-low'
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-space-md">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-[2px] text-secondary">
                <span className="material-symbols-outlined text-[28px]">folder_copy</span>
              </div>
              <div
                className={`w-5 h-5 rounded-[2px] border flex items-center justify-center ${
                  selectedRole === 'advocate'
                    ? 'bg-secondary border-secondary text-on-secondary'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                {selectedRole === 'advocate' && (
                  <span className="material-symbols-outlined text-[16px] text-white">check</span>
                )}
              </div>
            </div>

            <div className="inline-block mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-semibold px-2 py-0.5 bg-surface-container text-secondary border border-outline-variant rounded-[2px]">
                For Advocates, Law Clerks &amp; Legal Aid
              </span>
            </div>

            <h2 className="font-title-lg text-title-lg text-on-surface font-bold tracking-tight mb-space-xs">
              I&apos;m managing cases for clients
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Multi-case document vault, bulk OCR extraction, bilingual legal analysis, and client-ready Marathi order summaries.
            </p>

            <div className="mt-space-md pt-space-md border-t border-outline-variant space-y-space-xs">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">quick_reference_all</span>
                <span>Structured legal issue &amp; fact extraction</span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">share</span>
                <span>Export client-facing regional explanations</span>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">manage_search</span>
                <span>Cross-docket search and case notes</span>
              </div>
            </div>
          </div>

          <div className="mt-space-lg pt-space-sm">
            <button
              type="button"
              className={`w-full py-2 px-3 text-label-md font-label-md font-semibold rounded-[2px] transition-colors border ${
                selectedRole === 'advocate'
                  ? 'bg-secondary text-on-secondary border-secondary'
                  : 'bg-surface-container border-outline-variant text-on-surface-variant'
              }`}
            >
              {selectedRole === 'advocate' ? 'Selected' : 'Choose Advocate Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-space-2xl flex flex-col sm:flex-row items-center justify-between gap-space-md w-full pt-space-lg border-t border-outline-variant">
        <span className="font-body-sm text-body-sm text-outline text-center sm:text-left">
          You can switch views anytime from your dashboard sidebar.
        </span>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-space-xl py-3 bg-primary-container hover:bg-[#294678] active:bg-[#132B50] text-on-primary font-label-lg text-label-lg font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <span>Enter Dashboard</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
