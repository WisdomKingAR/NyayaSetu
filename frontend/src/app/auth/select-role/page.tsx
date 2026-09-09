'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/lib/types';

export default function SelectRolePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (user) {
      setUser({ ...user, role: selectedRole });
    }
    if (selectedRole === 'advocate') {
      router.push('/advocate/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md py-space-2xl">
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
                onClick={handleContinue}
                className="w-full h-11 px-space-md flex items-center justify-center gap-space-xs font-label-lg text-label-lg font-semibold text-primary-container bg-surface-container-lowest border border-primary-container rounded-[4px] transition-colors hover:bg-surface-container-high"
              >
                <span>Continue as Citizen Litigant</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Legal Advocate / Staff */}
          <div
            id="card-advocate"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('advocate')}
            className={`role-card relative bg-surface-container-lowest border-l-4 border-l-primary-container p-space-lg flex flex-col justify-between cursor-pointer transition-all duration-150 rounded-[4px] ${
              selectedRole === 'advocate'
                ? 'border-t-2 border-r-2 border-b-2 border-primary-container bg-surface-container-low shadow-sm'
                : 'border-t border-r border-b border-outline-variant hover:bg-surface-container-low'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-space-md">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-[2px] text-primary-container">
                  <span className="material-symbols-outlined text-[28px]">folder_copy</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-[2px] border flex items-center justify-center ${
                    selectedRole === 'advocate'
                      ? 'bg-primary-container border-primary-container text-on-primary'
                      : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  {selectedRole === 'advocate' && (
                    <span className="material-symbols-outlined text-[16px] text-white">check</span>
                  )}
                </div>
              </div>

              <div className="inline-block mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase font-semibold px-2 py-0.5 bg-surface-container text-primary-container border border-outline-variant rounded-[2px]">
                  Designed for solo advocates, clerks &amp; legal aid clinics
                </span>
              </div>

              <h2 className="font-title-lg text-title-lg text-on-surface font-bold tracking-tight mb-space-xs">
                I&apos;m a lawyer or legal staff
              </h2>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Manage multiple case files, search across documents, compare orders, and pull structured case details quickly.
              </p>

              <div className="mt-space-md pt-space-md border-t border-outline-variant space-y-space-xs">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">inventory_2</span>
                  <span>CNR bulk repository &amp; indexed search</span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">difference</span>
                  <span>Order revision &amp; interim injunction comparison</span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">table_chart</span>
                  <span>Structured export of hearing history</span>
                </div>
              </div>
            </div>

            <div className="mt-space-lg pt-space-sm">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-11 px-space-md flex items-center justify-center gap-space-xs font-label-lg text-label-lg font-semibold text-primary-container bg-surface-container-lowest border border-primary-container rounded-[4px] transition-colors hover:bg-surface-container-high"
              >
                <span>Continue as Advocate</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Helper Note & Institutional Verification Marker */}
        <div className="w-full mt-space-xl pt-space-md border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between text-outline font-body-sm text-body-sm gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span>You can freely switch roles from your profile settings whenever needed.</span>
          </div>
          <span className="font-code-md text-code-md">DOC ID: NY-2025-AUTH</span>
        </div>
      </div>
    </main>
  );
}
