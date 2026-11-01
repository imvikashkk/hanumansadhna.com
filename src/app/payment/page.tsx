import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import PaymentPanel from '@/components/auth/PaymentPanel';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { canPurchase, DEFAULT_PLAN, PLAN_ORDER, PLANS, purchasePricePaise } from '@/lib/sadhana';
import { getSubscription } from '@/lib/subscriptions';

export const metadata: Metadata = {
  title: 'भुगतान',
  robots: { index: false },
};

interface UserRow { name: string | null; phone: string }

export default async function PaymentPage() {
  const session = await getSession();
  if (!session) redirect('/signup');

  await migrate();
  const users = await query<UserRow>(`SELECT name, phone FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) redirect('/signup');
  const user = users[0];
  const sub = await getSubscription(session.userId);

  const available = PLAN_ORDER.filter((p) => canPurchase(p, sub));
  const plans = available.map((id) => ({ ...PLANS[id], pricePaise: purchasePricePaise(id, sub), fullPricePaise: PLANS[id].pricePaise }));

  return (
    <AuthShell
      ribbon="अंतिम चरण"
      ribbonIcon="lock"
      width="max-w-2xl"
      title={
        <>
          {user.name ? `${user.name} जी, ` : ''}
          <span className="text-[var(--sindoor)]">जय श्री राम</span>
        </>
      }
      sub={available.length ? 'अपना प्लान चुनें और भुगतान करके साधना शुरू करें।' : undefined}
    >
      <PaymentPanel
        user={user}
        plans={plans}
        defaultPlan={available.includes(DEFAULT_PLAN) ? DEFAULT_PLAN : available[0]}
        currentPlanLabel={sub ? PLANS[sub.plan]?.label : undefined}
      />
    </AuthShell>
  );
}
