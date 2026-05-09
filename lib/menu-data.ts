import { createClient } from '@/lib/supabase/server';
import type { Category, Item, Settings } from '@/lib/supabase/types';
import type { MenuCategory } from '@/lib/menu';

export type DBCategory = Category;
export type DBItem = Item;

export async function getMenu(): Promise<MenuCategory[]> {
  const supabase = createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase
      .from('items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order'),
  ]);

  if (!categories) return [];

  const itemsByCategory = new Map<string, Item[]>();
  for (const item of (items as Item[]) ?? []) {
    const list = itemsByCategory.get(item.category_id) ?? [];
    list.push(item);
    itemsByCategory.set(item.category_id, list);
  }

  return (categories as Category[]).map((c) => ({
    id: c.slug,
    name: c.name,
    icon: c.icon,
    subtitle: c.subtitle ?? undefined,
    items: (itemsByCategory.get(c.id) ?? []).map((it) => {
      const sizes = Array.isArray(it.sizes) ? it.sizes : null;
      return {
        name: it.name,
        desc: it.description ?? undefined,
        price: it.price ?? undefined,
        sizes:
          sizes && sizes.length === 2
            ? ([sizes[0], sizes[1]] as [number, number])
            : undefined,
        sizes3:
          sizes && sizes.length === 3
            ? ([sizes[0], sizes[1], sizes[2]] as [number, number, number])
            : undefined,
        img: it.img_url ?? '',
      };
    }),
  }));
}

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data } = await supabase.from('settings').select('key, value');

  const out: Settings = {
    is_open: true,
    closed_message: 'Estamos fechados no momento',
  };

  for (const row of (data ?? []) as { key: string; value: unknown }[]) {
    if (row.key === 'is_open') out.is_open = row.value === true;
    else if (row.key === 'closed_message' && typeof row.value === 'string') {
      out.closed_message = row.value;
    }
  }

  return out;
}
