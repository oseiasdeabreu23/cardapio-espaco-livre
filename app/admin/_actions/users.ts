'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Permission } from '@/lib/supabase/types';
import { PERMISSIONS } from '@/lib/supabase/types';

export type UsersFormState = { error: string | null; success: string | null };

const validSet = new Set<string>(PERMISSIONS);

function pickPermissions(formData: FormData): Permission[] {
  const out: Permission[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith('perm:')) {
      const value = key.slice(5);
      if (validSet.has(value)) out.push(value as Permission);
    }
  }
  return out;
}

export async function createAdminAction(
  _prev: UsersFormState,
  formData: FormData
): Promise<UsersFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const displayName = String(formData.get('display_name') ?? '').trim() || null;
  const permissions = pickPermissions(formData);

  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios.', success: null };
  }
  if (password.length < 8) {
    return { error: 'A senha deve ter pelo menos 8 caracteres.', success: null };
  }

  const supabase = createClient();
  const { error } = await supabase.rpc('create_admin_user', {
    p_email: email,
    p_password: password,
    p_permissions: permissions,
    p_display_name: displayName,
  });

  if (error) {
    return { error: humanizeRpcError(error.message), success: null };
  }

  revalidatePath('/admin/users');
  return { error: null, success: `Usuário ${email} criado.` };
}

export async function updateAdminAction(
  _prev: UsersFormState,
  formData: FormData
): Promise<UsersFormState> {
  const userId = String(formData.get('user_id') ?? '');
  const displayName = String(formData.get('display_name') ?? '').trim() || null;
  const isActive = formData.get('is_active') === 'on';
  const permissions = pickPermissions(formData);

  if (!userId) {
    return { error: 'Usuário inválido.', success: null };
  }

  const supabase = createClient();
  const { error } = await supabase.rpc('update_admin_permissions', {
    p_user_id: userId,
    p_permissions: permissions,
    p_is_active: isActive,
    p_display_name: displayName,
  });

  if (error) {
    return { error: humanizeRpcError(error.message), success: null };
  }

  revalidatePath('/admin/users');
  return { error: null, success: 'Permissões atualizadas.' };
}

export async function deleteAdminAction(formData: FormData) {
  const userId = String(formData.get('user_id') ?? '');
  if (!userId) return;

  const supabase = createClient();
  await supabase.rpc('delete_admin_user', { p_user_id: userId });
  revalidatePath('/admin/users');
}

export async function setAdminPasswordAction(
  _prev: UsersFormState,
  formData: FormData
): Promise<UsersFormState> {
  const userId = String(formData.get('user_id') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!userId || password.length < 8) {
    return { error: 'Senha precisa ter pelo menos 8 caracteres.', success: null };
  }

  const supabase = createClient();
  const { error } = await supabase.rpc('set_admin_password', {
    p_user_id: userId,
    p_password: password,
  });

  if (error) {
    return { error: humanizeRpcError(error.message), success: null };
  }

  return { error: null, success: 'Senha alterada.' };
}

function humanizeRpcError(message: string): string {
  if (message.includes('forbidden')) return 'Você não tem permissão para isso.';
  if (message.includes('email already exists'))
    return 'Já existe um usuário com esse email.';
  if (message.includes('cannot delete the owner'))
    return 'Você não pode apagar o dono.';
  if (message.includes('cannot modify the owner'))
    return 'Você não pode alterar o dono.';
  if (message.includes('cannot delete yourself'))
    return 'Você não pode apagar a si mesmo.';
  if (message.includes('cannot change the owner password'))
    return 'Só o próprio dono pode trocar a senha do dono.';
  if (message.includes('invalid email')) return 'Email inválido.';
  if (message.includes('password must be at least'))
    return 'A senha deve ter pelo menos 8 caracteres.';
  if (message.includes('user not found')) return 'Usuário não encontrado.';
  return message;
}
