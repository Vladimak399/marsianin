import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/components/providers/Providers';
import { halvarMittel } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://marsianin.online'),
  title: 'марсианин — кофейня и кухня на каждый день',
  description:
    'кофейня «марсианин»: завтраки, блюда из яиц, творог, пасты и напитки. прозрачное меню с ценами и кбжу.',
  keywords: ['кофейня', 'марсианин', 'меню', 'завтраки', 'кофе', 'кбжу'],
  openGraph: {
    title: 'марсианин — кофейня и кухня на каждый день',
    description:
      'минималистичная кофейня с фактическим меню: цены, состав и пищевая ценность каждого блюда.',
    type: 'website',
    locale: 'ru_RU'
  },
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={halvarMittel.variable}>
      <body className="min-h-[100dvh] bg-[#f7f4ee] font-sans"><Providers>{children}</Providers></body>
    </html>
  );
}
