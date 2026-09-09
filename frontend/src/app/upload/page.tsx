'use client';

import { useRouter } from 'next/navigation';
import { UploadZone } from '@/features/documents/components/UploadZone';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';

export default function UploadPage() {
  const router = useRouter();

  const handleUploadComplete = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
        <Sidebar />
        <main className="flex-1 md:pl-64 p-space-md lg:p-space-xl overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-space-lg">
            {/* Header */}
            <div className="border-b border-outline-variant pb-space-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-xs">
              <div>
                <div className="flex items-center gap-space-xs mb-1">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    drive_folder_upload
                  </span>
                  <span className="font-code-md text-code-md text-outline uppercase tracking-wider">
                    DOCKET INGESTION // SECURE GATEWAY
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Upload Court Document
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Upload court orders, judgments, causelists, or petitions in English or Marathi (PDF, PNG, JPG).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-high rounded text-label-sm font-semibold text-primary-container border border-outline-variant">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  256-bit Encrypted
                </span>
              </div>
            </div>

            {/* Upload Component */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg shadow-sm">
              <UploadZone onUploadComplete={handleUploadComplete} />
            </div>

            {/* Institutional Compliance Notice */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-space-md flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5">
                shield
              </span>
              <div className="font-body-sm text-body-sm text-on-surface-variant space-y-1">
                <p className="font-semibold text-on-surface">Data Privacy &amp; Court Document Standards</p>
                <p>
                  Documents uploaded are processed strictly for translation, plain-language summarization, and key date extraction. Scanned and handwritten Marathi/English documents are processed via our specialized judicial OCR pipeline.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
