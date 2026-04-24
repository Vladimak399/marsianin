'use client';

import { locations } from '@/data/locations';

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.08] bg-[#f6f2ea]/88 px-5 py-8 text-[#0b0b0b] sm:px-7 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/[0.06] pb-5">
          <div>
            <p className="text-[22px] tracking-[0.12em] text-black/84">марсианин</p>
            <p className="mt-1 text-[11px] tracking-[0.04em] text-black/52">кофейня, где есть жизнь</p>
          </div>
          <p className="text-[10px] tracking-[0.08em] text-black/44">контакты и ссылки по точкам</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {locations.map((location) => (
            <article key={location.id} className="border border-black/[0.06] bg-white/70 p-4">
              <p className="text-sm font-semibold tracking-[-0.01em] text-[#ed6a32]">{location.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-black/70">{location.address}</p>
              <p className="mt-1 text-xs text-black/64">{location.workingHours}</p>
              <a href={`tel:${location.phoneTel}`} className="mt-1 block text-xs text-black/70 hover:text-[#ed6a32]">
                {location.phone}
              </a>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-black/58">
                <a href={location.links.maps.yandex} target="_blank" rel="noreferrer" className="hover:text-[#ed6a32]">
                  яндекс карты
                </a>
                <a href={location.links.maps.twoGis} target="_blank" rel="noreferrer" className="hover:text-[#ed6a32]">
                  2гис
                </a>
                <a href={location.links.yandexEda} target="_blank" rel="noreferrer" className="hover:text-[#ed6a32]">
                  доставка
                </a>
                <a href={location.links.reviews.yandex} target="_blank" rel="noreferrer" className="hover:text-[#ed6a32]">
                  отзывы
                </a>
              </div>
            </article>
          ))}
        </div>

        <div id="legal" className="mt-6 grid gap-1 border-t border-black/[0.06] pt-4 text-[11px] text-black/46">
          <p>юридическая информация</p>
          <a href="#legal" className="w-fit hover:text-[#ed6a32]">
            политика обработки персональных данных
          </a>
          <a href="#legal" className="w-fit hover:text-[#ed6a32]">
            публичная оферта
          </a>
          <p>реквизиты будут добавлены</p>
        </div>
      </div>
    </footer>
  );
}
