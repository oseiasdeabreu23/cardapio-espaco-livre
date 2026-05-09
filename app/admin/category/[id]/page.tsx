import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Category, Item } from '@/lib/supabase/types';
import CategoryEditForm from '../../_components/CategoryEditForm';
import ItemList from '../../_components/ItemList';
import NewItemButton from '../../_components/NewItemButton';

export const dynamic = 'force-dynamic';

export default async function CategoryEditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: category }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').eq('id', params.id).maybeSingle(),
    supabase
      .from('items')
      .select('*')
      .eq('category_id', params.id)
      .order('sort_order'),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[12px] font-bold text-brand-inkSoft hover:text-brand-ink"
      >
        ← Voltar
      </Link>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <h2 className="text-[15px] font-extrabold text-brand-ink">
          Editar categoria
        </h2>
        <div className="mt-3">
          <CategoryEditForm category={category as Category} />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-extrabold text-brand-ink">Itens</h2>
          <span className="rounded-full bg-brand-bg px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-inkSoft">
            {(items ?? []).length}
          </span>
        </div>

        <div className="mt-3">
          <NewItemButton categoryId={params.id} />
        </div>

        <div className="mt-4">
          <ItemList
            initial={(items ?? []) as Item[]}
            categoryId={params.id}
          />
        </div>
      </section>
    </div>
  );
}
