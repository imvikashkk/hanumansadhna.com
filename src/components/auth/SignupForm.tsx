'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { GENDERS, MAX_AGE, MIN_AGE, PHONE_RE, SANKALP_QUESTIONS, type GenderId } from '@/data/signup';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import Icon from '../Icon';
import { AuthCard, FormError, inputClass, labelClass } from './AuthShell';

export default function SignupForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<GenderId | ''>('');
  const [city, setCity] = useState('');
  const [sankalp, setSankalp] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loginHint, setLoginHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 1 = परिचय, 2 = संकल्प — split so the page stays short on phones.
  const [step, setStep] = useState<1 | 2>(1);

  const allTaken = SANKALP_QUESTIONS.every((q) => sankalp[q.id]);

  const ageNum = Number(age);

  function goTo(next: 1 | 2) {
    setError('');
    setLoginHint(false);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoginHint(false);

    if (step === 1) {
      if (!PHONE_RE.test(phone)) return setError('कृपया सही 10 अंकों का मोबाइल नंबर डालें');
      if (!name.trim()) return setError('कृपया अपना नाम डालें');
      if (!Number.isInteger(ageNum) || ageNum < MIN_AGE || ageNum > MAX_AGE) return setError(`उम्र ${MIN_AGE} से ${MAX_AGE} के बीच होनी चाहिए`);
      if (!gender) return setError('कृपया लिंग चुनें');
      if (!city.trim()) return setError('कृपया अपना शहर डालें');
      return goTo(2);
    }
    if (!allTaken) return setError('साधक बनने के लिए सभी संकल्प स्वीकार करें');

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, age: ageNum, gender, city, sankalp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
        setLoginHint(!!data.login);
        setSubmitting(false);
        return;
      }
      track('CompleteRegistration', PRODUCT_PARAMS);
      router.replace('/payment');
    } catch {
      setError('नेटवर्क में समस्या है, कृपया फिर कोशिश करें');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Steps step={step} onBack={() => goTo(1)} />

      {step === 1 ? (
        <AuthCard>
          <h2 className="font-display text-2xl text-[var(--maroon)]">आपका परिचय</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="phone" className={labelClass}>मोबाइल नंबर</label>
              <div className="flex">
                <span className="grid h-12 place-items-center rounded-l-xl border border-r-0 border-[var(--maroon)]/20 bg-[var(--cream-deep)] px-3 text-base font-semibold">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="10 अंकों का नंबर"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${inputClass} rounded-l-none`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>नाम</label>
              <input id="name" autoComplete="name" maxLength={100} placeholder="आपका पूरा नाम" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
              <div>
                <label htmlFor="age" className={labelClass}>उम्र</label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={MIN_AGE}
                  max={MAX_AGE}
                  placeholder="वर्ष"
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>शहर</label>
                <input id="city" autoComplete="address-level2" maxLength={100} placeholder="जैसे: वाराणसी" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>लिंग</legend>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <label
                    key={g.id}
                    className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border text-base font-semibold transition ${
                      gender === g.id
                        ? 'border-[var(--sindoor)] bg-[var(--sindoor)] text-white shadow-[0_10px_20px_-12px_var(--sindoor)]'
                        : 'border-[var(--maroon)]/20 bg-white hover:border-[var(--sindoor)]/60'
                    }`}
                  >
                    <input type="radio" name="gender" value={g.id} checked={gender === g.id} onChange={() => setGender(g.id)} className="sr-only" />
                    {g.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </AuthCard>
      ) : (
        <SankalpCard sankalp={sankalp} onToggle={(id, on) => setSankalp((s) => ({ ...s, [id]: on }))} />
      )}

      {error && (
        <FormError>
          {error}
          {loginHint && (
            <Link href="/login" className="ml-1 underline">
              Login करें →
            </Link>
          )}
        </FormError>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="cta-shine flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {submitting ? (
          'कृपया प्रतीक्षा करें…'
        ) : step === 1 ? (
          <>
            आगे बढ़ें — संकल्प लें <Icon name="arrowRight" />
          </>
        ) : (
          <>
            <Icon name="flame" /> साधक बनें और आगे बढ़ें <Icon name="arrowRight" />
          </>
        )}
      </button>
      {step === 2 && (
        <button type="button" onClick={() => goTo(1)} className="-mt-2 block w-full text-center text-sm font-semibold text-[var(--maroon)]/70 underline">
          ← परिचय बदलें
        </button>
      )}

      <div className="flex items-center gap-3 text-sm text-[var(--maroon)]/60" aria-hidden="true">
        <span className="h-px flex-1 bg-[var(--maroon)]/15" /> पहले से साधक हैं? <span className="h-px flex-1 bg-[var(--maroon)]/15" />
      </div>
      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--maroon)]/25 bg-white/70 text-base font-bold text-[var(--maroon)] transition hover:border-[var(--sindoor)] hover:text-[var(--sindoor)]"
      >
        <Icon name="lock" /> Login करें
      </Link>
    </form>
  );
}

