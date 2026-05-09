'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function createCategoryAction(formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get('name') ?? '').trim();
  const icon = String(formData.get('icon') ?? '🍽️').trim() || '🍽️';
  const subtitle = String(formData.get('subtitle') ?? '').trim() || null;

  if (!name) return;

  const baseSlug = slugify(name);
  let slug = baseSlug || 'categoria';
  let suffix = 1;
  while (true) {
    const { data: exists } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { data: maxRow } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data: created } = await supabase
    .from('categories')
    .insert({ slug, name, icon, subtitle, sort_order: nextOrder })
    .select('id')
    .single();

  revalidatePath('/admin');
  revalidatePath('/');
  if (created?.id) redirect(`/admin/category/${created.id}`);
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = createClient();

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const icon = String(formData.get('icon') ?? '🍽️').trim() || '🍽️';
  const subtitle = String(formData.get('subtitle') ?? '').trim() || null;

  if (!id || !name) return;

  await supabase
    .from('categories')
    .update({ name, icon, subtitle })
    .eq('id', id);

  revalidatePath('/admin');
  revalidatePath(`/admin/category/${id}`);
  revalidatePath('/');
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await supabase.from('categories').delete().eq('id', id);

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

export async function reorderCategoriesAction(formData: FormData) {
  const supabase = createClient();
  const idsRaw = String(formData.get('ids') ?? '');
  const ids = idsRaw.split(',').filter(Boolean);

  for (let i = 0; i < ids.length; i++) {
    await supabase
      .from('categories')
      .update({ sort_order: i + 1 })
      .eq('id', ids[i]);
  }

  revalidatePath('/admin');
  revalidatePath('/');
}
