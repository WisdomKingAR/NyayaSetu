import type { DocumentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: DocumentStatus;
  isHandwritten?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  DocumentStatus | 'handwritten',
  { label: string; className: string }
> = {
  pending: {
    label: 'PENDING',
    className: 'bg-surface-container text-outline border-outline-variant',
  },
  processing: {
    label: 'PROCESSING',
    className: 'bg-[#FFF8DC] text-[#7A5C00] border-secondary',
  },
  ocr_complete: {
    label: 'OCR DONE',
    className: 'bg-[#FFF8DC] text-[#7A5C00] border-secondary',
  },
  summarized: {
    label: 'SUMMARIZING',
    className: 'bg-[#FFF8DC] text-[#7A5C00] border-secondary',
  },
  complete: {
    label: 'READY',
    className: 'bg-[#EDF7F1] text-[#1B6B3A] border-[#1B6B3A]',
  },
  error: {
    label: 'ERROR',
    className: 'bg-[#FDF0F0] text-[#8B1A1A] border-[#8B1A1A]',
  },
  handwritten: {
    label: 'HANDWRITTEN',
    className: 'bg-secondary-fixed text-[#7A5C00] border-secondary',
  },
};

export function StatusBadge({
  status,
  isHandwritten = false,
  className = '',
}: StatusBadgeProps) {
  const key = isHandwritten ? 'handwritten' : status;
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center px-space-xs py-space-xxs rounded font-label-sm text-label-sm font-semibold uppercase tracking-wider border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

/** A processing indicator dot that pulses for active states */
export function StatusDot({ status }: { status: DocumentStatus }) {
  const isActive = ['pending', 'processing', 'ocr_complete', 'summarized'].includes(status);
  const isError = status === 'error';
  const isDone = status === 'complete';

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        isActive
          ? 'bg-secondary animate-pulse'
          : isError
          ? 'bg-error'
          : isDone
          ? 'bg-[#1B6B3A]'
          : 'bg-outline-variant'
      }`}
    />
  );
}
