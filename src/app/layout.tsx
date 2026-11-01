import type { Metadata, Viewport } from 'next';
import { Hind, Rozha_One } from 'next/font/google';
import { MandalaDefs } from '@/components/CreamDecor';
import MetaPixel from '@/components/MetaPixel';
import { SITE } from '@/data/site';
import './globals.css';

const rozha = Rozha_One({ variable: '--font-rozha', weight: '400', subsets: ['devanagari', 'latin'] });
const hind = Hind({ variable: '--font-hind', weight: ['400', '500', '600', '700'], subsets: ['devanagari', 'latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: '40 दिन हनुमान स्तुति साधना — रोज़ 10 मिनट | हनुमान साधक',
  description:
    'रोज़ सिर्फ 10 मिनट हनुमान जी की guided स्तुति सुनें। 40 दिन की साधना पूरी करें, सर्टिफिकेट पाएं — नौकरी, विवाह, धन, स्वास्थ्य की मनोकामना के लिए। 50,000+ भक्त जुड़ चुके हैं।',
  keywords: 'hanuman stuti, hanuman chalisa, 40 din sadhana, hanuman sadhana, manokamna, hanuman sadhak',
  openGraph: {
    title: '40 दिन की हनुमान स्तुति साधना — रोज़ सिर्फ 10 मिनट',
    description: `${SITE.devotees} भक्त जुड़ चुके हैं। आज ही साधना शुरू करें।`,
    images: ['/images/hanuman-ram-darbar.jpg'],
    locale: 'hi_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2b0b06',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${rozha.variable} ${hind.variable} h-full antialiased`}>
      <body className="min-h-full">
        <MandalaDefs />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
