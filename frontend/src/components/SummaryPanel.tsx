'use client';

import { useUIStore } from '@/stores/ui.store';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { NyayaDocument } from '@/lib/types';

interface SummaryPanelProps {
  document: NyayaDocument;
  showLanguageToggle?: boolean;
}

export function SummaryPanel({
  document,
  showLanguageToggle = true,
}: SummaryPanelProps) {
  const { language } = useUIStore();
  const isMr = language === 'mr';

  const summary = isMr ? document.summaryMr : document.summaryEn;
  const parties = isMr ? document.partiesMr : document.parties;
  const courtName = isMr ? document.courtNameMr : document.courtName;
  const nextHearingDate = isMr ? document.nextHearingDateMr : document.nextHearingDate;
  const caseNumber = isMr ? document.caseNumberMr : document.caseNumber;

  // Split summary into numbered points (double newlines or numbered list)
  const summaryPoints = summary
    ? summary.split(/\n\n|\d+\.\s+/).filter(Boolean).slice(0, 3)
    : [];

  const formattedDate = document.uploadDate
    ? new Date(document.uploadDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const handleCalendar = () => {
    if (!nextHearingDate) return;
    const text = `NyayaSetu Hearing Reminder: ${nextHearingDate} — ${courtName ?? 'Court'}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    alert(`Copied to clipboard: ${text}`);
  };

  return (
    <div className="space-y-space-xl">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-md border-b border-outline-variant">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-xs py-0.5 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded">
            <span className="material-symbols-outlined text-[14px]">description</span>
            <span className="capitalize">{document.docType} Document</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            {document.filename}
          </h1>
          {caseNumber && (
            <p className="font-body-md text-body-md text-outline">
              Case No. <span className="font-code-md text-code-md text-primary-container font-semibold">{caseNumber}</span>
            </p>
          )}
        </div>

        {showLanguageToggle && (
          <div className="self-start md:self-auto">
            <LanguageToggle />
          </div>
        )}
      </div>

      {/* ─── Next Hearing card ─── */}
      {nextHearingDate && (
        <section className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg p-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">
                {isMr ? 'पुढील सुनावणीची तारीख' : 'YOUR NEXT HEARING DATE'}
              </span>
              <div className="flex items-baseline gap-space-sm flex-wrap">
                <span className="font-headline-lg text-[44px] leading-tight font-bold text-primary-container tracking-tight">
                  {nextHearingDate}
                </span>
                {courtName && (
                  <span className="px-space-xs py-0.5 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded font-medium">
                    {courtName}
                  </span>
                )}
              </div>
              <div className="flex items-start gap-space-xs pt-space-xs max-w-2xl">
                <span className="material-symbols-outlined text-[18px] text-primary-container mt-0.5 shrink-0">info</span>
                <p className="font-body-md text-body-md text-on-surface leading-normal">
                  {isMr
                    ? 'पुढील सुनावणीला फक्त कागदपत्रांची तपासणी होणार असल्याने अर्जदारास स्वतः उपस्थित राहण्याची सक्ती नाही.'
                    : <><strong>You may not need to attend this hearing in person.</strong> Please confirm with your advocate.</>
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm self-start lg:self-center shrink-0">
              <button
                type="button"
                onClick={handleCalendar}
                className="min-h-[44px] px-space-md py-space-xs bg-surface-container-low hover:bg-surface-container-high text-primary-container font-label-lg text-label-lg rounded-lg border border-outline-variant inline-flex items-center gap-space-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─── Plain-language summary ─── */}
      {summaryPoints.length > 0 && (
        <section className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg p-space-lg space-y-space-md">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[20px] text-primary-container">format_quote</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {isMr ? 'या दस्तऐवजात काय आहे' : 'What this document says'}
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-outline mt-1">
              {isMr ? 'सुलभ मराठी सारांश' : `Plain ${language === 'en' ? 'English' : 'Marathi'} summary`}
            </p>
          </div>

          <div className="bg-surface-container-high/60 border border-outline-variant p-space-lg rounded space-y-space-md">
            {summaryPoints.map((point, idx) => (
              <div key={idx}>
                {idx > 0 && <div className="h-px bg-outline-variant mb-space-md" />}
                <div className="flex items-start gap-space-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-primary-container text-on-primary font-code-md text-code-md font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                    {point.trim()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Key facts grid ─── */}
      {(parties || courtName || nextHearingDate || caseNumber) && (
        <section className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg p-space-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-md">
            {isMr ? 'महत्त्वाची माहिती' : 'Key Case Facts'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md border-t border-outline-variant pt-space-md">
            {parties && (
              <div className="flex flex-col gap-space-xxs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  {isMr ? 'पक्ष' : 'Parties'}
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  {Array.isArray(parties) ? parties.join(' vs ') : parties}
                </span>
              </div>
            )}
            {courtName && (
              <div className="flex flex-col gap-space-xxs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  {isMr ? 'न्यायालय' : 'Court'}
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  {courtName}
                </span>
              </div>
            )}
            {nextHearingDate && (
              <div className="flex flex-col gap-space-xxs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  {isMr ? 'पुढील तारीख' : 'Next Hearing'}
                </span>
                <span className="font-title-md text-title-md text-primary-container font-bold">
                  {nextHearingDate}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Upload timestamp ─── */}
      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline border-t border-outline-variant pt-space-md">
        <span className="material-symbols-outlined text-[16px]">history_edu</span>
        <span>Document uploaded {formattedDate}</span>
      </div>
    </div>
  );
}