function Steps({ step, onBack }: { step: 1 | 2; onBack: () => void }) {
  const items = ['आपका परिचय', 'साधक का संकल्प'];
  return (
    <ol className="flex items-center gap-2" aria-label={`चरण ${step} / 2`}>
      {items.map((label, i) => {
        const n = (i + 1) as 1 | 2;
        const done = n < step;
        const current = n === step;
        return (
          <li key={label} className="contents">
            {i > 0 && <span className={`h-0.5 flex-1 rounded-full ${step > 1 ? 'bg-[var(--sindoor)]' : 'bg-[var(--maroon)]/15'}`} aria-hidden="true" />}
            <button
              type="button"
              onClick={done ? onBack : undefined}
              disabled={!done}
              aria-current={current ? 'step' : undefined}
              className={`flex items-center gap-2 text-sm font-bold ${current || done ? 'text-[var(--maroon)]' : 'text-[var(--maroon)]/45'} ${done ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-sm ${
                  current ? 'border-[var(--sindoor)] bg-[var(--sindoor)] text-white shadow-[0_8px_18px_-8px_var(--sindoor)]' : done ? 'border-[var(--sindoor)] bg-white text-[var(--sindoor)]' : 'border-[var(--maroon)]/25 bg-white'
                }`}
              >
                {done ? <Icon name="check" /> : n}
              </span>
              {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';
const toDevanagari = (n: number) => String(n).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);

// Step 2 — a maroon-and-gold "mandir" panel: each sankalp gets a gold medallion, and one
// diya per sankalp lights up as it is taken.
function SankalpCard({ sankalp, onToggle }: { sankalp: Record<string, boolean>; onToggle: (id: string, on: boolean) => void }) {
  const taken = SANKALP_QUESTIONS.filter((q) => sankalp[q.id]).length;
  // The first sankalp not yet taken gets a soft gold pulse, so it's clear what to tap next.
  const nextId = SANKALP_QUESTIONS.find((q) => !sankalp[q.id])?.id;
  return (
    <div className="rounded-[1.8rem] bg-gradient-to-b from-[#fbe7a1] via-[#d9a43a] to-[#8a5a12] p-[2px] shadow-[0_35px_70px_-35px_var(--maroon)]">
      <div className="relative overflow-hidden rounded-[calc(1.8rem-2px)] bg-[radial-gradient(ellipse_at_top,oklch(0.36_0.13_32),oklch(0.22_0.08_28)_60%,oklch(0.16_0.05_28))] px-4 pb-6 pt-8 text-[#fff1cf] sm:px-7">
        <div className="bg-mandala pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-[#f7d77a]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] border border-[#f7d77a]/25" aria-hidden="true" />

        {/* heading — lotus medallion, gold title, chaupai */}
        <div className="relative text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] p-[2px] shadow-[0_0_30px_-6px_#f7d77a]">
            <span className="grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#9b2c1c,var(--maroon))] text-2xl text-[#f7d77a]">
              <Icon name="lotus" />
            </span>
          </span>
          <h2 className="mt-3 bg-gradient-to-b from-[#fffbe8] via-[#f7d77a] to-[#c98a1f] bg-clip-text font-display text-[2rem] leading-tight text-transparent [filter:drop-shadow(0_2px_0_#5a1a08)]">
            साधक का संकल्प
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-[#f7d77a]" aria-hidden="true">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#f7d77a]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#f7d77a]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#f7d77a]" />
          </div>
          <p className="mt-2 font-display text-lg text-[#f7d77a]/90">॥ राम काज कीन्हे बिनु मोहि कहाँ बिश्राम ॥</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#fff1cf]/70">हनुमान जी के सामने मन से ये संकल्प लें</p>
          <p className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#f7d77a]/40 bg-[#f7d77a]/10 px-3 py-1 text-[13px] font-semibold text-[#f7d77a]">
            <span aria-hidden="true">👇</span> हर संकल्प पर टैप करके स्वीकार करें
          </p>
        </div>

        <ul className="relative mt-6 space-y-3">
          {SANKALP_QUESTIONS.map((q, i) => {
            const checked = !!sankalp[q.id];
            return (
              <li key={q.id}>
                <label
                  className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition duration-300 ${
                    checked
                      ? 'border-[#f7d77a]/80 bg-gradient-to-r from-[#f7d77a]/20 to-[#f7d77a]/5 shadow-[0_0_28px_-10px_#f7d77a]'
                      : `border-[#f7d77a]/30 bg-black/20 hover:border-[#f7d77a]/60 ${q.id === nextId ? 'sankalp-nudge' : ''}`
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={(e) => onToggle(q.id, e.target.checked)} className="peer sr-only" />
                  {/* medallion: number → gold check once taken */}
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full p-[2px] transition duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#f7d77a] ${
                      checked ? 'bg-gradient-to-b from-[#fffbe8] to-[#c98a1f] shadow-[0_0_22px_-4px_#f7d77a]' : 'bg-gradient-to-b from-[#f7d77a]/60 to-[#8a5a12]/60'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`grid h-full w-full place-items-center rounded-full font-display text-xl transition duration-300 ${
                        checked ? 'bg-gradient-to-b from-[#f7d77a] to-[#d9a43a] text-[var(--maroon)]' : 'bg-[radial-gradient(circle_at_35%_30%,#7c2414,#3a0d06)] text-[#f7d77a]'
                      }`}
                    >
                      {checked ? <Icon name="check" /> : toDevanagari(i + 1)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[1.05rem] font-medium leading-snug transition ${checked ? 'text-[#fffbe8]' : 'text-[#fff1cf]/90'}`}>{q.text}</span>
                    {/* looks like a button so it's obvious the row is tappable */}
                    <span
                      className={`mt-2.5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition duration-300 ${
                        checked
                          ? 'border-transparent bg-gradient-to-b from-[#fbe7a1] to-[#d9a43a] text-[var(--maroon)] shadow-[0_6px_16px_-8px_#f7d77a]'
                          : 'border-[#f7d77a]/60 bg-[#f7d77a]/10 text-[#f7d77a] group-hover:bg-[#f7d77a]/20'
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 place-items-center rounded border-2 text-[10px] ${checked ? 'border-[var(--maroon)] bg-[var(--maroon)] text-[#f7d77a]' : 'border-[#f7d77a]'}`}
                        aria-hidden="true"
                      >
                        {checked && <Icon name="check" />}
                      </span>
                      {checked ? 'संकल्प लिया — जय श्री राम' : 'हाँ, मैं संकल्प लेता/लेती हूँ'}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* one diya per sankalp, lit as each is taken */}
        <div className="relative mt-6 flex flex-col items-center gap-2">
          <div className="flex items-end gap-5" aria-hidden="true">
            {SANKALP_QUESTIONS.map((q) => {
              const lit = !!sankalp[q.id];
              return (
                <span key={q.id} className="flex flex-col items-center">
                  <Icon
                    name="flame"
                    className={`text-xl transition duration-500 ${lit ? 'diya-flicker text-[#ffb547] drop-shadow-[0_0_10px_#ffb547]' : 'text-[#fff1cf]/20'}`}
                  />
                  <span className={`-mt-0.5 h-2.5 w-8 rounded-b-full transition ${lit ? 'bg-gradient-to-b from-[#f7d77a] to-[#b8781c]' : 'bg-[#fff1cf]/15'}`} />
                </span>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-[#fff1cf]/70">
            {taken === SANKALP_QUESTIONS.length
              ? 'सभी दीप प्रज्वलित — आप साधक बनने को तैयार हैं'
              : `${toDevanagari(taken)} / ${toDevanagari(SANKALP_QUESTIONS.length)} संकल्प — हर संकल्प से एक दीप जलेगा`}
          </p>
        </div>
      </div>
    </div>
  );
}
