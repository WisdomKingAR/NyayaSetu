import Link from 'next/link';
import type { DocumentListItem } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';

interface DocumentCardProps {
  document: DocumentListItem;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const docIcon =
    document.docType === 'judgment' || document.docType === 'order'
      ? 'gavel'
      : 'description';

  const formattedDate = new Date(document.uploadDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      {/* ─── Left: icon + text ─── */}
      <div className="flex items-start gap-space-md">
        <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container shrink-0">
          <span className="material-symbols-outlined text-[24px]">{docIcon}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-title-md text-title-md font-semibold text-on-surface truncate">
              {document.filename}
            </span>

            <StatusBadge
              status={document.status}
              isHandwritten={document.isHandwritten}
            />

            {document.isHandwritten && document.status !== 'error' && (
              <StatusBadge status="complete" isHandwritten className="hidden sm:inline-flex" />
            )}
          </div>

          <div className="flex items-center gap-space-sm mt-space-xxs flex-wrap">
            {document.caseNumber && (
              <span className="font-code-md text-code-md text-primary-container font-semibold">
                {document.caseNumber}
              </span>
            )}
            {document.caseNumber && (
              <span className="text-outline-variant">•</span>
            )}
            <span className="font-body-sm text-body-sm text-outline capitalize">
              {document.docType}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-outline">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right: actions ─── */}
      <div className="flex items-center gap-space-sm shrink-0">
        {document.status === 'complete' ? (
          <Link
            href={`/documents/${document.id}`}
            className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary-container hover:text-primary transition-colors font-semibold"
          >
            <span>View Summary</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        ) : document.status === 'error' ? (
          <span className="font-label-sm text-label-sm text-error">
            Processing failed
          </span>
        ) : (
          <span className="font-label-sm text-label-sm text-outline animate-pulse">
            Processing…
          </span>
        )}
      </div>
    </div>
  );
}
