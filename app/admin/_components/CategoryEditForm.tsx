'use client';

import { useFormStatus } from 'react-dom';
import type { Category } from '@/lib/supabase/types';
import {
  updateCategoryAction,
  deleteCategoryAction,
} from '../_actions/categories';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-ink px-4 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
    >
      {pending ? 'Salvando…' : 'Salvar'}
    </button>
  );
}

export default function CategoryEditForm({ category }: { category: Category }) {
  return (
    <form action={updateCategoryAction} className="space-y-3">
      <input type="hidden" name="id" value={category.id} />

      <div className="grid grid-cols-[60px_1fr] gap-3">
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Ícone
          </span>
          <input
            name="icon"
            defaultValue={category.icon}
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
            defaultValue={category.name}
            required
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
          defaultValue={category.subtitle ?? ''}
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <div className="flex items-center gap-2">
        <SaveButton />
        <DeleteButton id={category.id} name={category.name} />
      </div>
    </form>
  );
}

function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteCategoryAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Apagar a categoria "${name}" e todos os itens dela? Esta ação não pode ser desfeita.`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="ml-auto"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-brand-red px-3 py-2 text-[11.5px] font-bold text-brand-red hover:bg-brand-red hover:text-white"
      >
        Apagar categoria
      </button>
    </form>
  );
}
