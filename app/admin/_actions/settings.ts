'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getMyProfile, profileHas } from '@/lib/permissions';

export async function setOpenStatusAction(formData: FormData) {
  const me = await getMyProfile();
  if (!profileHas(me, 'toggle_open_status')) return;

  const supabase = createClient();
  const isOpen = formData.get('is_open') === 'true';

  await supabase.from('settings').upsert({ key: 'is_open', value: isOpen });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function setClosedMessageAction(formData: FormData) {
  const me = await getMyProfile();
  if (!profileHas(me, 'edit_closed_message')) return;

  const message = String(formData.get('closed_message') ?? '').trim();
  if (!message) return;

  const supabase = createClient();
  await supabase
    .from('settings')
    .upsert({ key: 'closed_message', value: message });

  revalidatePath('/admin');
  revalidatePath('/');
}
