import { locations } from '@/data/locations';

const legalItems = [
  'политика обработки персональных данных',
  'публичная оферта',
  'реквизиты будут добавлены'
] as const;

export default function Footer() {
  return (
    <footer className="mt-12 rounded-2xl border border-[rgba(24,21,18,0.1)] bg-[rgba(255,255,255,0.72)] p-5 text-[#2e2c2a] shadow-[0_12px_32px_rgba(24,21,18,0.08)] backdrop-blur-sm sm:mt-14 sm:p-7">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <section>
          <p className="text-[21px] font-medium tracking-[0.1em] text-black/82">марсианин</p>
          <p className="mt-2 text-xs tracking-[0.08em] text-black/46 uppercase">кофейня, где есть жизнь</p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3 sm:gap-5">
          {locations.map((location) => {
            const deliveryLink = location.links.delivery ?? location.links.yandexEda;

            return (
              <article key={location.id} className="space-y-3 rounded-xl border border-[rgba(24,21,18,0.08)] bg-white/70 p-4 sm:p-3">
                <p className="text-[27px] font-black leading-none tracking-[-0.02em] text-[#ed6a32]">{location.label}</p>

                <div className="space-y-1.5 text-xs leading-relaxed text-black/62">
                  <p>{location.address}</p>
                  <p>{location.workingHours}</p>
                  <a href={`tel:${location.phoneTel}`} className="inline-block underline decoration-black/25 underline-offset-2 transition hover:text-[#ed6a32] hover:decoration-[#ed6a32]/45">
                    {location.phone}
                  </a>
                </div>

                <div className="flex flex-col items-start gap-1.5 text-xs">
                  <a
                    href={location.links.maps.yandex}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/62 transition hover:text-[#ed6a32]"
                  >
                    построить маршрут
                  </a>
                  <a
                    href={location.links.maps.twoGis}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/62 transition hover:text-[#ed6a32]"
                  >
                    открыть в 2гис
                  </a>
                  <a href={deliveryLink} target="_blank" rel="noreferrer" className="text-black/62 transition hover:text-[#ed6a32]">
                    заказать доставку
                  </a>
                  <a
                    href={location.links.reviews.twoGis}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/62 transition hover:text-[#ed6a32]"
                  >
                    оставить отзыв
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <section className="mt-8 border-t border-[rgba(24,21,18,0.08)] pt-6 sm:mt-10 sm:pt-7">
        <h2 className="text-xs tracking-[0.05em] text-black/54">юридическая информация</h2>
        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-black/54">
          {legalItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
