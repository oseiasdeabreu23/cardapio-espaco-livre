import { createClient } from '@/lib/supabase/server';
import type { Permission, Profile } from '@/lib/supabase/types';

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return (data as Profile) ?? null;
}

export function profileHas(profile: Profile | null, perm: Permission): boolean {
  if (!profile || !profile.is_active) return false;
  if (profile.is_owner) return true;
  return profile.permissions.includes(perm);
}

export async function requirePermission(perm: Permission) {
  const profile = await getMyProfile();
  if (!profileHas(profile, perm)) {
    throw new Error(`forbidden: missing ${perm} permission`);
  }
  return profile!;
}
