'use client';

import { useFormStatus } from 'react-dom';
import { createCategoryAction } from '../_actions/categories';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-bold text-white shadow-chip disabled:opacity-60"
    >
      {pending ? 'Criando…' : 'Criar categoria'}
    </button>
  );
}

export default function NewCategoryForm() {
  return (
    <form action={createCategoryAction} className="space-y-3">
      <div className="grid grid-cols-[60px_1fr] gap-3">
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Ícone
          </span>
          <input
            name="icon"
            placeholder="🍰"
            maxLength={4}
            className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-center text-[18px] outline-none focus:border-brand-orange"
          />
        </label>
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Nome
          </span>
          <input
            name="name"
            required
            placeholder="Sobremesas"
            className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Subtítulo (opcional)
        </span>
        <input
          name="subtitle"
          placeholder="Pequena | Grande"
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
