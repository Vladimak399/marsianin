export default function AdminGuide() {
  return (
    <section className="bg-[#f4f1ea] px-4 pt-8 text-[#0b0b0b] sm:px-6">
      <div className="mx-auto w-full max-w-6xl border border-[#ed6a32]/25 bg-[#fff8f1] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#ed6a32]">порядок работы</p>
        <h2 className="mt-1 text-lg font-semibold">Перед изменением меню</h2>
        <div className="mt-3 grid gap-3 text-sm leading-relaxed text-black/65 md:grid-cols-3">
          <div className="border border-black/[0.07] bg-white/70 p-3">
            <p className="font-medium text-black/80">1. Основной редактор</p>
            <p className="mt-1">Здесь меняются названия, цены, описания, фото и КБЖУ. После правок обязательно нажать «Сохранить».</p>
          </div>
          <div className="border border-black/[0.07] bg-white/70 p-3">
            <p className="font-medium text-black/80">2. Порядок меню</p>
            <p className="mt-1">Для сортировки разделов и позиций используйте отдельный экран «порядок меню».</p>
          </div>
          <div className="border border-black/[0.07] bg-white/70 p-3">
            <p className="font-medium text-black/80">3. Доступность / 18+</p>
            <p className="mt-1">Для скрытия позиций по точкам и алкоголя используйте отдельный экран «доступность / 18+».</p>
          </div>
        </div>
        <div className="mt-3 border border-red-500/25 bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-700">
          Seed-импорт — опасное действие. Он заменяет живое меню seed-версией из кода. Использовать только если нужно полностью перезалить каталог.
        </div>
      </div>
    </section>
  );
}
