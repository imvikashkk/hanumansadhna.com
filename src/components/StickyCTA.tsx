'use client';

import Image from 'next/image';
import logo from '@/assets/hanuman_sadhak_logo.png';
import { useEffect, useState } from 'react';
import { SITE, whatsappLink } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import Icon from './Icon';

// Mobile: a bottom bar with the CTA once the hero button scrolls away.
// Desktop: a floating WhatsApp help button.
export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 sm:hidden ${show ? 'translate-y-0' : 'translate-y-[calc(100%+1rem)]'}`}
      >
        {/* gold hairline + soft glow along the top edge */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" aria-hidden="true" />
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.11_32),oklch(0.16_0.05_28))] px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_30px_-10px_rgb(0_0_0/0.7)]">
          <div className="bg-mandala pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative flex items-center gap-2.5">
            {/* the logo carries its own gold ring */}
            <Image src={logo} alt={SITE.nameEn} sizes="48px" className="h-12 w-12 shrink-0 rounded-full drop-shadow-[0_0_10px_rgb(247_215_122/0.45)]" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[1.05rem] text-[#fff1cf]">हनुमान स्तुति साधना</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--gold)]">
                <Icon name="star" className="text-[10px]" /> {SITE.rating} · {SITE.devotees} साधक
              </p>
            </div>
            <CheckoutButton placement="sticky" tone="red" size="sm" className="ml-auto h-11 shrink-0 !px-4 text-[0.95rem]">
              <Icon name="flame" /> जॉइन करें
            </CheckoutButton>
          </div>
        </div>
      </div>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-5 font-bold text-white shadow-xl transition-transform hover:scale-105 sm:flex"
        aria-label="WhatsApp पर मदद लें"
      >
        <Icon name="whatsapp" className="text-2xl" /> मदद
      </a>
    </>
  );
}
