import { createClient } from '@/lib/supabase/server';
import OpenToggle from './_components/OpenToggle';
import CategoryList from './_components/CategoryList';
import NewCategoryForm from './_components/NewCategoryForm';
import { setClosedMessageAction } from './_actions/settings';
import type { Category } from '@/lib/supabase/types';
import { getMyProfile, profileHas } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const me = await getMyProfile();
  const supabase = createClient();

  const [{ data: categories }, { data: settings }, { data: itemCounts }] =
    await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('settings').select('key, value'),
      supabase.from('items').select('category_id'),
    ]);

  const map = new Map<string, number>();
  for (const it of (itemCounts ?? []) as { category_id: string }[]) {
    map.set(it.category_id, (map.get(it.category_id) ?? 0) + 1);
  }

  const isOpen =
    (settings ?? []).find((s: any) => s.key === 'is_open')?.value === true;
  const closedMessage =
    (settings ?? []).find((s: any) => s.key === 'closed_message')?.value ??
    'Estamos fechados no momento';

  const canToggleOpen = profileHas(me, 'toggle_open_status');
  const canEditClosedMsg = profileHas(me, 'edit_closed_message');
  const canCreateCategories = profileHas(me, 'create_categories');
  const canDeleteCategories = profileHas(me, 'delete_categories');
  const showStatusSection = canToggleOpen || canEditClosedMsg;

  return (
    <div className="space-y-6">
      {showStatusSection ? (
        <section className="rounded-3xl bg-white p-5 shadow-thumb">
          <h2 className="text-[15px] font-extrabold text-brand-ink">
            Status do estabelecimento
          </h2>
          <p className="mt-1 text-[12px] font-medium text-brand-inkSoft">
            Controla o aviso de fechado no topo do cardápio.
          </p>

          {canToggleOpen ? (
            <div className="mt-4">
              <OpenToggle initial={isOpen} />
            </div>
          ) : null}

          {canEditClosedMsg ? (
            <form action={setClosedMessageAction} className="mt-4 space-y-2">
              <label className="block">
                <span className="text-[12px] font-bold text-brand-inkSoft">
                  Mensagem quando fechado
                </span>
                <input
                  name="closed_message"
                  defaultValue={String(closedMessage)}
                  className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-brand-ink px-4 py-2 text-[12px] font-bold text-white"
              >
                Salvar mensagem
              </button>
            </form>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-brand-ink">
            Categorias
          </h2>
          <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[11px] font-bold text-brand-inkSoft">
            {(categories ?? []).length}
          </span>
        </div>

        <div className="mt-4">
          <CategoryList
            categories={(categories ?? []) as Category[]}
            counts={Object.fromEntries(map)}
            canReorder={canCreateCategories}
            canDelete={canDeleteCategories}
          />
        </div>

        {canCreateCategories ? (
          <>
            <hr className="my-5 border-brand-line" />
            <h3 className="text-[13px] font-extrabold text-brand-ink">
              Adicionar nova categoria
            </h3>
            <div className="mt-3">
              <NewCategoryForm />
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
