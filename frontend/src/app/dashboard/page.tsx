'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';
import { CitizenDashboardView } from '@/features/documents/components/CitizenDashboardView';
import { AdvocateDashboardView } from '@/features/documents/components/AdvocateDashboardView';

function DashboardContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');

  // Determine active view: query param overrides, fallback to user role
  const isAdvocate = viewParam ? viewParam === 'advocate' : user?.role === 'advocate';

  return isAdvocate ? <AdvocateDashboardView /> : <CitizenDashboardView />;
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
        <Sidebar />
        <main className="flex-1 md:pl-64 min-w-0 overflow-y-auto">
          <Suspense
            fallback={
              <div className="p-16 text-center text-outline">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary-container mb-2">
                  progress_activity
                </span>
                <p className="font-body-md text-on-surface">Loading docket view...</p>
              </div>
            }
          >
            <DashboardContent />
          </Suspense>
        </main>
      </div>
    </AuthGuard>
  );
}
