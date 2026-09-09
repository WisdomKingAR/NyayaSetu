'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { signOut as apiSignOut } from '@/lib/apiClient';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const DOCKETS_NAV: NavItem[] = [
  { label: 'My Case (Litigant)', href: '/dashboard', icon: 'person_outline' },
  { label: 'Case Files (Advocate)', href: '/dashboard?view=advocate', icon: 'folder_copy' },
  { label: 'Upload Document', href: '/upload', icon: 'upload_file' },
];

const RECORDS_NAV: NavItem[] = [
  { label: 'All Documents', href: '/dashboard#documents', icon: 'description' },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-space-xs py-space-xs px-space-xs rounded transition-colors text-label-lg font-label-lg ${
        isActive
          ? 'text-primary-container font-semibold bg-surface-container-low border-l-4 border-primary-container pl-[calc(0.25rem-4px)]'
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && (
        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
      )}
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await apiSignOut();
    } catch {
      // ignore
    } finally {
      signOut();
      router.push('/');
    }
  };

  return (
    <aside className="w-64 fixed top-16 bottom-0 left-0 bg-surface-container-lowest border-r border-outline-variant overflow-y-auto hidden md:flex flex-col justify-between p-space-md">
      <div className="flex flex-col gap-space-lg">

        {/* ─── Dockets & Portals ─── */}
        <div>
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-space-xs">
            Dockets &amp; Portals
          </span>
          <nav className="flex flex-col gap-space-xs">
            {DOCKETS_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href || pathname?.startsWith(item.href + '?')}
              />
            ))}
          </nav>
        </div>

        {/* ─── Case Records ─── */}
        <div>
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-space-xs">
            Case Records
          </span>
          <nav className="flex flex-col gap-space-xs">
            {RECORDS_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname?.startsWith('/documents')}
              />
            ))}
          </nav>
        </div>

      </div>

      {/* ─── Bottom footer ─── */}
      <div className="border-t border-outline-variant pt-space-md flex flex-col gap-space-xs">
        <Link
          href="/auth/select-role"
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-container transition-colors py-space-xs"
        >
          Change Access Role
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="font-label-sm text-label-sm text-error hover:underline py-space-xs text-left"
        >
          End Session (Log Out)
        </button>
      </div>
    </aside>
  );
}

/** Wraps authenticated pages with the sidebar layout */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 bg-surface md:pl-64 min-w-0">
        {children}
      </main>
    </div>
  );
}
