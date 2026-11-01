// Saari videos aur tasveerein yahin hain — URL badlo, page apne aap update.
// Abhi ke links placeholder hain (videos aischool wale, posters/photos Hanuman ji ke) —
// apne asli links/files se badal dena.
//
// Video ka `src` teen tarah ka ho sakta hai:
//   • MP4 / Wistia link    → https://.../video.mp4  ya  https://embed-ssl.wistia.com/deliveries/<id>.bin
//   • HLS (Bunny CDN)      → https://vz-xxxx.b-cdn.net/<id>/playlist.m3u8
//   • YouTube              → https://www.youtube.com/watch?v=<id>  (ya youtu.be / shorts / embed link)
// `poster` = video chalne se pehle dikhne wali tasveer (/public path ya https link).
// Kisi entry ka `src` khaali ('') kar do to woh page par nahi dikhegi.
// Nayi bahar ki image host (https) ho to next.config.ts ke remotePatterns me jodo.

import hanuman1 from '@/assets/hanuman-1.png';
import hanuman2 from '@/assets/hanuman-2.png';
import atRamsFeet from '@/assets/Hanuman-Ji-at-the-Feet-of-Shri-Ram.png';
import panchmukhi from '@/assets/Panchmukhi-Hanuman-Ji.png';
import sankatmochan from '@/assets/Sankatmochan-Hanuman-Ji.png';
import siyaRamInHeart from '@/assets/Sita-Ram-in-Hanuman-Jis-Heart.png';

export type VideoItem = { src: string; poster?: string; title: string };
export type ImageItem = { src: string; alt: string };

// Hero ki badi tasveer — desktop par right side, mobile par sabse upar.
// Badalni ho to nayi file src/assets/ me daalo aur upar wala import badlo.
export const HERO_BG = {
  src: hanuman1,
  alt: 'श्री हनुमान जी — पीछे सूर्यास्त, पर्वत और मंदिर',
};

// Hero ke neeche — page khulte hi muted autoplay hota hai, tap par awaaz aati hai.
export const HERO_VIDEO: VideoItem = {
  src: 'https://embed-ssl.wistia.com/deliveries/8036923a12fdf959fea2c6bd37a710b3d69c679b.bin',
  poster: '/video-posters/hero.jpg',
  title: 'हनुमान स्तुति साधना — एक झलक',
};

// Sections ke peeche halki si dikhne wali badi tasveerein.
// (Cards ki photos src/assets/ me hain — WHY: src/data/content.ts, मनोकामनाएं: PhalSection.tsx.)
export const SECTION_BG = {
  why: '/images/bg/mandir.jpg',
  cta: '/images/bg/diye.jpg',
  // "हम हैं हनुमान साधक" section की बड़ी तस्वीर
  about: hanuman2,
};

// भक्तों के video अनुभव — "हमारे साधकों की सच्ची कहानियाँ" section.
// `title` = नाम, शहर (video के नीचे "- नाम, शहर" बनकर दिखता है), `quote` = उनकी एक लाइन,
// `duration` = video की लंबाई जैसे '1:24' (optional — खाली छोड़ो तो badge नहीं दिखेगा).
// पहली entry सबसे पहले बड़े video में दिखती है.
export type VideoTestimonial = VideoItem & { quote: string; duration?: string };

export const TESTIMONIAL_VIDEOS: VideoTestimonial[] = [
  { src: 'https://www.youtube.com/shorts/VQALn2S72f0', poster: '/video-posters/reel4.jpg', title: 'प्रिया जी, दिल्ली', quote: 'हनुमान जी की साधना ने मेरे मन को शांति दी और जीवन में नई दिशा मिली।' },
  { src: 'https://www.youtube.com/shorts/4v2s9jtJpsA', poster: '/video-posters/reel1.jpg', title: 'रामप्रसाद जी, लखनऊ', quote: 'मेरा आत्मविश्वास बहुत बढ़ा है।' },
  { src: 'https://www.youtube.com/shorts/4OmjGEU_H9M', poster: '/video-posters/reel2.jpg', title: 'सुनीता जी, पटना', quote: 'चिंता और तनाव से मुक्ति मिली।' },
  { src: 'https://www.youtube.com/shorts/2qL19nwj8xg', poster: '/video-posters/reel3.png', title: 'अजय जी, वाराणसी', quote: 'परिवार में सकारात्मकता आई।' },
  { src: 'https://www.youtube.com/shorts/N-L_mtirFCQ', poster: '/video-posters/reel5.jpg', title: 'महेश जी, इंदौर', quote: 'रोज़ की स्तुति से मन स्थिर रहने लगा है।' },
  { src: 'https://www.youtube.com/shorts/X3nyT-YJHJo', poster: '/video-posters/reel6.png', title: 'अनिता जी, जयपुर', quote: 'घर का माहौल ही बदल गया — अब सब साथ बैठकर पाठ करते हैं।' },
  { src: 'https://www.youtube.com/shorts/xGBTgsXNxWs', poster: '/video-posters/reel7.jpg', title: 'राकेश जी, भोपाल', quote: '40 दिन का नियम निभाया — अनुशासन और श्रद्धा दोनों बढ़े।' },
  { src: 'https://www.youtube.com/shorts/MhRHBdCMBQA', poster: '/video-posters/reel8.jpg', title: 'कविता जी, रायपुर', quote: 'रोज़ का पाठ अब दिन का सबसे सुकून भरा पल है।' },
];

// Gallery — aischool ki tarah alag-alag sections. `cols` / `aspect` optional hain.
export type GallerySection = { label: string; images: ImageItem[]; cols?: string; aspect?: string };

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    label: 'बजरंगबली के स्वरूप',
    images: [
      { src: atRamsFeet.src, alt: 'श्री राम के चरणों में हनुमान जी' },
      { src: siyaRamInHeart.src, alt: 'हृदय में सिया-राम — भक्त हनुमान' },
      { src: panchmukhi.src, alt: 'पंचमुखी हनुमान जी' },
      { src: sankatmochan.src, alt: 'संकटमोचन हनुमान जी' },
    ],
  },
];

// भक्तों के WhatsApp संदेश / screenshots (खड़ी तस्वीरें).
export const WHATSAPP_PROOFS: ImageItem[] = [
  { src: '/whatsapp-feedback/img1.jpg', alt: 'भक्त का WhatsApp संदेश 1' },
  { src: '/whatsapp-feedback/img2.jpg', alt: 'भक्त का WhatsApp संदेश 2' },
  { src: '/whatsapp-feedback/img3.jpg', alt: 'भक्त का WhatsApp संदेश 3' },
  { src: '/whatsapp-feedback/img4.jpg', alt: 'भक्त का WhatsApp संदेश 4' },
];

export const hasSrc = <T extends { src: string }>(items: T[]) => items.filter((i) => i.src.trim() !== '');
