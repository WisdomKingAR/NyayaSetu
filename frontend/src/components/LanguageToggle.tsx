'use client';

import { useUIStore } from '@/stores/ui.store';

interface LanguageToggleProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function LanguageToggle({
  size = 'md',
  className = '',
}: LanguageToggleProps) {
  const { language, setLanguage } = useUIStore();

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center p-1 bg-surface-container-high rounded border border-outline-variant ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        id="lang-toggle-en"
        onClick={() => setLanguage('en')}
        className={`rounded transition-all font-semibold ${
          isSmall
            ? 'px-space-sm py-0.5 font-label-sm text-label-sm'
            : 'px-space-md py-1 font-label-md text-label-md'
        } ${
          language === 'en'
            ? 'bg-primary-container text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        type="button"
        id="lang-toggle-mr"
        onClick={() => setLanguage('mr')}
        className={`rounded transition-all font-semibold ${
          isSmall
            ? 'px-space-sm py-0.5 font-label-sm text-label-sm'
            : 'px-space-md py-1 font-label-md text-label-md'
        } ${
          language === 'mr'
            ? 'bg-primary-container text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
        aria-pressed={language === 'mr'}
      >
        मराठी
      </button>
    </div>
  );
}
