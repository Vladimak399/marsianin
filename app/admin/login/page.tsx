'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAdminAction } from '@/app/admin/actions';

const initialState = { error: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="w-full bg-[#ff8a42] px-4 py-2 font-medium text-white disabled:opacity-50" disabled={pending}>
      {pending ? 'Входим...' : 'Войти'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdminAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] p-4">
      <form action={formAction} className="w-full max-w-sm space-y-4 border border-neutral-200 bg-white p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">закрытая зона</p>
          <h1 className="text-2xl font-semibold">Вход в админку</h1>
        </div>
        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input name="email" type="email" required className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Пароль</span>
          <input name="password" type="password" required className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <SubmitButton />
      </form>
    </main>
  );
}
