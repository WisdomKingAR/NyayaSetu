import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md py-space-xl">
      <LoginForm />
    </main>
  );
}
