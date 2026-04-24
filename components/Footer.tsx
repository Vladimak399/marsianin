import Link from 'next/link';
import { footerBrand, footerLegalLinks, footerLocations } from '@/data/locations';

type FooterProps = {
  compact?: boolean;
  className?: string;
};

export default function Footer({ compact = false, className = '' }: FooterProps) {
  if (compact) {
    return (
      <section className={`mt-4 border-t border-black/[0.06] pt-4 text-[10px] text-black/52 ${className}`.trim()}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {footerLocations.map((location) => (
            <a key={location.id} href={`tel:${location.phoneTel}`} className="transition hover:text-[#ed6a32]">
              {location.label}: {location.phone}
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <footer className={`relative z-10 mt-10 border-t border-black/[0.06] pt-8 ${className}`.trim()}>
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="text-[20px] font-medium tracking-[0.1em] text-black/84">{footerBrand.name}</div>
          <p className="mt-2 text-[11px] tracking-[0.04em] text-black/46">{footerBrand.slogan}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {footerLocations.map((location) => (
            <article key={location.id} className="border border-black/[0.06] bg-white/70 p-4 text-xs text-black/58">
              <div className="text-[16px] font-black leading-none tracking-[-0.02em] text-[#ed6a32]">{location.label}</div>
              <p className="mt-3 leading-relaxed">{location.address}</p>
              <p className="mt-2">{location.workingHours}</p>
              <a href={`tel:${location.phoneTel}`} className="mt-2 block transition hover:text-[#ed6a32]">
                {location.phone}
              </a>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <a href={location.links.maps.yandex} target="_blank" rel="noreferrer" className="transition hover:text-[#ed6a32]">
                  maps
                </a>
                <a href={location.links.maps.twoGis} target="_blank" rel="noreferrer" className="transition hover:text-[#ed6a32]">
                  2гис
                </a>
                <a href={location.links.delivery} target="_blank" rel="noreferrer" className="transition hover:text-[#ed6a32]">
                  доставка
                </a>
                <a href={location.links.reviews.yandex} target="_blank" rel="noreferrer" className="transition hover:text-[#ed6a32]">
                  отзывы
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-black/[0.06] pt-4 text-[11px] text-black/52">
        <div className="mb-3 text-black/66">юридическая информация</div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {footerLegalLinks.map((item) =>
            item.href ? (
              <Link key={item.title} href={item.href} className="transition hover:text-[#ed6a32]">
                {item.title}
              </Link>
            ) : (
              <span key={item.title}>{item.title}</span>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
