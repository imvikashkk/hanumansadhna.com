import Image from 'next/image';
import { SADHAK_PILLARS } from '@/data/content';
import { SECTION_BG } from '@/data/media';
import { SITE } from '@/data/site';
import CreamDecor from './CreamDecor';
import Icon from './Icon';
import PillarMotif from './PillarMotif';
import { Reveal } from './Reveal';

// "हम हैं हनुमान साधक" — who we are, in the brand's own voice.
export default function AboutSection() {
  return (
    <section id="parichay" className="relative isolate overflow-hidden text-[var(--maroon)]" aria-labelledby="about-heading">
      {/* same light chandan-cream band as the one below the hero */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[var(--cream)] to-[var(--cream-deep)]" aria-hidden="true" />
      <CreamDecor />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-ember" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Picture with a seal */}
          <Reveal className="relative order-2 mx-auto w-full max-w-[17rem] sm:max-w-sm lg:order-1">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-ember opacity-20 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[2rem] p-[2px]">
              <div className="border-sweep absolute inset-0 rounded-[2rem]" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-[var(--card)]">
                <Image src={SECTION_BG.about} alt="हृदय में सिया-राम — राम भक्त हनुमान जी" placeholder="blur" sizes="(min-width: 1024px) 384px, 272px" className="h-auto w-full" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 text-center">
                  <p className="font-display text-lg leading-snug text-[var(--gold)] sm:text-xl">॥ राम दुआरे तुम रखवारे ॥</p>
                </div>
              </div>
            </div>
            {/* seal */}
            <div className="absolute -right-3 -top-4 grid h-24 w-24 animate-float place-items-center rounded-full border-2 border-[var(--gold)] bg-[var(--background)] text-center shadow-glow sm:-right-6 sm:h-28 sm:w-28">
              <span className="animate-spin-slow absolute inset-1.5 rounded-full border border-dashed border-[var(--gold)]/60" aria-hidden="true" />
              <span className="leading-tight">
                <span className="block font-display text-lg text-ember sm:text-2xl">{SITE.devotees}</span>
                <span className="block text-[11px] font-semibold text-[var(--gold)] sm:text-xs">साधक परिवार</span>
              </span>
            </div>
          </Reveal>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <Reveal>
              <p className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--sindoor)]">
                <span className="text-[var(--primary)]" aria-hidden="true">✦</span>
                हमारा परिचय
                <span className="text-[var(--primary)]" aria-hidden="true">✦</span>
              </p>
              <h2 id="about-heading" className="mt-2 font-display text-[2.2rem] leading-tight text-[var(--maroon)] sm:text-5xl">
                हम हैं <span className="text-[var(--sindoor)]">हनुमान साधक</span>
              </h2>
              <p className="mt-2 font-display text-xl text-[var(--primary)] sm:text-2xl">भक्ति को रोज़ की शक्ति बनाने वाला परिवार</p>

              <div className="mx-auto mt-5 max-w-xl space-y-4 text-[1.05rem] leading-relaxed text-[var(--maroon)]/80 sm:text-lg lg:mx-0">
                <p>
                  <strong className="text-[var(--maroon)]">“साधक”</strong> वो है जो रोज़ थोड़ा-थोड़ा करके अपने इष्ट के करीब जाता
                  है। हनुमान साधक इसी भाव से बना है — ताकि हर भक्त, चाहे कितना भी व्यस्त हो, घर बैठे हनुमान जी की नियमित
                  स्तुति कर सके।
                </p>
                <p>
                  न मंदिर जाने की भागदौड़, न कठिन नियम — बस आपका मोबाइल, एक दीपक और{' '}
                  <strong className="text-[var(--sindoor)]">10 मिनट की श्रद्धा</strong>। रोज़ का audio मार्गदर्शन आपको संकल्प से लेकर
                  40वें दिन की पूर्णता तक साथ लेकर चलता है।
                </p>
              </div>

              <blockquote className="mx-auto mt-6 max-w-xl rounded-2xl border border-[var(--maroon)]/10 border-l-4 border-l-[var(--sindoor)] bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm text-left lg:mx-0">
                <p className="text-sm font-semibold text-[var(--sindoor)]">हमारा संकल्प</p>
                <p className="mt-1 font-display text-xl text-[var(--maroon)] sm:text-2xl">हर घर में हनुमान चालीसा, हर मन में राम।</p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Four pillars of a sadhak */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SADHAK_PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="group relative flex h-full min-h-52 flex-col justify-end overflow-hidden rounded-3xl border border-[var(--gold)]/50 bg-gradient-to-br from-white via-[#fff6e8] to-[#fbe3c4] p-4 shadow-[0_22px_45px_-30px_var(--maroon)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--gold)] sm:min-h-60 sm:p-5">
                <PillarMotif index={i} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fff6e8] via-[#fff6e8]/40 to-transparent" />
                <div className="relative">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember text-xl text-[var(--primary-foreground)] shadow-glow sm:h-11 sm:w-11">
                    <Icon name={p.icon} />
                  </span>
                  <h3 className="mt-2 font-display text-2xl text-[var(--maroon)]">{p.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-[var(--maroon)]/75 sm:text-base">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
