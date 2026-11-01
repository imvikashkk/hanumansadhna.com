'use client';

import { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '@/data/media';
import { trackCustom } from '@/lib/pixel';
import Icon from '../Icon';
import { useVideoSource, VIDEO_PLAY_EVENT } from './useVideoSource';

const HERO_ID = 'hero';

// Autoplays muted on load (browsers block sound until the visitor interacts);
// the first tap anywhere on the page turns the sound on.
export default function HeroVideo({ video }: { video: VideoItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useVideoSource(ref, video.src, true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.play().catch(() => {});

    const stopListening = () => {
      document.removeEventListener('click', unmute);
      document.removeEventListener('touchstart', unmute);
    };
    const unmute = (e: Event) => {
      // A tap that starts another video shouldn't wake the hero back up.
      if ((e.target as Element | null)?.closest('[data-video-card]')) return;
      stopListening();
      el.muted = false;
      setMuted(false);
    };
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent<string>).detail === HERO_ID) return;
      el.pause();
      stopListening();
    };
    document.addEventListener('click', unmute);
    document.addEventListener('touchstart', unmute, { passive: true });
    window.addEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
    return () => {
      stopListening();
      window.removeEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
    };
  }, []);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-black shadow-glow">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={video.poster}
        autoPlay
        muted
        loop
        playsInline
        controls={!muted}
        onPlay={() => window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: HERO_ID }))}
        onVolumeChange={(e) => {
          if (!e.currentTarget.muted) trackCustom('VideoPlay', { title: video.title, placement: 'hero' });
        }}
      />
      {muted && (
        <span className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <span className="inline-flex animate-float items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur">
            <Icon name="volumeOff" /> आवाज़ के लिए टैप करें
          </span>
        </span>
      )}
    </div>
  );
}
