'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signInAction, type AuthState } from '../_actions/auth';

const initial: AuthState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-2xl bg-brand-red py-3 text-[14px] font-bold text-white shadow-chip transition-opacity disabled:opacity-60"
    >
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action] = useFormState(signInAction, initial);

  return (
    <form
      action={action}
      className="space-y-3 rounded-3xl bg-white p-5 shadow-thumb"
    >
      <input type="hidden" name="redirect" value={redirectTo} />

      <label className="block">
        <span className="text-[12px] font-bold text-brand-inkSoft">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-[14px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-bold text-brand-inkSoft">Senha</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-[14px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      {state.error ? (
        <p className="text-[12.5px] font-bold text-brand-red">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
