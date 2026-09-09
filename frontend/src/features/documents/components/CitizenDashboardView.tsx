'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { StatusBadge } from './StatusBadge';
import { useDocuments } from '../hooks/useDocuments';

export function CitizenDashboardView() {
  const { user } = useAuthStore();
  const { language, setLanguage } = useUIStore();
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'applications'>('all');
  const { documents, isLoading } = useDocuments();

  return (
    <div className="w-full max-w-[75rem] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl flex flex-col gap-space-xl">
      {/* 1. Header Greeting Block */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-outline-variant pb-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="font-code-md text-code-md text-outline tracking-wider uppercase">
              Docket #MH-PU-2023-009412
            </span>
            <span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
              Civil Suit Active
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            Hello, {user?.name || user?.fullName || 'Citizen Litigant'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Here&apos;s where your case stands in Pune District Court.
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Link
            href="/upload"
            className="h-11 px-space-lg bg-primary-container text-on-primary font-label-lg font-semibold rounded hover:bg-primary transition-colors flex items-center justify-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload a New Document</span>
          </Link>
        </div>
      </section>

      {/* 2. CENTERPIECE: Next Hearing Card */}
      <section className="w-full bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-[6px] p-space-lg lg:p-space-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md pb-space-md border-b border-outline-variant">
          <div className="flex items-center gap-space-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase font-semibold">
              YOUR NEXT HEARING
            </span>
          </div>
          <div className="px-space-sm py-space-xxs bg-surface-container text-primary-container font-code-md text-code-md rounded">
            CNR: MHPUN010049282023
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg pt-space-lg items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-sm">
            <div className="flex flex-col">
              <span className="font-headline-lg text-[44px] lg:text-[52px] leading-[1.1] font-bold text-primary tracking-tight">
                18 April 2025
              </span>
              <span className="font-title-lg text-title-lg text-on-surface mt-space-xs font-semibold">
                at Pune Civil Court, Court Hall No. 4 (Civil Judge Senior Division)
              </span>
            </div>

            <div className="mt-space-md p-space-md bg-surface-container-low rounded border border-outline-variant flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary-container mt-0.5 text-[22px]">
                verified_user
              </span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary-container uppercase tracking-wide">
                  Hearing Guidance
                </span>
                <p className="font-body-md text-body-md text-on-surface mt-0.5">
                  Next stage: Written submissions on interim injunction. Your personal appearance is dispensed with for this date. Your advocate will represent the docket.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded border border-outline-variant">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Scheduled Order of Business
            </span>
            <div className="flex flex-col gap-space-xs text-body-sm text-on-surface">
              <div className="flex justify-between py-1 border-b border-outline-variant">
                <span className="text-on-surface-variant">Hearing Item:</span>
                <span className="font-semibold text-primary">Item #14 (Morning Session)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant">
                <span className="text-on-surface-variant">Presiding:</span>
                <span className="font-semibold">Hon. Civil Judge (Sr. Div)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Estimated Call:</span>
                <span className="font-semibold">11:30 AM – 12:15 PM</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Calendar reminder alert registered for April 18, 2025.')}
              className="mt-space-xs w-full py-2 bg-surface-container-lowest border border-outline text-primary-container text-label-md font-label-md rounded hover:bg-surface-container transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Set Hearing Reminder</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Plain-Language Case Summary Card */}
      <section className="w-full bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-[6px] p-space-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">What&apos;s happened so far</h2>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Simplified judicial record summary updated after the 12 March sitting
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-surface-container border border-outline-variant rounded">
            <button
              className={`px-space-sm py-1 rounded text-label-sm font-label-sm transition-all ${
                language === 'en'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setLanguage('en')}
              type="button"
            >
              English
            </button>
            <button
              className={`px-space-sm py-1 rounded text-label-sm font-label-sm transition-all ${
                language === 'mr'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setLanguage('mr')}
              type="button"
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        <div className="pt-space-md font-body-lg text-body-lg leading-relaxed text-on-surface space-y-3">
          {language === 'mr' ? (
            <>
              <p>
                आपल्या मालमत्तेवरील स्थगिती (Stay Order) अद्याप कायम आहे. अंतिम निकाल येईपर्यंत सर्व्हे क्र. ४२/३ वर बांधकाम सुरू करण्यास किंवा प्लॉट विक्रीस कोर्टाने मनाई केली आहे.
              </p>
              <p>
                प्रतिवादींना १९९८ चा मूळ खरेदी करार पुढील २१ दिवसांत न्यायालयात सादर करण्याचे निर्देश देण्यात आले आहेत.
              </p>
            </>
          ) : (
            <>
              <p>
                The stay on your property remains active. The builder cannot start construction or sell any plots on Survey No. 42/3 until the final verdict. Your peaceful possession is officially protected by court order.
              </p>
              <p>
                The court ordered the builder to produce the original 1998 sale agreement within 21 days.
              </p>
            </>
          )}
        </div>
      </section>

      {/* 4. Recent Case Documents Timeline */}
      <section id="documents" className="w-full bg-surface-container-lowest border border-outline-variant rounded-[6px] p-space-lg shadow-sm">
        <div className="flex items-center justify-between pb-space-md border-b border-outline-variant mb-space-md">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Case Records &amp; Documents</h2>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Verified court orders, petitions, and applications on file
            </p>
          </div>
          <Link
            href="/upload"
            className="text-label-md font-semibold text-primary-container hover:underline inline-flex items-center gap-1"
          >
            <span>+ Add File</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-outline">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary-container mb-2">
              progress_activity
            </span>
            <p>Loading case files...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-outline border border-dashed border-outline-variant rounded">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline">folder_open</span>
            <p className="font-medium text-on-surface">No documents uploaded yet.</p>
            <p className="text-body-sm text-outline mt-1">Upload an order or petition to get AI summaries and chat.</p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-primary-container text-on-primary rounded font-label-md font-semibold"
            >
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low px-2 rounded transition-colors">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-2xl mt-0.5">
                    description
                  </span>
                  <div>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="font-semibold text-primary hover:underline text-title-md"
                    >
                      {doc.original_filename || doc.filename || 'Case Document'}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-body-sm text-outline">
                      <span>{doc.case_number || doc.caseNumber || 'Docket File'}</span>
                      <span>•</span>
                      <span>
                        {doc.created_at || doc.uploadDate
                          ? new Date(doc.created_at || doc.uploadDate || '').toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={doc.status} isHandwritten={doc.is_handwritten || doc.isHandwritten} />
                  <Link
                    href={`/documents/${doc.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container text-primary-container border border-outline-variant rounded font-label-sm font-semibold hover:bg-primary-container hover:text-on-primary transition-colors"
                  >
                    <span>View &amp; Ask</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
