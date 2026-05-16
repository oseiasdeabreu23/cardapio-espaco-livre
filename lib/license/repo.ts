import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  LicensePublic,
  LicenseRow,
  LicenseStatus,
  TipoCliente,
} from './types';

export async function getLicense(
  supabase: SupabaseClient
): Promise<LicenseRow | null> {
  const { data, error } = await supabase
    .from('license')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) return null;
  return (data as LicenseRow) ?? null;
}

export async function getLicensePublic(
  supabase: SupabaseClient
): Promise<LicensePublic | null> {
  const { data, error } = await supabase
    .from('license_public')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) return null;
  return (data as LicensePublic) ?? null;
}

export type ActivationInput = {
  tipo_cliente: TipoCliente;
  documento: string;
  holder_name: string | null;
  api_key: string;
  panel_url: string;
  nome_dispositivo: string | null;
  installed_version: string;
};

export async function upsertActivation(
  supabase: SupabaseClient,
  input: ActivationInput
): Promise<{ error: string | null }> {
  const existing = await getLicense(supabase);

  const payload = {
    id: 1 as const,
    tipo_cliente: input.tipo_cliente,
    documento: input.documento,
    holder_name: input.holder_name,
    api_key: input.api_key,
    panel_url: input.panel_url,
    nome_dispositivo: input.nome_dispositivo,
    installed_version: input.installed_version,
    ...(existing?.machine_id ? { machine_id: existing.machine_id } : {}),
  };

  const { error } = await supabase.from('license').upsert(payload, { onConflict: 'id' });
  return { error: error?.message ?? null };
}

export type RecordCheckInput = {
  valido: boolean;
  status: LicenseStatus;
  data_validade: string | null;
  dias_restantes: number | null;
  plano: string | null;
  max_maquinas: number | null;
  maquinas_ativas: number | null;
  motivo: string | null;
  last_check_error: string | null;
};

export async function recordCheck(
  supabase: SupabaseClient,
  input: RecordCheckInput
): Promise<{ error: string | null }> {
  const now = new Date();
  const next = new Date(now.getTime() + 60 * 60 * 1000);

  const { error } = await supabase
    .from('license')
    .update({
      valido: input.valido,
      status: input.status,
      data_validade: input.data_validade,
      dias_restantes: input.dias_restantes,
      plano: input.plano,
      max_maquinas: input.max_maquinas,
      maquinas_ativas: input.maquinas_ativas,
      motivo: input.motivo,
      last_check_at: now.toISOString(),
      last_check_error: input.last_check_error,
      next_check_at: next.toISOString(),
    })
    .eq('id', 1);

  return { error: error?.message ?? null };
}
