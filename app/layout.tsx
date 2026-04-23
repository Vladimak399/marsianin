import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/components/providers/Providers';
import { halvarMittel } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://marsianin.cafe'),
  title: 'Марсианин — кофейня и кухня на каждый день',
  description:
    'Кофейня «Марсианин»: завтраки, блюда из яиц, творог, пасты и напитки. Прозрачное меню с ценами и КБЖУ.',
  keywords: ['кофейня', 'марсианин', 'меню', 'завтраки', 'кофе', 'КБЖУ'],
  openGraph: {
    title: 'Марсианин — кофейня и кухня на каждый день',
    description:
      'Минималистичная кофейня с фактическим меню: цены, состав и пищевая ценность каждого блюда.',
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
    <html lang="ru">
      <body className={`${halvarMittel.variable} min-h-screen bg-white`}><Providers>{children}</Providers></body>
    </html>
  );
}
