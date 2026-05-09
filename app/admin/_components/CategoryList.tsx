'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Category } from '@/lib/supabase/types';
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from '../_actions/categories';

type Props = {
  categories: Category[];
  counts: Record<string, number>;
};

export default function CategoryList({ categories: initial, counts }: Props) {
  const [items, setItems] = useState<Category[]>(initial);
  const [pending, start] = useTransition();

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);

    start(async () => {
      const fd = new FormData();
      fd.set('ids', next.map((c) => c.id).join(','));
      await reorderCategoriesAction(fd);
    });
  };

  const onDelete = (id: string, name: string) => {
    if (!confirm(`Apagar a categoria "${name}" e todos os itens dela?`)) return;
    start(async () => {
      const fd = new FormData();
      fd.set('id', id);
      await deleteCategoryAction(fd);
      setItems((curr) => curr.filter((c) => c.id !== id));
    });
  };

  if (items.length === 0) {
    return (
      <p className="text-[12.5px] font-medium text-brand-inkSoft">
        Nenhuma categoria criada ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-brand-line">
      {items.map((c, idx) => (
        <li
          key={c.id}
          className={`flex items-center gap-3 py-3 ${
            pending ? 'opacity-60' : ''
          }`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-bg text-[16px]">
            {c.icon}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              href={`/admin/category/${c.id}`}
              className="block truncate text-[14px] font-bold text-brand-ink hover:underline"
            >
              {c.name}
            </Link>
            {c.subtitle ? (
              <p className="truncate text-[11.5px] font-medium text-brand-inkSoft">
                {c.subtitle}
              </p>
            ) : null}
          </div>
          <span className="rounded-full bg-brand-bg px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-inkSoft">
            {counts[c.id] ?? 0}
          </span>
          <div className="flex items-center gap-1">
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
            <button
              type="button"
              onClick={() => onDelete(c.id, c.name)}
              disabled={pending}
              className="rounded-md px-2 py-1 text-[14px] text-brand-red hover:bg-brand-red/10"
              aria-label="Apagar"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
