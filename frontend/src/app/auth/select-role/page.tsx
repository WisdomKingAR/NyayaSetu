import { RoleSelector } from '@/features/auth/components/RoleSelector';

export default function SelectRolePage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md py-space-2xl">
      <RoleSelector />
    </main>
  );
}
