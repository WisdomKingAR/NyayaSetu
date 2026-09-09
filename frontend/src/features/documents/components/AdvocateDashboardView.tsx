'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { useDocuments } from '../hooks/useDocuments';

export function AdvocateDashboardView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { documents, isLoading } = useDocuments();

  const filteredDocs = documents.filter((doc) => {
    const filename = (doc.original_filename || doc.filename || '').toLowerCase();
    const caseNum = (doc.case_number || doc.caseNumber || '').toLowerCase();
    const matchesSearch =
      filename.includes(searchTerm.toLowerCase()) ||
      caseNum.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[75rem] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md flex flex-col gap-space-md">
      {/* 1. Page Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-space-xs sm:gap-space-sm">
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
            Advocate Case Vault
          </h1>
          <div className="inline-flex items-center px-space-xs py-0.5 rounded-[2px] bg-[#EEF2F9] border border-[#BFD1EC] text-primary-container font-label-sm font-semibold">
            {documents.length > 0 ? `${documents.length} active documents` : 'Multi-case repository active'}
          </div>
        </div>

        <div className="flex items-center gap-space-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => alert('Exporting structured cause list summary...')}
            className="h-[40px] px-space-md rounded bg-[#FFFFFF] border border-[#1B3A6B] text-primary-container hover:bg-[#EEF2F9] font-label-lg font-semibold inline-flex items-center gap-space-xxs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Cause Summary</span>
          </button>
          <Link
            href="/upload"
            className="h-[40px] px-space-md rounded bg-[#1B3A6B] hover:bg-[#2D5A9E] active:bg-[#132B50] text-on-primary font-label-lg font-semibold inline-flex items-center gap-space-xxs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <div className="bg-[#FFFFFF] border border-outline-variant border-l-[4px] border-l-[#1B3A6B] rounded-[4px] p-space-sm flex flex-col justify-between shadow-xs">
          <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">Total Briefs Tracked</span>
          <div className="flex items-baseline justify-between mt-space-xxs">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              {documents.length}
            </span>
            <span className="font-code-md text-code-md text-outline">DOCKETS</span>
          </div>
          <span className="font-body-sm text-on-surface-variant mt-0.5">Civil, Writ &amp; Appellate</span>
        </div>

        <div className="bg-[#FFFFFF] border border-outline-variant border-l-[4px] border-l-[#1B3A6B] rounded-[4px] p-space-sm flex flex-col justify-between shadow-xs">
          <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">Hearings Scheduled</span>
          <div className="flex items-baseline justify-between mt-space-xxs">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">4</span>
            <span className="font-label-sm px-1.5 py-0.5 rounded-[2px] bg-[#FFF8DC] text-[#7A5C00] border border-[#ECD79A] font-semibold">
              Upcoming
            </span>
          </div>
          <span className="font-body-sm text-on-surface-variant mt-0.5">District Court &amp; High Court</span>
        </div>

        <div className="bg-[#FFFFFF] border border-outline-variant border-l-[4px] border-l-[#1B3A6B] rounded-[4px] p-space-sm flex flex-col justify-between shadow-xs">
          <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">Processed &amp; Indexed</span>
          <div className="flex items-baseline justify-between mt-space-xxs">
            <span className="font-headline-lg text-headline-lg text-[#1B6B3A] font-bold">
              {documents.filter((d) => d.status === 'complete').length}
            </span>
            <span className="font-label-sm text-[#1B6B3A] font-semibold">AI Ready</span>
          </div>
          <span className="font-body-sm text-on-surface-variant mt-0.5">Parsed, verified &amp; ready</span>
        </div>

        <div className="bg-[#FFFFFF] border border-outline-variant border-l-[4px] border-l-[#1B3A6B] rounded-[4px] p-space-sm flex flex-col justify-between shadow-xs">
          <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">Processing Pipeline</span>
          <div className="flex items-baseline justify-between mt-space-xxs">
            <span className="font-headline-lg text-headline-lg text-[#7A5C00] font-bold">
              {documents.filter((d) => d.status === 'processing' || d.status === 'pending').length}
            </span>
            <span className="font-label-sm text-outline">Active queue</span>
          </div>
          <span className="font-body-sm text-on-surface-variant mt-0.5">OCR &amp; AI Summaries</span>
        </div>
      </div>

      {/* 3. Toolbar Row */}
      <div className="bg-[#FFFFFF] border border-outline-variant rounded-[4px] p-space-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm">
        <div className="relative flex-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-[40px] pl-10 pr-3 rounded-[4px] border border-outline-variant bg-[#FFFFFF] text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:border-[#1B3A6B]"
            id="docketSearch"
            placeholder="Search by case number, party name, or file name..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <select
            className="h-[40px] pl-3 pr-8 rounded-[4px] border border-outline-variant bg-[#FFFFFF] text-on-surface font-label-md focus:outline-none focus:border-[#1B3A6B]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Status: All</option>
            <option value="complete">Ready / Complete</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="error">Attention Required</option>
          </select>
        </div>
      </div>

      {/* 4. Table / List of Advocate Case Files */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[4px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-label-sm uppercase font-semibold text-outline tracking-wider">
                <th className="p-3 pl-4">Docket / Document</th>
                <th className="p-3">Case No. &amp; Court</th>
                <th className="p-3">Uploaded</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-on-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-outline">
                    <span className="material-symbols-outlined animate-spin text-2xl text-primary-container mb-1">
                      progress_activity
                    </span>
                    <p>Loading case files...</p>
                  </td>
                </tr>
              ) : filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[20px]">
                          description
                        </span>
                        <div>
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {doc.original_filename || doc.filename || 'Document'}
                          </Link>
                          <div className="text-body-sm text-outline">
                            ID: {doc.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-code-md text-[13px]">
                      <div>{doc.case_number || doc.caseNumber || 'Standard Docket'}</div>
                      <div className="text-outline text-body-sm">Civil Court / District Jurisdiction</div>
                    </td>
                    <td className="p-3">
                      <span>
                        {doc.created_at || doc.uploadDate
                          ? new Date(doc.created_at || doc.uploadDate || '').toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={doc.status} isHandwritten={doc.is_handwritten || doc.isHandwritten} />
                    </td>
                    <td className="p-3 text-right pr-4">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container text-primary-container border border-outline-variant rounded font-label-sm font-semibold hover:bg-primary-container hover:text-on-primary transition-colors"
                      >
                        <span>Analyze</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-outline">
                    <p>No documents match the current filter.</p>
                    <Link
                      href="/upload"
                      className="mt-2 inline-flex items-center gap-1 text-primary-container font-semibold hover:underline"
                    >
                      + Upload a document to this docket
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
