'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import MenuSection from '@/components/menu/MenuSection';
import { menuData } from '@/data/menu';
import { fadeUp } from '@/lib/animations';

export default function Home() {
  return (
    <main className="relative mx-auto min-h-screen max-w-[1240px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <Hero />

      <motion.section
        id="menu"
        className="relative z-10 mt-8 border border-grid bg-white px-5 py-10 sm:px-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <header className="mb-8">
          <h2 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl">меню</h2>
          <p className="mt-2 text-sm text-neutral-600">Завтраки, яйца, творог, пасты и напитки.</p>
        </header>
        <div className="space-y-10">
          {menuData.map((section) => (
            <MenuSection key={section.category} section={section} />
          ))}
        </div>
      </motion.section>

      <motion.footer
        className="relative z-10 mt-8 grid gap-5 border border-grid bg-white px-5 py-8 text-sm text-neutral-700 sm:grid-cols-3 sm:px-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
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
      </motion.footer>
    </main>
  );
}
