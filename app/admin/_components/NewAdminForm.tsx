'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRef } from 'react';
import { createAdminAction, type UsersFormState } from '../_actions/users';
import PermissionsCheckboxes from './PermissionsCheckboxes';

const initial: UsersFormState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-bold text-white shadow-chip disabled:opacity-60"
    >
      {pending ? 'Cadastrando…' : 'Cadastrar admin'}
    </button>
  );
}

export default function NewAdminForm() {
  const [state, action] = useFormState(createAdminAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
          />
        </label>
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Nome (opcional)
          </span>
          <input
            name="display_name"
            className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Senha temporária (mín. 8 caracteres)
        </span>
        <input
          name="password"
          type="text"
          required
          minLength={8}
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <PermissionsCheckboxes />

      {state.error ? (
        <p className="text-[12.5px] font-bold text-brand-red">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-[12.5px] font-bold text-brand-green">
          {state.success}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
