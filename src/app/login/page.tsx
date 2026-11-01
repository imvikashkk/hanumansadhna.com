import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      ribbon="साधक Login"
      ribbonIcon="lock"
      title={
        <>
          फिर से <span className="text-[var(--sindoor)]">स्वागत है</span>
        </>
      }
      sub="अपना रजिस्टर किया हुआ मोबाइल नंबर डालें — OTP से Login करें।"
    >
      <LoginForm />
    </AuthShell>
  );
}
