import Link from 'next/link';

export default function AdminAvailabilityShortcut() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <Link
        href="/admin/order"
        className="block border border-black/[0.12] bg-white/95 px-4 py-3 text-xs font-medium text-[#504942] shadow-[0_12px_30px_rgba(24,21,18,0.12)] backdrop-blur-sm hover:border-[#ed6a32]/45 hover:text-[#ed6a32]"
      >
        порядок меню
      </Link>
      <Link
        href="/admin/availability"
        className="block border border-[#ed6a32]/45 bg-white/95 px-4 py-3 text-xs font-medium text-[#ed6a32] shadow-[0_12px_30px_rgba(24,21,18,0.12)] backdrop-blur-sm hover:bg-[#ed6a32]/[0.06]"
      >
        доступность / 18+
      </Link>
    </div>
  );
}
