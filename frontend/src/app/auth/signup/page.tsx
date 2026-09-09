import { SignupForm } from '@/features/auth/components/SignupForm';

export default function SignUpPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center p-space-md py-space-xl">
      <SignupForm />
    </main>
  );
}
