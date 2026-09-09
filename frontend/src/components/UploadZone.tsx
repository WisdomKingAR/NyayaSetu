'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, processDocument } from '@/lib/apiClient';

type UploadState = 'idle' | 'dragover' | 'uploading' | 'error';

interface UploadZoneProps {
  onSuccess?: (documentId: string) => void;
  onUploadComplete?: (documentId: string) => void;
  compact?: boolean;
}

export function UploadZone({ onSuccess, onUploadComplete, compact = false }: UploadZoneProps) {
  const router = useRouter();
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showColdStartNotice, setShowColdStartNotice] = useState(false);
  const coldStartTimer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFile = useCallback(
    async (file: File) => {
      // Validate
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setState('error');
        setErrorMessage('Invalid file type. Please upload a PDF, JPEG, PNG, or WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setState('error');
        setErrorMessage('File is too large. Maximum size is 10 MB.');
        return;
      }

      setFilename(file.name);
      setFileSize(formatSize(file.size));
      setState('uploading');
      setProgress(10);

      // Cold-start banner after 5s
      coldStartTimer.current = setTimeout(() => setShowColdStartNotice(true), 5000);

      try {
        setProgress(20);
        const uploadRes = await uploadDocument(file);
        const documentId: string = uploadRes.data?.documentId;
        if (!documentId) throw new Error('Upload failed — no document ID returned');

        setProgress(40);

        // Trigger OCR pipeline
        await processDocument(documentId);
        setProgress(100);
        clearTimeout(coldStartTimer.current);
        setShowColdStartNotice(false);

        if (onUploadComplete) {
          onUploadComplete(documentId);
        } else if (onSuccess) {
          onSuccess(documentId);
        } else {
          router.push(`/documents/${documentId}`);
        }
      } catch (err: unknown) {
        clearTimeout(coldStartTimer.current);
        setShowColdStartNotice(false);
        setState('error');
        const message =
          err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setErrorMessage(message);
      }
    },
    [router, onSuccess, onUploadComplete],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  useEffect(() => {
    return () => {
      if (coldStartTimer.current) clearTimeout(coldStartTimer.current);
    };
  }, []);

  // ─── STATE: Error ──────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div
        className="bg-surface-container-lowest rounded-lg p-space-lg flex flex-col gap-space-md"
        style={{ border: '1px solid #BA1A1A', borderLeft: '4px solid #BA1A1A' }}
      >
        <div className="flex items-start gap-space-md">
          <div className="w-10 h-10 rounded bg-[#FDF0F0] flex items-center justify-center text-error shrink-0">
            <span className="material-symbols-outlined text-[24px]">error_outline</span>
          </div>
          <div>
            <p className="font-title-md text-title-md text-on-surface font-semibold">
              Upload Failed
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xxs">
              {errorMessage}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setState('idle');
            setErrorMessage('');
            setProgress(0);
          }}
          className="self-start inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary-container hover:text-primary transition-colors font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Try Again
        </button>
      </div>
    );
  }

  // ─── STATE: Uploading ──────────────────────────────────────────────────────
  if (state === 'uploading') {
    return (
      <div className="flex flex-col gap-space-xs">
        {showColdStartNotice && (
          <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-[#FDF7E3] border border-secondary rounded-lg text-body-sm font-body-sm text-[#7A5C00]">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            Connecting to processing server — this may take a moment…
          </div>
        )}
        <div
          className="bg-surface-container-lowest rounded-lg p-space-lg flex flex-col justify-between"
          style={{ border: '1px solid #D4D0C9', borderLeft: '4px solid #1B3A6B' }}
        >
          <div className="flex items-start justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div className="min-w-0">
                <p className="font-title-md text-title-md text-on-surface truncate">{filename}</p>
                <span className="font-code-md text-code-md text-outline">{fileSize}</span>
              </div>
            </div>
            <span
              className="font-label-sm text-label-sm font-semibold uppercase px-space-xs py-0.5 rounded text-primary-container"
              style={{ background: '#EEF2F9', border: '1px solid #BFD1EC' }}
            >
              Parsing
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-space-xs mb-space-md">
            <div className="flex justify-between items-center text-label-sm font-label-sm">
              <span className="text-on-surface-variant font-medium">
                Extracting text layers &amp; bilingual seals
              </span>
              <span className="font-code-md text-code-md text-primary-container font-semibold">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 rounded bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-primary-container transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-space-sm text-label-sm font-label-sm text-center">
            {[
              { icon: 'document_scanner', label: 'OCR' },
              { icon: 'psychology', label: 'Summarise' },
              { icon: 'translate', label: 'Translate' },
            ].map(({ icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-space-xxs ${
                  progress > i * 33 ? 'text-primary-container' : 'text-outline-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE: Dragover ───────────────────────────────────────────────────────
  if (state === 'dragover') {
    return (
      <div
        className="rounded-lg p-space-2xl text-center flex flex-col items-center justify-center transition-all"
        style={{ background: '#EEF2F9', border: '2px solid #1B3A6B' }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setState('idle')}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded bg-primary-container text-on-primary flex items-center justify-center mb-space-md animate-bounce">
          <span className="material-symbols-outlined text-[36px]">file_download</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-primary-container mb-space-xs font-bold">
          Drop your court document to start digitizing
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Release now — we&apos;ll automatically extract CNR numbers, hearing dates, and
          plain English &amp; Marathi summaries.
        </p>
        <div
          className="mt-space-md inline-flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-lowest text-primary-container font-code-md text-code-md"
          style={{ border: '1px solid #BFD1EC' }}
        >
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          Ready to parse single or multi-page docket bundles
        </div>
      </div>
    );
  }

  // ─── STATE: Idle (default) ─────────────────────────────────────────────────
  return (
    <div
      className="bg-surface-container-lowest rounded-lg p-space-2xl sm:p-space-3xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low/50 transition-colors"
      style={{ border: '2px dashed #D4D0C9' }}
      onDragOver={(e) => {
        e.preventDefault();
        setState('dragover');
      }}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload court document"
    >
      <div className="w-16 h-16 rounded bg-surface-container-low flex items-center justify-center mb-space-md text-primary-container">
        <span className="material-symbols-outlined text-[36px]">upload_file</span>
      </div>

      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
        Drag a court document here, or tap to choose a file
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-space-lg">
        Accepted: PDF, JPG, PNG — up to 10 MB (Scanned orders, judgments, handwritten filings)
      </p>

      <div className="flex flex-wrap items-center justify-center gap-space-md">
        <label
          className="cursor-pointer bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg px-space-xl py-space-sm rounded-lg transition-colors inline-flex items-center gap-space-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Choose File from Computer or Phone
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* Security strip */}
      <div
        className="mt-space-lg pt-space-md w-full max-w-md flex items-center justify-center gap-space-lg text-outline font-label-sm text-label-sm"
        style={{ borderTop: '1px solid #D4D0C9' }}
      >
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          Client Confidentiality Maintained
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">translate</span>
          Marathi &amp; English Auto-OCR
        </span>
      </div>
    </div>
  );
}
