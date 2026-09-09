'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { listDocuments } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
import type { DocumentListItem } from '@/lib/types';

export default function LitigantDashboardPage() {
  const { user } = useAuthStore();
  const { language, setLanguage } = useUIStore();
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'applications'>('all');

  const { data: documents = [], isLoading } = useQuery<DocumentListItem[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      try {
        return await listDocuments();
      } catch (err) {
        return [];
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
      <Sidebar />

      <main className="flex-1 md:pl-64 min-w-0 overflow-y-auto">
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
                Hello, {user?.name || 'Citizen Litigant'}
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

            <div className="mt-space-md p-space-lg bg-surface-container-low rounded border border-outline-variant flex flex-col gap-space-md">
              {language === 'mr' ? (
                <div className="flex flex-col gap-space-sm">
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed font-serif">
                    दिवाणी न्यायालयाने आपल्या जमिनीच्या भूखंडाचे संरक्षण करणारा अंतरिम स्थगिती आदेश कायम ठेवला आहे. खटल्याचा अंतिम निकाल लागेपर्यंत बांधकाम व्यावसायिकास सर्व्हे क्र. ४२/३ वर विक्री किंवा बांधकाम करण्यास मनाई आहे. न्यायालयाने प्रतिवादींच्या वकिलांना १९९८ चा मूळ करार सादर करण्याचे निर्देश दिले आहेत.
                  </p>
                  <div className="flex items-center gap-space-xs pt-space-xs text-body-sm text-outline">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>न्यायालयीन आदेश क्र. ४ वर आधारित सोपा सारांश</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-space-sm">
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                    The civil court has continued the stay order protecting your land plot. The builder cannot sell or build on Survey No. 42/3 until the case is decided. The court has ordered the builder&apos;s lawyer to produce the original 1998 agreement.
                  </p>
                  <div className="flex items-center gap-space-xs pt-space-xs text-body-sm text-outline">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Verified plain-language summary extracted from Order No. 4</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 4. Case Documents Section */}
          <section className="w-full flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-space-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Case Documents &amp; Orders ({documents.length > 0 ? documents.length : 3})
              </h2>
              <Link
                href="/upload"
                className="text-primary-container font-label-lg hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Upload Document
              </Link>
            </div>

            {/* Document list cards */}
            <div className="flex flex-col gap-space-sm">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container p-space-md rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <Link
                          href={`/documents/${doc.id}`}
                          className="font-title-md font-semibold text-primary hover:underline"
                        >
                          {doc.original_filename || doc.filename || 'Document'}
                        </Link>
                        <div className="flex items-center gap-space-sm mt-1 text-body-sm text-outline font-code-md">
                          <span>{doc.case_number || doc.caseNumber || 'DOCKET-REF-001'}</span>
                          <span>•</span>
                          <span>
                            {doc.created_at || doc.uploadDate
                              ? new Date(doc.created_at || doc.uploadDate || '').toLocaleDateString()
                              : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
                      <StatusBadge status={doc.status} isHandwritten={doc.is_handwritten || doc.isHandwritten} />
                      <Link
                        href={`/documents/${doc.id}`}
                        className="px-space-md py-1.5 rounded border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary font-label-md transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Summary</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback sample documents from Stitch screen 05 */
                <>
                  <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container p-space-md rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                        <span className="material-symbols-outlined">gavel</span>
                      </div>
                      <div>
                        <Link href="/documents/sample-order-4" className="font-title-md font-semibold text-primary hover:underline">
                          Order on Exhibit 5 (Interim Injunction Stay Continued)
                        </Link>
                        <div className="flex items-center gap-space-sm mt-1 text-body-sm text-outline font-code-md">
                          <span>Pune Court • Passed 12 Mar 2025</span>
                          <span>•</span>
                          <span>6 Pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-label-sm font-semibold rounded-[2px]">
                        Summarized
                      </span>
                      <Link
                        href="/documents/sample-order-4"
                        className="px-space-md py-1.5 rounded border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary font-label-md transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Summary</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container p-space-md rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <Link href="/documents/sample-petition" className="font-title-md font-semibold text-primary hover:underline">
                          Special Civil Suit Plaint &amp; Verification Affidavit
                        </Link>
                        <div className="flex items-center gap-space-sm mt-1 text-body-sm text-outline font-code-md">
                          <span>Filed 18 Nov 2023</span>
                          <span>•</span>
                          <span>18 Pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-label-sm font-semibold rounded-[2px]">
                        Summarized
                      </span>
                      <Link
                        href="/documents/sample-petition"
                        className="px-space-md py-1.5 rounded border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary font-label-md transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Summary</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
