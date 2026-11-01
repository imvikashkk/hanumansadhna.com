'use client';

import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';
import { SITE, whatsappLink } from '@/data/site';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import { PRODUCT_NAME, type Plan, type PlanId } from '@/lib/sadhana';
import Icon, { type IconName } from '../Icon';
import { AuthCard, FormError } from './AuthShell';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type PricedPlan = Plan & { fullPricePaise: number };

const PERKS: { icon: IconName; text: string }[] = [
  { icon: 'headphones', text: 'रोज़ नया audio मार्गदर्शन' },
  { icon: 'calendar', text: '40 दिन का प्रगति ट्रैकर' },
  { icon: 'certificate', text: 'साधना पूर्ण होने पर सर्टिफिकेट' },
  { icon: 'mobile', text: 'मोबाइल पर कहीं भी, कभी भी' },
];

export default function PaymentPanel({
  user,
  plans,
  defaultPlan,
  currentPlanLabel,
}: {
  user: { name: string | null; phone: string };
  plans: PricedPlan[];
  defaultPlan?: PlanId;
  currentPlanLabel?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId | undefined>(defaultPlan);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/signup');
  }

  // Already on the top plan — nothing left to buy.
  if (!plans.length || !selected) {
    return (
      <AuthCard>
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember text-3xl text-[var(--primary-foreground)] shadow-glow">
            <Icon name="check" />
          </span>
          <h2 className="mt-4 font-display text-3xl text-[var(--maroon)]">आपकी साधना सक्रिय है</h2>
          <p className="mt-2 text-base text-[var(--maroon)]/75">
            आपके पास <strong>{currentPlanLabel ?? 'साधना'}</strong> प्लान है। साधना से जुड़ी किसी भी मदद के लिए WhatsApp करें।
          </p>
          <a
            href={whatsappLink('नमस्ते, मैंने हनुमान साधना जॉइन की है — मुझे आगे मार्गदर्शन चाहिए')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 font-bold text-white"
          >
            <Icon name="whatsapp" /> WhatsApp पर बात करें
          </a>
          <button onClick={logout} className="mt-4 block w-full text-sm font-semibold text-[var(--maroon)]/60 underline">
            Logout
          </button>
        </div>
      </AuthCard>
    );
  }

  const plan = plans.find((p) => p.id === selected)!;

  async function pay() {
    setError('');
    if (!scriptLoaded || !window.Razorpay) {
      setError('भुगतान लोड हो रहा है, कृपया कुछ सेकंड में फिर कोशिश करें');
      return;
    }
    setPaying(true);
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });
      const order = await res.json();
      if (!res.ok) {
        setError(order.error || 'ऑर्डर बनाने में समस्या हुई');
        setPaying(false);
        return;
      }
      track('InitiateCheckout', { ...PRODUCT_PARAMS, value: order.amount / 100, currency: 'INR', placement: 'payment' });

      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: PRODUCT_NAME,
        description: plan.label,
        prefill: { name: user.name || undefined, contact: user.phone },
        theme: { color: '#e3572b' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (!verifyRes.ok) {
            setError('भुगतान सत्यापन में समस्या हुई, कृपया सहायता के लिए WhatsApp करें');
            setPaying(false);
            return;
          }
          track('Purchase', { ...PRODUCT_PARAMS, value: order.amount / 100, currency: 'INR' });
          router.replace(`/thank-you?${new URLSearchParams({ txn: response.razorpay_payment_id, plan: plan.id })}`);
        },
        modal: { ondismiss: () => setPaying(false) },
      }).open();
    } catch {
      setError('कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
      setPaying(false);
    }
  }

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} />

      <AuthCard>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--maroon)]/10 pb-4 text-sm">
          <span className="font-semibold">
            {user.name && <>{user.name} · </>}+91 {user.phone}
          </span>
          <button onClick={logout} className="font-semibold text-[var(--sindoor)] underline">
            नंबर या नाम बदलें
          </button>
        </div>

        <h2 className="mt-5 font-display text-2xl text-[var(--maroon)]">{plans.length > 1 ? 'अपना प्लान चुनें' : 'आपका प्लान'}</h2>
        {currentPlanLabel && (
          <p className="mt-1 text-sm text-[var(--maroon)]/70">
            आपके पास <strong>{currentPlanLabel}</strong> है — अपग्रेड करें:
          </p>
        )}

        <div className="mt-4 space-y-3" role="radiogroup">
          {plans.map((p) => {
            const on = p.id === selected;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSelected(p.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                  on ? 'border-[var(--sindoor)] bg-[#fff1e6] shadow-[0_14px_30px_-20px_var(--sindoor)]' : 'border-[var(--maroon)]/15 bg-white hover:border-[var(--gold)]'
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-[var(--sindoor)]' : 'border-[var(--maroon)]/30'}`}>
                  {on && <span className="h-3 w-3 rounded-full bg-[var(--sindoor)]" />}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-lg font-bold">
                    {p.label}
                    {p.id === defaultPlan && plans.length > 1 && (
                      <span className="rounded-full bg-ember px-2 py-0.5 text-xs font-bold text-[var(--primary-foreground)]">लोकप्रिय</span>
                    )}
                  </span>
                  <span className="block text-sm text-[var(--maroon)]/70">{p.tagline}</span>
                </span>
                <span className="shrink-0 text-right">
                  {p.pricePaise !== p.fullPricePaise && <span className="block text-sm text-[var(--maroon)]/40 line-through">₹{p.fullPricePaise / 100}</span>}
                  <span className="block font-display text-2xl text-[var(--sindoor)]">₹{p.pricePaise / 100}</span>
                </span>
              </button>
            );
          })}
        </div>

        {error && <div className="mt-4"><FormError>{error}</FormError></div>}

        <button
          onClick={pay}
          disabled={paying}
          className="cta-shine mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
        >
          {paying ? 'कृपया प्रतीक्षा करें…' : <>₹{plan.pricePaise / 100} का भुगतान करें <Icon name="arrowRight" /></>}
        </button>
        <p className="mt-3 text-center text-sm text-[var(--maroon)]/70">UPI · GPay · PhonePe · Paytm · Card · Netbanking</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[var(--maroon)]/50">
          <Icon name="lock" /> Razorpay द्वारा 100% सुरक्षित भुगतान
        </p>
      </AuthCard>

      <div className="grid grid-cols-2 gap-3">
        {PERKS.map((p) => (
          <div key={p.text} className="flex items-center gap-3 rounded-2xl border border-[var(--gold)]/40 bg-white/70 p-3 text-sm font-semibold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ember text-lg text-[var(--primary-foreground)]">
              <Icon name={p.icon} />
            </span>
            {p.text}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-[var(--maroon)]/70">
        भुगतान में समस्या?{' '}
        <a href={whatsappLink('नमस्ते, मुझे भुगतान में समस्या आ रही है')} target="_blank" rel="noopener noreferrer" className="font-bold text-[#128c4a] underline">
          WhatsApp पर मदद लें ({SITE.whatsappDisplay})
        </a>
      </p>
    </div>
  );
}
