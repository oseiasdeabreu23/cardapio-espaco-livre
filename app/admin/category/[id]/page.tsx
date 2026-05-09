import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Category, Item } from '@/lib/supabase/types';
import CategoryEditForm from '../../_components/CategoryEditForm';
import ItemList from '../../_components/ItemList';
import NewItemButton from '../../_components/NewItemButton';
import { getMyProfile, profileHas } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function CategoryEditPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await getMyProfile();
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

  const canEditCategoryMeta = profileHas(me, 'create_categories');
  const canDeleteCategory = profileHas(me, 'delete_categories');
  const canEditItemText = profileHas(me, 'edit_item_text');
  const canEditItemPrices = profileHas(me, 'edit_item_prices');
  const canUploadImages = profileHas(me, 'upload_images');

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[12px] font-bold text-brand-inkSoft hover:text-brand-ink"
      >
        ← Voltar
      </Link>

      {canEditCategoryMeta || canDeleteCategory ? (
        <section className="rounded-3xl bg-white p-5 shadow-thumb">
          <h2 className="text-[15px] font-extrabold text-brand-ink">
            Editar categoria
          </h2>
          <div className="mt-3">
            <CategoryEditForm
              category={category as Category}
              canEdit={canEditCategoryMeta}
              canDelete={canDeleteCategory}
            />
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-white p-5 shadow-thumb">
          <h2 className="text-[15px] font-extrabold text-brand-ink">
            {category.name}
          </h2>
          {category.subtitle ? (
            <p className="text-[12.5px] font-medium text-brand-inkSoft">
              {category.subtitle}
            </p>
          ) : null}
        </section>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-extrabold text-brand-ink">Itens</h2>
          <span className="rounded-full bg-brand-bg px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-inkSoft">
            {(items ?? []).length}
          </span>
        </div>

        {canEditItemText ? (
          <div className="mt-3">
            <NewItemButton categoryId={params.id} />
          </div>
        ) : null}

        <div className="mt-4">
          <ItemList
            initial={(items ?? []) as Item[]}
            categoryId={params.id}
            canEditText={canEditItemText}
            canEditPrices={canEditItemPrices}
            canUploadImages={canUploadImages}
          />
        </div>
      </section>
    </div>
  );
}
