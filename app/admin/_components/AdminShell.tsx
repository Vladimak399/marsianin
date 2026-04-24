import Link from 'next/link';
import { ReactNode } from 'react';
import { logoutAdminAction } from '@/app/admin/actions';

export default function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f7f7] p-3 sm:p-6">
      <div className="mx-auto max-w-6xl border border-neutral-200 bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">marsianin admin</p>
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link className="border border-neutral-200 px-3 py-1.5 hover:border-[#ff8a42]" href="/admin">
              Dashboard
            </Link>
            <Link className="border border-neutral-200 px-3 py-1.5 hover:border-[#ff8a42]" href="/admin/products">
              Меню
            </Link>
            <Link className="border border-neutral-200 px-3 py-1.5 hover:border-[#ff8a42]" href="/admin/categories">
              Категории
            </Link>
            <Link className="border border-neutral-200 px-3 py-1.5 hover:border-[#ff8a42]" href="/admin/locations">
              Точки
            </Link>
            <form action={logoutAdminAction}>
              <button className="border border-[#ff8a42] bg-[#fff1e8] px-3 py-1.5 text-[#ac4e16]">Выйти</button>
            </form>
          </nav>
        </header>
        <section className="p-4 sm:p-6">{children}</section>
      </div>
    </main>
  );
}
