import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';
import SignupAside from '@/components/auth/SignupAside';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'साधक बनें — Signup',
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      ribbon="40 दिन की साधना"
      title={
        <>
          हनुमान <span className="text-[var(--sindoor)]">साधक बनें</span>
        </>
      }
      sub="अपना परिचय दें, संकल्प लें — और आज से अपनी साधना शुरू करें।"
      aside={<SignupAside />}
    >
      <SignupForm />
    </AuthShell>
  );
}
