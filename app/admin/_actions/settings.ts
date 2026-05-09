'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function setOpenStatusAction(formData: FormData) {
  const supabase = createClient();
  const isOpen = formData.get('is_open') === 'true';

  await supabase.from('settings').upsert({ key: 'is_open', value: isOpen });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function setClosedMessageAction(formData: FormData) {
  const supabase = createClient();
  const message = String(formData.get('closed_message') ?? '').trim();
  if (!message) return;

  await supabase
    .from('settings')
    .upsert({ key: 'closed_message', value: message });

  revalidatePath('/admin');
  revalidatePath('/');
}
