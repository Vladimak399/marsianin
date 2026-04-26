import { Nutrition } from '@/data/menu';

type NutritionTableProps = {
  nutrition: Nutrition;
};

const nutritionItems = [
  { label: 'белки', value: (nutrition: Nutrition) => `${nutrition.protein} г` },
  { label: 'жиры', value: (nutrition: Nutrition) => `${nutrition.fat} г` },
  { label: 'углеводы', value: (nutrition: Nutrition) => `${nutrition.carbs} г` },
  { label: 'калории', value: (nutrition: Nutrition) => `${nutrition.calories} ккал` }
] as const;

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <section className="mt-4 border-t border-black/[0.055] pt-4" aria-label="кбжу">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="mars-coordinate-label text-[10px] text-[#ed6a32]">кбжу</p>
        <p className="text-[10px] text-[#504942]/62">на позицию</p>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-xs text-[#403e3e] sm:grid-cols-4">
        {nutritionItems.map((item) => (
          <div key={item.label} className="border border-black/[0.06] bg-white/70 p-3">
            <dt className="mars-coordinate-label text-[9px] text-[#ed6a32]">{item.label}</dt>
            <dd className="mt-1 text-sm text-[#0b0b0b]">{item.value(nutrition)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
