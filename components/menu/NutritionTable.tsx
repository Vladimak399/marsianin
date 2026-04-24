import { Nutrition } from '@/data/menu';

type NutritionTableProps = {
  nutrition: Nutrition;
};

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-black/[0.055] pt-4 text-xs text-[#403e3e] sm:grid-cols-4">
      <div className="border border-black/[0.065] bg-white/72 p-3">
        <dt className="mars-coordinate-label text-[#ed6a32]">белки</dt>
        <dd className="mt-1 text-sm text-[#0b0b0b]">{nutrition.protein} г</dd>
      </div>
      <div className="border border-black/[0.065] bg-white/72 p-3">
        <dt className="mars-coordinate-label text-[#ed6a32]">жиры</dt>
        <dd className="mt-1 text-sm text-[#0b0b0b]">{nutrition.fat} г</dd>
      </div>
      <div className="border border-black/[0.065] bg-white/72 p-3">
        <dt className="mars-coordinate-label text-[#ed6a32]">углеводы</dt>
        <dd className="mt-1 text-sm text-[#0b0b0b]">{nutrition.carbs} г</dd>
      </div>
      <div className="border border-black/[0.065] bg-white/72 p-3">
        <dt className="mars-coordinate-label text-[#ed6a32]">калории</dt>
        <dd className="mt-1 text-sm text-[#0b0b0b]">{nutrition.calories} ккал</dd>
      </div>
    </dl>
  );
}
