'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait until zustand has hydrated from localStorage
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/auth/login');
    }
  }, [isHydrated, accessToken, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">
            progress_activity
          </span>
          <p className="text-body-sm text-outline font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
