'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createItemAction } from '../_actions/items';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-bold text-white shadow-chip disabled:opacity-60"
    >
      {pending ? 'Criando…' : 'Criar item'}
    </button>
  );
}

export default function NewItemButton({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-brand-red px-3 py-1.5 text-[11.5px] font-bold text-white shadow-chip"
      >
        {open ? 'Fechar' : '+ Novo item'}
      </button>

      {open ? (
        <form
          action={async (fd) => {
            await createItemAction(fd);
            setOpen(false);
          }}
          className="col-span-full mt-4 space-y-2 rounded-2xl border border-brand-line bg-brand-bg p-4"
        >
          <input type="hidden" name="category_id" value={categoryId} />
          <h3 className="text-[13px] font-extrabold text-brand-ink">
            Novo item
          </h3>
          <input
            name="name"
            placeholder="Nome do item"
            required
            className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-orange"
          />
          <input
            name="description"
            placeholder="Descrição (opcional)"
            className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[12.5px] text-brand-ink outline-none focus:border-brand-orange"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="price"
              placeholder="Preço (12,50)"
              inputMode="decimal"
              className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-orange"
            />
            <input
              name="sizes"
              placeholder="33 / 55"
              className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] text-brand-ink outline-none focus:border-brand-orange"
            />
          </div>
          <input
            name="img_url"
            placeholder="URL da imagem (opcional, pode subir foto após criar)"
            className="w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[12.5px] text-brand-ink outline-none focus:border-brand-orange"
          />
          <p className="text-[10.5px] font-medium text-brand-inkSoft">
            Use só preço único OU tamanhos. Tamanhos: separe por / ou espaço.
          </p>
          <SubmitButton />
        </form>
      ) : null}
    </>
  );
}
