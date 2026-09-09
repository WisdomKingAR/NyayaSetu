'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { signOut as apiSignOut } from '@/lib/apiClient';

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { language, setLanguage } = useUIStore();

  const isAuthPage = pathname?.startsWith('/auth');
  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    try {
      await apiSignOut();
    } catch {
      // ignore API errors on sign out
    } finally {
      signOut();
      router.push('/');
    }
  };

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b-2 border-primary-container h-16">
      <div className="max-w-max-container mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between">

        {/* ─── Brand ─── */}
        <div className="flex items-center gap-space-md">
          <Link href="/" className="flex items-center gap-space-sm">
            <span className="font-headline-md text-headline-md font-bold text-primary-container tracking-tight">
              NyayaSetu
            </span>
            <div className="h-4 w-px bg-outline-variant hidden sm:block" />
            <span className="hidden sm:inline-block font-body-sm text-body-sm text-outline font-normal">
              न्यायसेतु — Understand Your Court Case
            </span>
          </Link>
        </div>

        {/* ─── Right side ─── */}
        <div className="flex items-center gap-space-lg">

          {isAuthenticated ? (
            /* ── Authenticated nav ── */
            <>
              {/* Language toggle */}
              <div className="flex items-center border border-outline-variant rounded px-space-xs py-0.5 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-space-xs font-semibold transition-colors ${
                    language === 'en' ? 'text-primary-container' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  EN
                </button>
                <span className="text-outline-variant">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`px-space-xs transition-colors ${
                    language === 'mr' ? 'text-primary-container font-semibold' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  मराठी
                </button>
              </div>

              {/* Upload Docket CTA */}
              <Link
                href="/upload"
                className="bg-primary-container text-on-primary font-label-lg text-label-lg px-space-md py-space-xs rounded hover:bg-primary transition-colors inline-flex items-center justify-center"
              >
                Upload Docket
              </Link>

              {/* User avatar + role switcher */}
              <div className="flex items-center gap-space-xs pl-space-sm border-l border-outline-variant">
                <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary-container font-title-md text-title-md select-none">
                  {userInitials}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface leading-tight">
                    {user.fullName ?? user.email}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="ml-space-xs font-label-sm text-label-sm text-outline hover:text-primary-container transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : isAuthPage ? (
            /* ── Minimal auth-page nav ── */
            <Link
              href="/"
              className="font-label-sm text-label-sm text-outline hover:text-primary-container transition-colors"
            >
              Return to Portal
            </Link>
          ) : (
            /* ── Public landing nav ── */
            <>
              <nav className="hidden sm:flex items-center gap-space-md">
                <Link
                  href="/#how-it-works"
                  className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  How it works
                </Link>
              </nav>

              <div className="flex items-center gap-space-sm pl-space-sm border-l border-outline-variant">
                <Link
                  href="/auth/login"
                  className="font-label-lg text-label-lg text-primary-container hover:text-primary transition-colors px-space-xs py-space-xs"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-container text-on-primary font-label-lg text-label-lg px-space-md py-space-xs rounded-lg hover:bg-primary transition-colors inline-flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
