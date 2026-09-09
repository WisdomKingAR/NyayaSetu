'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';
import { SummaryPanel } from '@/features/documents/components/SummaryPanel';
import { ChatBox } from '@/features/chat/components/ChatBox';
import { useDocument } from '@/features/documents/hooks/useDocument';
import { StatusBadge } from '@/features/documents/components/StatusBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary');

  const { document, isLoading, error } = useDocument(id);

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-w-0 overflow-y-auto">
          <div className="max-w-[75rem] mx-auto w-full px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-lg">
            {/* Top navigation link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant">
              <Link
                className="inline-flex items-center gap-space-xs font-label-lg text-primary-container hover:text-primary transition-colors"
                href="/dashboard"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Dashboard</span>
              </Link>
              {document && (
                <div className="flex items-center gap-space-sm font-label-sm text-outline">
                  <StatusBadge status={document.status} isHandwritten={document.is_handwritten || document.isHandwritten} />
                  <span>•</span>
                  <span>
                    Uploaded {document.created_at || document.uploadDate
                      ? new Date(document.created_at || document.uploadDate || '').toLocaleDateString()
                      : 'Recently'}
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="p-16 text-center text-outline">
                <span className="material-symbols-outlined animate-spin text-[36px] mb-2 text-primary-container">
                  progress_activity
                </span>
                <p className="font-body-md text-on-surface">Loading document analysis...</p>
                <p className="text-body-sm text-outline mt-1">Retrieving verified court order records</p>
              </div>
            ) : error && !document ? (
              <div className="p-12 text-center text-error border border-error/20 bg-error/5 rounded">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p className="font-semibold">Document not found or inaccessible.</p>
                <Link href="/dashboard" className="mt-4 inline-block text-primary-container font-semibold hover:underline">
                  Return to Dashboard
                </Link>
              </div>
            ) : document ? (
              <div className="space-y-space-md">
                {/* View Switcher Tabs */}
                <div className="flex items-center border-b border-outline-variant gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center gap-2 px-4 py-3 font-label-lg font-semibold border-b-2 transition-colors ${
                      activeTab === 'summary'
                        ? 'border-primary-container text-primary-container'
                        : 'border-transparent text-outline hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                    <span>Order Summary &amp; Facts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-4 py-3 font-label-lg font-semibold border-b-2 transition-colors ${
                      activeTab === 'chat'
                        ? 'border-primary-container text-primary-container'
                        : 'border-transparent text-outline hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Ask Questions (Bilingual AI)</span>
                  </button>
                </div>

                {/* Content based on Active Tab */}
                {activeTab === 'summary' ? (
                  <SummaryPanel document={document} />
                ) : (
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md shadow-sm">
                    <ChatBox document={document} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
