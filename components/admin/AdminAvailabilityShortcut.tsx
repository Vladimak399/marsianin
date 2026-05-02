import Link from 'next/link';

export default function AdminAvailabilityShortcut() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/admin/availability"
        className="block border border-[#ed6a32]/45 bg-white/95 px-4 py-3 text-xs font-medium text-[#ed6a32] shadow-[0_12px_30px_rgba(24,21,18,0.12)] backdrop-blur-sm hover:bg-[#ed6a32]/[0.06]"
      >
        доступность / 18+
      </Link>
    </div>
  );
}
