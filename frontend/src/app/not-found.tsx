import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md">
      <div className="flex flex-col w-full items-center justify-center py-space-xl">
        <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-[6px] p-8 sm:p-10 text-center shadow-sm">
          {/* Dignified Institutional Seal */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center p-3">
              <svg className="w-12 h-12 text-primary-container stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 54H52"></path>
                <path d="M16 58H48"></path>
                <path d="M20 54V46H44V54"></path>
                <line x1="32" x2="32" y1="12" y2="46"></line>
                <line x1="32" x2="32" y1="8" y2="12"></line>
                <circle cx="32" cy="8" r="2.5"></circle>
                <path d="M18 18H46"></path>
                <line x1="18" x2="12" y1="18" y2="28"></line>
                <line x1="18" x2="24" y1="18" y2="28"></line>
                <path d="M10 28C10 32.4183 13.5817 34 18 34C22.4183 34 26 32.4183 26 28H10Z"></path>
                <line x1="46" x2="40" y1="18" y2="28"></line>
                <line x1="46" x2="52" y1="18" y2="28"></line>
                <path d="M38 28C38 32.4183 41.5817 34 46 34C50.4183 34 54 32.4183 54 28H38Z"></path>
                <path d="M28 40H36"></path>
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-4 bg-surface-container border border-outline-variant rounded-[2px]">
            <span className="material-symbols-outlined text-outline text-[14px]">folder_off</span>
            <span className="font-code-md text-on-surface-variant uppercase tracking-wider text-[11px]">Record Unavailable</span>
          </div>

          <h1 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight mb-3">
            We Couldn&apos;t Find That Page
          </h1>

          <p className="font-body-md text-body-md text-outline max-w-md mx-auto mb-8 leading-relaxed">
            The page or court document you are looking for may have moved, expired, or the link might be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-6">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded bg-primary-container hover:bg-primary text-on-primary font-label-lg transition-colors duration-150"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">dashboard</span>
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded bg-surface-container-lowest hover:bg-surface-container-low text-primary-container border border-primary-container font-label-lg transition-colors duration-150"
            >
              Return to Home Page
            </Link>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-outline text-[13px]">gavel</span>
            <span className="font-code-md text-outline text-[11px] tracking-widest uppercase select-all">
              Notice Ref: 404-DOCKET-NOT-FOUND
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
