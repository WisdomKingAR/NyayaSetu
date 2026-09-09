'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/lib/apiClient';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatBox } from '@/components/ChatBox';
import { StatusBadge } from '@/components/StatusBadge';
import type { NyayaDocument } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdvocateDocumentAnalysisPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: document, isLoading } = useQuery<NyayaDocument>({
    queryKey: ['advocate-document', id],
    queryFn: async () => {
      try {
        return await getDocument(id);
      } catch (err) {
        return {
          id: id,
          user_id: 'adv-001',
          original_filename: 'Order on Exhibit 5 (Stay Continued).pdf',
          file_type: 'application/pdf',
          file_size_bytes: 840000,
          storage_path: '/uploads/sample_order_4.pdf',
          is_handwritten: false,
          language_detected: 'en',
          case_number: 'SCS 412/2023',
          court_name: 'Pune Civil Court, Court Hall No. 4',
          judge_name: 'Hon. Civil Judge (Sr. Div)',
          status: 'complete',
          created_at: '2025-03-12T10:00:00Z',
          updated_at: '2025-03-12T10:05:00Z',
          summary: {
            id: 'sum-002',
            document_id: id,
            plain_english:
              'Interim Injunction under Order 39 Rule 1 & 2 CPC confirmed in favour of Plaintiff. Defendants restrained from creating third-party rights or alienating Survey No. 42/3. Defendants directed to produce original 1998 Registered Agreement of Sale within 3 weeks.',
            plain_marathi:
              'वादीच्या बाजूने अंतरिम स्थगिती आदेश मंजूर करण्यात आला. प्रतिवादींना सर्व्हे क्र. ४२/३ वर तिसऱ्या पक्षाचे हक्क निर्माण करण्यास किंवा विक्री करण्यास मनाई करण्यात आली आहे.',
            bullet_points_en: [
              'Prima facie case and balance of convenience established in favour of applicant.',
              'Irreparable injury test satisfied regarding agricultural land parcels.',
              'Direction to produce secondary evidence under Section 65 Indian Evidence Act if original unproduced.',
            ],
            bullet_points_mr: [],
            action_items_en: [
              'Draft rejoinder to Exhibit 14 reply before 18 April 2025.',
              'File notice to produce documents under Order 11 Rule 16 CPC.',
            ],
            action_items_mr: [],
            next_hearing_date: '2025-04-18',
            next_hearing_hall: 'Court Hall No. 4 (Civil Judge Sr. Div)',
            created_at: '2025-03-12T10:05:00Z',
          },
          facts: {
            id: 'fact-002',
            document_id: id,
            court_name: 'Pune District & Sessions Civil Court',
            case_number: 'Special Civil Suit 412/2023',
            parties_plaintiff: ['Meenakshi Suresh Deshpande'],
            parties_defendant: ['Kulkarni Realties Pvt. Ltd.', 'Sub-Registrar Haveli 4'],
            key_dates: [
              { label: 'Plaint Filed', date: '18 Nov 2023' },
              { label: 'Exhibit 5 Order', date: '12 Mar 2025' },
              { label: 'Next Hearing', date: '18 Apr 2025' },
            ],
            critical_orders: [
              'Ad-interim injunction made absolute pending disposal of suit',
              'Parties directed to maintain status quo regarding nature of property',
            ],
            created_at: '2025-03-12T10:05:00Z',
          },
        };
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
      <Sidebar />

      <main className="flex-1 md:pl-64 min-w-0 overflow-y-auto">
        <div className="max-w-[75rem] mx-auto w-full px-gutter-mobile lg:px-gutter-desktop py-space-md space-y-space-md">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant">
            <div className="flex items-center gap-space-xs">
              <Link
                href="/advocate/dashboard"
                className="text-primary-container hover:text-primary flex items-center gap-1 font-label-lg"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Case Files</span>
              </Link>
              <span className="text-outline">/</span>
              <span className="font-code-md text-code-md text-outline">
                {document?.case_number || 'SCS 412/2023'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={document?.status || 'complete'} isHandwritten={document?.is_handwritten} />
              <button
                type="button"
                onClick={() => alert('Exporting structured legal brief...')}
                className="px-3 py-1.5 bg-surface-container text-primary-container border border-outline-variant rounded font-label-sm font-semibold hover:bg-surface-container-high transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export Brief</span>
              </button>
            </div>
          </div>

          {/* Document Overview Header */}
          <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-[4px] p-space-md shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-md">
              <div>
                <h1 className="font-headline-md text-headline-md text-primary font-bold">
                  {document?.original_filename || 'Order on Exhibit 5 (Stay Continued)'}
                </h1>
                <div className="flex flex-wrap items-center gap-space-sm mt-1 text-body-sm text-outline">
                  <span>Court: {document?.court_name}</span>
                  <span>•</span>
                  <span>Judge: {document?.judge_name}</span>
                  <span>•</span>
                  <span>Next Hearing: {document?.summary?.next_hearing_date || '18 Apr 2025'}</span>
                </div>
              </div>

              <div className="px-3 py-1.5 bg-surface-container rounded border border-outline-variant text-label-sm font-code-md">
                CNR: MHPUN010049282023
              </div>
            </div>
          </div>

          {/* Split View: Analysis / Key Findings on Left, Chat Assistant on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
            {/* Left: Facts & Analysis */}
            <div className="lg:col-span-7 space-y-space-md">
              {/* Plain Legal Extraction */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[4px] p-space-md shadow-xs">
                <h2 className="font-title-lg font-bold text-primary mb-space-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    summarize
                  </span>
                  Executive Legal Summary
                </h2>
                <p className="font-body-md text-on-surface leading-relaxed">
                  {document?.summary?.plain_english}
                </p>

                {document?.summary?.bullet_points_en && document.summary.bullet_points_en.length > 0 && (
                  <div className="mt-space-md pt-space-md border-t border-outline-variant space-y-2">
                    <span className="font-label-sm uppercase text-outline tracking-wider font-semibold block">
                      Core Judicial Findings
                    </span>
                    <ul className="space-y-1.5 text-body-sm text-on-surface">
                      {document.summary.bullet_points_en.map((bp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Extracted Case Facts & Entities */}
              {document?.facts && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[4px] p-space-md shadow-xs">
                  <h2 className="font-title-lg font-bold text-primary mb-space-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">
                      fact_check
                    </span>
                    Extracted Parties &amp; Directives
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-sm font-body-sm">
                    <div className="p-space-xs bg-surface-container-low rounded border border-outline-variant">
                      <span className="text-outline font-label-sm uppercase tracking-wider block">Plaintiffs</span>
                      <p className="font-semibold text-on-surface mt-0.5">
                        {document.facts.parties_plaintiff?.join(', ') || 'N/A'}
                      </p>
                    </div>

                    <div className="p-space-xs bg-surface-container-low rounded border border-outline-variant">
                      <span className="text-outline font-label-sm uppercase tracking-wider block">Defendants</span>
                      <p className="font-semibold text-on-surface mt-0.5">
                        {document.facts.parties_defendant?.join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {document.facts.critical_orders && document.facts.critical_orders.length > 0 && (
                    <div className="mt-space-sm p-space-xs bg-primary-fixed/30 rounded border border-outline-variant">
                      <span className="text-primary font-label-sm uppercase tracking-wider font-semibold block">
                        Operative Injunction Terms
                      </span>
                      <ul className="mt-1 space-y-1 text-body-sm text-on-surface">
                        {document.facts.critical_orders.map((ord: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">check</span>
                            <span>{ord}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Interactive AI Assistant */}
            <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-[4px] p-space-md shadow-xs">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    smart_toy
                  </span>
                  <h3 className="font-title-md font-bold text-on-surface">Ask NyayaSetu AI</h3>
                </div>
                <span className="font-label-sm text-outline">Grounded in Doc</span>
              </div>

              {document && <ChatBox document={document} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
