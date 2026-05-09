'use client';

import { useState, useTransition } from 'react';
import type { Item } from '@/lib/supabase/types';
import {
  deleteItemAction,
  reorderItemsAction,
} from '../_actions/items';
import ItemEditor from './ItemEditor';

type Props = {
  initial: Item[];
  categoryId: string;
  canEditText: boolean;
  canEditPrices: boolean;
  canUploadImages: boolean;
};

export default function ItemList({
  initial,
  categoryId,
  canEditText,
  canEditPrices,
  canUploadImages,
}: Props) {
  const [items, setItems] = useState<Item[]>(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const canShowEditor = canEditText || canEditPrices || canUploadImages;

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);

    start(async () => {
      const fd = new FormData();
      fd.set('category_id', categoryId);
      fd.set('ids', next.map((i) => i.id).join(','));
      await reorderItemsAction(fd);
    });
  };

  const onDelete = (id: string, name: string) => {
    if (!confirm(`Apagar "${name}"?`)) return;
    start(async () => {
      const fd = new FormData();
      fd.set('id', id);
      fd.set('category_id', categoryId);
      await deleteItemAction(fd);
      setItems((curr) => curr.filter((i) => i.id !== id));
    });
  };

  const onSaved = (updated: Item) => {
    setItems((curr) => curr.map((i) => (i.id === updated.id ? updated : i)));
    setOpenId(null);
  };

  if (items.length === 0) {
    return (
      <p className="text-[12.5px] font-medium text-brand-inkSoft">
        Nenhum item nessa categoria ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-brand-line">
      {items.map((it, idx) => (
        <li key={it.id} className={pending ? 'opacity-60' : ''}>
          <div className="flex items-center gap-3 py-3">
            <div
              className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-bg"
              style={{
                backgroundImage: it.img_url ? `url(${it.img_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-bold text-brand-ink">
                {it.name}
              </p>
              <p className="truncate text-[11.5px] font-medium text-brand-inkSoft">
                {it.description ?? ''}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {canEditText ? (
                <>
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || pending}
                    className="rounded-md px-2 py-1 text-[14px] text-brand-inkSoft hover:bg-brand-bg disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1 || pending}
                    className="rounded-md px-2 py-1 text-[14px] text-brand-inkSoft hover:bg-brand-bg disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    ↓
                  </button>
                </>
              ) : null}
              {canShowEditor ? (
                <button
                  type="button"
                  onClick={() =>
                    setOpenId((curr) => (curr === it.id ? null : it.id))
                  }
                  className="rounded-full bg-brand-bg px-3 py-1 text-[11.5px] font-bold text-brand-ink hover:bg-brand-line"
                >
                  {openId === it.id ? 'Fechar' : 'Editar'}
                </button>
              ) : null}
              {canEditText ? (
                <button
                  type="button"
                  onClick={() => onDelete(it.id, it.name)}
                  disabled={pending}
                  className="rounded-md px-2 py-1 text-[14px] text-brand-red hover:bg-brand-red/10"
                  aria-label="Apagar"
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>

          {openId === it.id ? (
            <div className="rounded-2xl border border-brand-line bg-brand-bg p-4">
              <ItemEditor
                item={it}
                onSaved={onSaved}
                canEditText={canEditText}
                canEditPrices={canEditPrices}
                canUploadImages={canUploadImages}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
