import Image, { type StaticImageData } from 'next/image';
import Icon, { type IconName } from './Icon';

// "यह साधना क्यों करें?" card, styled like a temple door: an ogee-arched photo
// with hanging bells, a numbered star badge, gold filigree corners and a
// maroon chaupai ribbon.

export type WhyCardData = { icon: IconName; label: string; text: string; chaupai: string; image: StaticImageData };

// Shared clip path (objectBoundingBox, so they scale with the photo) + bell gradient. Render once per page.
export function WhyCardDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        {/* temple-shikhar top, gently rising bottom where the icon sits */}
        <clipPath id="why-arch" clipPathUnits="objectBoundingBox">
          <path d="M0 0.95 L0 0.2 C0 0.13 0.06 0.11 0.15 0.11 C0.3 0.11 0.38 0.07 0.5 0 C0.62 0.07 0.7 0.11 0.85 0.11 C0.94 0.11 1 0.13 1 0.2 L1 0.95 Q0.5 0.8 0 0.95 Z" />
        </clipPath>
        <linearGradient id="bell-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#b77a14" />
          <stop offset="0.45" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b77a14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Bell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 44" className={`bell-swing w-5 drop-shadow-[0_2px_3px_rgb(0_0_0/0.5)] sm:w-6 ${className}`} aria-hidden="true">
      <line x1="10" y1="0" x2="10" y2="16" stroke="#e8b84a" strokeWidth="1.2" strokeDasharray="2 1.5" />
      <circle cx="10" cy="17" r="2" fill="#e8b84a" />
      <path d="M10 18c-4 0-5.5 4-5.5 9.5 0 3-1.5 4.5-2.5 5.5h16c-1-1-2.5-2.5-2.5-5.5C15.5 22 14 18 10 18z" fill="url(#bell-gold)" stroke="#8a5a12" strokeWidth="0.6" />
      <rect x="1.5" y="33" width="17" height="2.2" rx="1.1" fill="#c8901e" />
      <circle cx="10" cy="38" r="2.2" fill="#c8901e" />
    </svg>
  );
}

// A small gold curl for the card's corners; rotate it for each corner.
export function Corner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" className={`absolute h-9 w-9 text-[var(--gold)] ${className}`} aria-hidden="true">
      <path d="M3 37V16C3 8.8 8.8 3 16 3h21" />
      <path d="M8 37V18c0-5.5 4.5-10 10-10h19" strokeOpacity="0.55" />
      <path d="M14 24c0-5.5 4.5-10 10-10 3 0 5 2 5 4.5S27 23 24.5 23 21 21 21 19" />
      <circle cx="3" cy="37" r="1.6" fill="currentColor" />
      <circle cx="37" cy="3" r="1.6" fill="currentColor" />
    </svg>
  );
}

function StarBadge({ n }: { n: number }) {
  return (
    <span className="absolute left-1/2 top-0 z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center">
      <span className="absolute inset-1.5 rotate-45 rounded-md border-2 border-[var(--gold)] bg-[var(--maroon)]" />
      <span className="absolute inset-1.5 rounded-md border-2 border-[var(--gold)] bg-[var(--maroon)]" />
      <span className="absolute inset-3 rounded-full border border-[var(--gold)]/50" />
      <span className="relative font-display text-lg text-[var(--gold)]">{String(n).padStart(2, '0')}</span>
    </span>
  );
}

export default function WhyCard({ icon, label, text, chaupai, image, index }: WhyCardData & { index: number }) {
  return (
    <div className="group relative mx-auto h-full w-full max-w-[19rem] pt-7">
      {/* gold frame */}
      <div className="relative flex h-full flex-col rounded-[1.6rem] bg-gradient-to-b from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_28px_60px_-34px_var(--maroon)] transition-transform duration-500 group-hover:-translate-y-2">
        <div className="relative flex flex-1 flex-col rounded-[calc(1.6rem-2px)] bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_55%,#f6e6cc)] px-3 pb-4 pt-3">
          {/* inner hairline */}
          <div className="pointer-events-none absolute inset-1.5 rounded-[1.35rem] border border-[var(--gold)]/45" />
          <Corner className="bottom-1 left-1" />
          <Corner className="bottom-1 right-1 -scale-x-100" />

          {/* arched photo with a gold edge */}
          <div className="relative -mt-9">
            <div className="aspect-[1/1.02] bg-gradient-to-b from-[#ffe9a8] via-[#d9a43a] to-[#b8781c] p-[3px] [clip-path:url(#why-arch)]">
              <div className="relative h-full w-full overflow-hidden [clip-path:url(#why-arch)]">
                <Image
                  src={image}
                  alt={label}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 300px, (min-width: 480px) 45vw, 90vw"
                  className="object-cover object-top transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--maroon)]/35 via-transparent to-transparent" />
              </div>
            </div>
            <StarBadge n={index + 1} />
            <Bell className="absolute left-[12%] top-[11%] origin-top" />
            <Bell className="absolute right-[12%] top-[11%] origin-top [animation-delay:-1.4s]" />

            {/* icon in a maroon medallion, sitting on the arch's lower edge */}
            <span className="absolute bottom-0 left-1/2 grid h-[4.5rem] w-[4.5rem] -translate-x-1/2 translate-y-1/3 place-items-center rounded-full bg-gradient-to-b from-[#f7d77a] to-[#b8781c] p-[3px] shadow-[0_8px_20px_-6px_var(--maroon)]">
              <span className="grid h-full w-full place-items-center rounded-full border-2 border-[var(--cream)] bg-[radial-gradient(circle_at_35%_30%,#9b2c1c,var(--maroon))] text-[1.9rem] text-[#f7d77a] transition-transform duration-700 group-hover:rotate-[360deg]">
                <Icon name={icon} />
              </span>
            </span>
          </div>

          <div className="relative flex flex-1 flex-col px-2 pt-10 text-center">
            <p className="font-display text-[1.6rem] leading-tight text-[var(--maroon)]">{label}</p>
            <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-[var(--maroon)]/80">{text}</p>

            <div className="mt-4 flex items-center gap-2 text-[var(--primary)]" aria-hidden="true">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--gold)]" />
              <Icon name="lotus" className="text-lg" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--gold)]" />
            </div>

            {/* chaupai ribbon with a lotus at each end */}
            <div className="relative mx-1 mt-3">
              <p className="rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-7 py-2 font-display text-[0.95rem] text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
                ॥ {chaupai} ॥
              </p>
              <span className="absolute -left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)] bg-[var(--cream)] text-lg text-[var(--sindoor)]">
                <Icon name="lotus" />
              </span>
              <span className="absolute -right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)] bg-[var(--cream)] text-lg text-[var(--sindoor)]">
                <Icon name="lotus" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
