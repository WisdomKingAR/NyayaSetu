'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleStart = () => {
    if (user) {
      if (user.role === 'advocate') {
        router.push('/advocate/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/auth/signup');
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Sovereign Institutional Seal Bar */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant py-space-xs">
        <div className="max-w-max-container mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium tracking-wide">
              OFFICIAL CITIZEN ACCESS INITIATIVE • e-COURTS INTEGRATED DOCKET TRANSLATION
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-md text-label-sm font-label-sm text-outline">
            <span>ISO 27001 Judicial Privacy Standard</span>
            <span>•</span>
            <span className="text-primary-container font-semibold">मराठी / English Bilingual Portal</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full py-space-2xl lg:py-space-3xl">
        <div className="max-w-max-container mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center">
            {/* Left Column: Institutional Value Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs bg-primary-fixed text-primary-container rounded-[2px] border border-outline-variant mb-space-md">
                <span className="material-symbols-outlined text-[15px]">balance</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  Court Document Intelligence For Citizens &amp; Advocates
                </span>
              </div>
              <h1 className="font-headline-lg text-[42px] lg:text-[48px] leading-[1.12] text-on-surface font-bold tracking-tight mb-space-md">
                Understand Your Court Papers in Your Own Language
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-[1.65] max-w-2xl mb-space-xl">
                Upload a court order or judgment and get a simple summary — in English or Marathi — in under a minute. No advocate needed to know what happened.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full sm:w-auto">
                <button
                  onClick={handleStart}
                  className="h-11 px-8 inline-flex items-center justify-center bg-primary-container text-on-primary font-title-md tracking-wider uppercase rounded-[4px] hover:bg-primary transition-colors border border-primary-container cursor-pointer"
                >
                  Get Started
                </button>
                <a
                  href="#how-it-works"
                  className="h-11 px-space-md inline-flex items-center justify-center text-primary-container font-title-md hover:text-primary transition-colors"
                >
                  <span>See how it works</span>
                  <span className="material-symbols-outlined ml-1 text-[20px]">arrow_forward</span>
                </a>
              </div>
              <div className="mt-space-xl pt-space-md border-t border-outline-variant w-full flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <p className="font-body-sm text-body-sm text-outline">
                  Used by litigants, solo advocates, and legal aid clinics across Maharashtra.
                </p>
              </div>
            </div>

            {/* Right Column: Judicial Archival Emblem & Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[460px] p-space-lg bg-surface-container-lowest border border-outline-variant rounded-[6px] border-l-[4px] border-l-primary-container shadow-sm">
                <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-md text-code-md text-primary-container font-semibold">
                      NYAY-DOC-2025-ARCH
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-space-xs py-space-xxs bg-secondary-fixed text-on-secondary-fixed rounded-[2px] font-semibold tracking-wider">
                    VERIFIED SEAL
                  </span>
                </div>

                <div className="relative w-full aspect-[4/3] bg-surface-container-low border border-outline-variant rounded-[4px] flex items-center justify-center overflow-hidden p-space-md">
                  <div className="absolute w-64 h-64 rounded-full bg-primary-container/10 pointer-events-none"></div>
                  <div className="text-center z-10">
                    <span className="material-symbols-outlined text-primary-container text-[72px] mb-2 block">
                      account_balance
                    </span>
                    <h3 className="font-headline-sm font-bold text-primary-container">NyayaSetu Digital Portal</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Bilingual Judicial Document Processing</p>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-surface-container-lowest/90 px-2 py-0.5 rounded-[2px] border border-outline-variant text-label-sm text-secondary">
                    <span className="material-symbols-outlined text-[14px]">gavel</span>
                    <span>Bridging Legal Language Gaps</span>
                  </div>
                </div>

                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm text-outline">
                  <span>Bilingual Parser: v4.2.0</span>
                  <span className="font-code-md text-on-surface">MHC / BOM / PUNE JURISDICTION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Benefits Section */}
      <section className="w-full py-space-2xl bg-surface-container-low border-y border-outline-variant" id="how-it-works">
        <div className="max-w-max-container mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="mb-space-xl">
            <span className="font-label-sm text-label-sm uppercase font-bold text-primary-container tracking-wider block mb-space-xs">
              Engineered for Civic Understanding
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Dignified Legal Clarity Without Legalese
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-[6px] border border-outline-variant border-l-[4px] border-l-primary-container flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[4px] bg-primary-fixed text-primary-container flex items-center justify-center mb-space-md border border-outline-variant">
                  <span className="material-symbols-outlined text-[24px]">translate</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-xs">
                  Read it in Marathi
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-[1.6]">
                  Every summary is available in plain Marathi, not just English. Formatted clearly so anyone can understand their case without ambiguity.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary-container font-semibold">
                  मराठी अनुवाद उपलब्ध
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">verified</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-[6px] border border-outline-variant border-l-[4px] border-l-primary-container flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[4px] bg-primary-fixed text-primary-container flex items-center justify-center mb-space-md border border-outline-variant">
                  <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-xs">
                  Next Hearing &amp; Actions
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-[1.6]">
                  Never miss an order compliance date. Extracted directly from court orders with court hall numbers, judge benches, and practical instructions.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary-container font-semibold">
                  पुढील सुनावणी तारीख
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">event</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-[6px] border border-outline-variant border-l-[4px] border-l-primary-container flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[4px] bg-primary-fixed text-primary-container flex items-center justify-center mb-space-md border border-outline-variant">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-xs">
                  Ask Questions in Plain Words
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-[1.6]">
                  Have a question about what the judge meant? Type or ask in conversational language and receive grounded citations from the document.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary-container font-semibold">
                  सोप्या भाषेत प्रश्न विचारा
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">forum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-space-2xl bg-surface-container-lowest border-b border-outline-variant text-center" id="upload-docket">
        <div className="max-w-2xl mx-auto px-gutter-mobile">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-code-md text-code-md text-on-surface-variant">Instant AI Docket Reader</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary-container font-bold mb-3">
            Ready to understand your court document?
          </h2>
          <p className="font-body-md text-body-md text-outline mb-6">
            Upload PDF or scanned copies in English or Marathi. No subscription required for citizen dockets.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStart}
              className="h-12 px-8 bg-primary-container hover:bg-primary text-on-primary font-label-lg rounded-[4px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Upload Your Document Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
