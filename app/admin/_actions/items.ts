'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getMyProfile, profileHas } from '@/lib/permissions';

function parseSizes(raw: string): number[] | null {
  const values = raw
    .split(/[,\s/|]+/)
    .map((s) => s.replace(',', '.').trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
  return values.length > 0 ? values : null;
}

function parsePrice(raw: string): number | null {
  const cleaned = raw.replace(/\./g, '').replace(',', '.').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export async function createItemAction(formData: FormData) {
  const me = await getMyProfile();
  if (!profileHas(me, 'edit_item_text')) return;

  const supabase = createClient();

  const categoryId = String(formData.get('category_id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const price = parsePrice(String(formData.get('price') ?? ''));
  const sizes = parseSizes(String(formData.get('sizes') ?? ''));
  const imgUrl = String(formData.get('img_url') ?? '').trim() || null;

  if (!categoryId || !name) return;

  const { data: maxRow } = await supabase
    .from('items')
    .select('sort_order')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  await supabase.from('items').insert({
    category_id: categoryId,
    name,
    description,
    price,
    sizes,
    img_url: imgUrl,
    sort_order: nextOrder,
  });

  revalidatePath(`/admin/category/${categoryId}`);
  revalidatePath('/');
}

export async function updateItemAction(formData: FormData) {
  const me = await getMyProfile();
  const canText = profileHas(me, 'edit_item_text');
  const canPrice = profileHas(me, 'edit_item_prices');
  const canImage = profileHas(me, 'upload_images');
  if (!canText && !canPrice && !canImage) return;

  const supabase = createClient();

  const id = String(formData.get('id') ?? '');
  const categoryId = String(formData.get('category_id') ?? '');
  if (!id) return;

  // Load current row to ignore fields the user can't change
  const { data: current } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!current) return;

  const updates: Record<string, unknown> = {};

  if (canText) {
    const name = String(formData.get('name') ?? '').trim();
    const description =
      String(formData.get('description') ?? '').trim() || null;
    const isVisible = formData.get('is_visible') === 'on';
    if (name) updates.name = name;
    updates.description = description;
    updates.is_visible = isVisible;
  }

  if (canPrice) {
    updates.price = parsePrice(String(formData.get('price') ?? ''));
    updates.sizes = parseSizes(String(formData.get('sizes') ?? ''));
  }

  if (canImage) {
    updates.img_url = String(formData.get('img_url') ?? '').trim() || null;
  }

  if (Object.keys(updates).length === 0) return;

  await supabase.from('items').update(updates).eq('id', id);

  if (categoryId) revalidatePath(`/admin/category/${categoryId}`);
  revalidatePath('/');
}

export async function deleteItemAction(formData: FormData) {
  const me = await getMyProfile();
  if (!profileHas(me, 'edit_item_text')) return;

  const supabase = createClient();
  const id = String(formData.get('id') ?? '');
  const categoryId = String(formData.get('category_id') ?? '');
  if (!id) return;

  await supabase.from('items').delete().eq('id', id);

  if (categoryId) revalidatePath(`/admin/category/${categoryId}`);
  revalidatePath('/');
}

export async function reorderItemsAction(formData: FormData) {
  const me = await getMyProfile();
  if (!profileHas(me, 'edit_item_text')) return;

  const supabase = createClient();
  const categoryId = String(formData.get('category_id') ?? '');
  const idsRaw = String(formData.get('ids') ?? '');
  const ids = idsRaw.split(',').filter(Boolean);

  for (let i = 0; i < ids.length; i++) {
    await supabase
      .from('items')
      .update({ sort_order: i + 1 })
      .eq('id', ids[i]);
  }

  if (categoryId) revalidatePath(`/admin/category/${categoryId}`);
  revalidatePath('/');
}
