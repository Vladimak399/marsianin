import MenuSection from '@/components/menu/MenuSection';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { menuData } from '@/data/menu';

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[1240px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="border border-grid bg-white px-5 py-14 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">кофейня</p>
        <h1 className="mt-3 text-5xl font-semibold uppercase leading-none tracking-tight text-neutral-900 sm:text-7xl">
          марсианин
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Локальная кофейня с инженерным подходом к меню: понятный состав, единая подача, фиксированная
          граммовка и прозрачное КБЖУ для каждого блюда.
        </p>
        <div className="mt-7">
          <PrimaryButton href="#menu">смотреть меню</PrimaryButton>
        </div>
      </section>

      <section id="menu" className="mt-8 border border-grid bg-white px-5 py-10 sm:px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl">меню</h2>
          <p className="mt-2 text-sm text-neutral-600">Завтраки, яйца, творог, пасты и напитки.</p>
        </header>
        <div className="space-y-10">
          {menuData.map((section) => (
            <MenuSection key={section.category} section={section} />
          ))}
        </div>
      </section>

      <footer className="mt-8 grid gap-5 border border-grid bg-white px-5 py-8 text-sm text-neutral-700 sm:grid-cols-3 sm:px-8">
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-neutral-500">адрес</h3>
          <p className="mt-2">Москва, ул. Новая, 17</p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-neutral-500">соцсети</h3>
          <ul className="mt-2 space-y-1">
            <li>@marsianin.cafe</li>
            <li>t.me/marsianin</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-neutral-500">контакты</h3>
          <ul className="mt-2 space-y-1">
            <li>+7 (999) 123-45-67</li>
            <li>hello@marsianin.cafe</li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
