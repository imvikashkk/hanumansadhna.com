import Image from 'next/image';
import { SECTION_BG } from '@/data/media';
import { SITE } from '@/data/site';
import Icon, { type IconName } from '../Icon';

const PERKS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'headphones', title: 'रोज़ नया मार्गदर्शन', text: 'हर दिन का audio — क्या पढ़ें, कैसे बैठें' },
  { icon: 'clock', title: 'सिर्फ 10 मिनट रोज़', text: 'घर बैठे, अपने मोबाइल पर' },
  { icon: 'calendar', title: '40 दिन का संकल्प', text: 'हर दिन की प्रगति का हिसाब' },
  { icon: 'certificate', title: 'साधना सर्टिफिकेट', text: '40 दिन पूरे होने पर' },
];

const STATS = [
  { value: SITE.devotees, label: 'साधक' },
  { value: `${SITE.rating}★`, label: 'रेटिंग' },
  { value: '100%', label: 'सुरक्षित' },
];

// Desktop-only left column of the signup page: darshan, what the sadhana gives, trust.
export default function SignupAside() {
  return (
    <div className="rounded-[1.8rem] bg-gradient-to-b from-[#fbe7a1] via-[#d9a43a] to-[#8a5a12] p-[2px] shadow-[0_35px_70px_-35px_var(--maroon)]">
      <div className="relative overflow-hidden rounded-[calc(1.8rem-2px)] bg-[radial-gradient(ellipse_at_top,oklch(0.36_0.13_32),oklch(0.22_0.08_28)_60%,oklch(0.16_0.05_28))] text-[#fff1cf]">
        <div className="bg-mandala pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />

        {/* darshan with the chaupai over it */}
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image src={SECTION_BG.about} alt="राम भक्त हनुमान जी" fill placeholder="blur" sizes="480px" className="object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.08_28)] via-[oklch(0.22_0.08_28)/0.2] to-transparent" />
          <p className="absolute inset-x-0 bottom-4 text-center font-display text-2xl leading-snug text-[#f7d77a] [text-shadow:0_2px_12px_black]">
            ॥ जय जय जय हनुमान गोसाईं ॥
            <span className="block text-base text-[#fff1cf]/85">कृपा करहु गुरुदेव की नाईं</span>
          </p>
        </div>

        <div className="relative px-6 pb-6 pt-5">
          <p className="flex items-center gap-3 font-display text-xl text-[#f7d77a]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#f7d77a]/70" aria-hidden="true" />
            साधना में आपको मिलेगा
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f7d77a]/70" aria-hidden="true" />
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {PERKS.map((p) => (
              <li key={p.title} className="flex gap-3 rounded-2xl border border-[#f7d77a]/20 bg-black/20 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] text-lg text-[var(--maroon)]">
                  <Icon name={p.icon} />
                </span>
                <span className="leading-snug">
                  <span className="block text-[15px] font-bold text-[#fffbe8]">{p.title}</span>
                  <span className="block text-[13px] text-[#fff1cf]/65">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-3 divide-x divide-[#f7d77a]/20 rounded-2xl border border-[#f7d77a]/30 bg-[#f7d77a]/[0.06] py-3 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl text-[#f7d77a]">{s.value}</p>
                <p className="text-xs font-semibold text-[#fff1cf]/65">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
