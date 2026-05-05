'use client';

import { useMemo, useState } from 'react';
import type { MenuCategory } from '@/lib/menu';
import SearchBar from './SearchBar';
import CategoryChips from './CategoryChips';
import CategorySection from './CategorySection';

type Props = {
  categories: MenuCategory[];
};

export default function MenuView({ categories }: Props) {
  const [active, setActive] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => active === 'all' || c.id === active)
      .map((c) => {
        if (!q) return { category: c, items: c.items };
        const items = c.items.filter((it) => {
          return (
            it.name.toLowerCase().includes(q) ||
            (it.desc ? it.desc.toLowerCase().includes(q) : false)
          );
        });
        return { category: c, items };
      })
      .filter((s) => s.items.length > 0);
  }, [categories, active, query]);

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <CategoryChips
        categories={categories}
        active={active}
        onChange={setActive}
      />

      {visible.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="text-[14.5px] font-semibold text-brand-ink">
            Nada encontrado
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-brand-inkSoft">
            Tente outra palavra ou troque a categoria.
          </p>
        </div>
      ) : (
        visible.map((s) => (
          <CategorySection
            key={s.category.id}
            category={s.category}
            items={s.items}
          />
        ))
      )}
    </>
  );
}
