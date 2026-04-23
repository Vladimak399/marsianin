import { Nutrition } from '@/data/menu';

type NutritionTableProps = {
  nutrition: Nutrition;
};

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-grid pt-3 text-xs text-neutral-600 sm:grid-cols-4">
      <div>
        <dt className="tracking-[0.06em]">белки</dt>
        <dd className="mt-1 text-sm text-neutral-900">{nutrition.protein} г</dd>
      </div>
      <div>
        <dt className="tracking-[0.06em]">жиры</dt>
        <dd className="mt-1 text-sm text-neutral-900">{nutrition.fat} г</dd>
      </div>
      <div>
        <dt className="tracking-[0.06em]">углеводы</dt>
        <dd className="mt-1 text-sm text-neutral-900">{nutrition.carbs} г</dd>
      </div>
      <div>
        <dt className="tracking-[0.06em]">калории</dt>
        <dd className="mt-1 text-sm text-neutral-900">{nutrition.calories} ккал</dd>
      </div>
    </dl>
  );
}
