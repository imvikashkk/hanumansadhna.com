// Devotional line motifs for the four "साधक" pillar cards (light cards):
// a lit diya, a rudraksha mala, ॐ and a temple shikhar. Drawn in sindoor/gold
// so they sit softly behind the card text.

function Diya() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="pm-glow">
          <stop offset="0" stopColor="#ffd36b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pm-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ea580c" />
          <stop offset="0.6" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="48" r="34" fill="url(#pm-glow)" />
      <path className="diya-flicker" d="M60 16C70 31 72 44 60 58 48 44 50 31 60 16Z" fill="url(#pm-flame)" />
      <path d="M60 34c4 6 4 13 0 19-4-6-4-13 0-19Z" fill="#fff7d6" />
      {/* lotus under the diya */}
      <g fill="none" stroke="#c2410c" strokeWidth="1.6">
        <path d="M60 100c-8-6-10-14-10-20 6 2 10 8 10 20Zm0 0c8-6 10-14 10-20-6 2-10 8-10 20Z" />
        <path d="M60 100c-14-1-24-7-28-16 8-1 16 3 22 10m6 6c14-1 24-7 28-16-8-1-16 3-22 10" />
      </g>
      <path d="M26 66h68c-3 14-16 24-34 24S29 80 26 66Z" fill="#b91c1c" />
      <path d="M26 66h68" stroke="#7c2d12" strokeWidth="2" />
      <path d="M36 74h48" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

function Mala() {
  const beads = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2 - Math.PI / 2;
    return { x: 60 + Math.cos(a) * 40, y: 54 + Math.sin(a) * 40 };
  });
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="54" r="40" fill="none" stroke="#b45309" strokeWidth="0.8" strokeDasharray="2 3" />
      {beads.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.6" fill="#9a3412" />
          <circle cx={x - 1.3} cy={y - 1.3} r="1.4" fill="#fdba74" />
        </g>
      ))}
      {/* guru bead + tassel */}
      <circle cx="60" cy="98" r="5.5" fill="#b91c1c" />
      <path d="M60 103v12M56 104l-3 11M64 104l3 11" stroke="#b91c1c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Om() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="60" r="44" fill="none" stroke="#c2410c" strokeWidth="1" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#c2410c" strokeWidth="0.6" strokeDasharray="1.5 3" />
      <text x="60" y="84" textAnchor="middle" fontSize="74" fill="#c2410c" style={{ fontFamily: 'var(--font-rozha), serif' }}>
        ॐ
      </text>
    </svg>
  );
}

function Mandir() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      {/* flag on the kalash */}
      <path d="M60 6v20" stroke="#7c2d12" strokeWidth="1.4" />
      <path d="M60 7l18 5-18 6Z" fill="#ea580c" />
      <circle cx="60" cy="29" r="3.5" fill="#d97706" />
      {/* shikhar */}
      <path d="M60 32c-8 10-16 24-20 44h40c-4-20-12-34-20-44Z" fill="#c2410c" fillOpacity="0.85" />
      <path d="M60 32v44M50 50h20M45 63h30" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.8" />
      {/* side shikhars */}
      <path d="M30 76c2-10 6-17 10-22 4 5 6 12 7 22Z M90 76c-2-10-6-17-10-22-4 5-6 12-7 22Z" fill="#ea580c" fillOpacity="0.75" />
      {/* mandap with an arched door */}
      <path d="M24 76h72v30H24Z" fill="#b91c1c" fillOpacity="0.85" />
      <path d="M52 106V92a8 8 0 0 1 16 0v14Z" fill="#fde68a" />
      <path d="M18 106h84" stroke="#7c2d12" strokeWidth="2.5" />
    </svg>
  );
}

const MOTIFS = [Diya, Mala, Om, Mandir];

export default function PillarMotif({ index }: { index: number }) {
  const Motif = MOTIFS[index % MOTIFS.length];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* golden rays behind the motif */}
      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[repeating-conic-gradient(from_0deg,rgb(217_119_6/0.16)_0deg_5deg,transparent_5deg_15deg)] [mask-image:radial-gradient(circle,black_25%,transparent_70%)] transition-transform duration-[2s] group-hover:rotate-45" />
      <div className="absolute right-3 top-3 h-20 w-20 opacity-45 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 sm:h-32 sm:w-32">
        <Motif />
      </div>
      {/* dotted gold inner border */}
      <div className="absolute inset-2 rounded-[1.25rem] border border-dashed border-[var(--gold)]/60" />
    </div>
  );
}
