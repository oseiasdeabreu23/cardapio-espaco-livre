'use server';

import { createClient } from '@/lib/supabase/server';

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Arquivo inválido.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!allowed.includes(ext)) {
    return { success: false, error: 'Formato não permitido.' };
  }

  const path = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('menu-images').getPublicUrl(path);

  return { success: true, url: publicUrl };
}
