'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getMyProfile } from '@/lib/permissions';

export type RestoreState = {
  error: string | null;
  success: string | null;
};

export async function exportBackupAction(): Promise<{
  ok: boolean;
  data?: unknown;
  error?: string;
}> {
  const me = await getMyProfile();
  if (!me?.is_owner) {
    return { ok: false, error: 'Apenas o dono pode fazer backup.' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('export_menu_backup');

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data };
}

export async function restoreBackupAction(
  _prev: RestoreState,
  formData: FormData
): Promise<RestoreState> {
  const me = await getMyProfile();
  if (!me?.is_owner) {
    return { error: 'Apenas o dono pode restaurar.', success: null };
  }

  const confirmation = String(formData.get('confirmation') ?? '')
    .trim()
    .toUpperCase();
  if (confirmation !== 'ESPACO LIVRE') {
    return {
      error: 'Confirmação incorreta. Digite exatamente: ESPACO LIVRE',
      success: null,
    };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Selecione um arquivo .json válido.', success: null };
  }

  let backup: unknown;
  try {
    const text = await file.text();
    backup = JSON.parse(text);
  } catch {
    return { error: 'Arquivo .json inválido.', success: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('restore_menu_backup', {
    p_backup: backup,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/backup');

  const result = data as
    | { restored_categories?: number; restored_items?: number }
    | null;
  return {
    error: null,
    success: `Backup restaurado: ${result?.restored_categories ?? 0} categorias e ${result?.restored_items ?? 0} itens.`,
  };
}
