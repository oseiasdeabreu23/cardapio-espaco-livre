import type { SupabaseClient } from '@supabase/supabase-js';
import { APP_VERSION } from '@/lib/version';
import { callPanelValidate } from './panel-client';
import { getLicense, recordCheck } from './repo';
import type { LicenseRow, LicenseStatus, ValidateResponse } from './types';

export type CheckOutcome = {
  valido: boolean;
  status: LicenseStatus;
  motivo: string | null;
  license: LicenseRow | null;
};

export async function runLicenseCheck(
  supabase: SupabaseClient
): Promise<CheckOutcome> {
  const current = await getLicense(supabase);

  if (!current) {
    return {
      valido: false,
      status: 'nao_encontrado',
      motivo: 'Nenhuma licença cadastrada nesta instalação.',
      license: null,
    };
  }

  const result = await callPanelValidate(
    current.api_key,
    {
      tipo_cliente: current.tipo_cliente,
      documento: current.documento,
      machine_id: current.machine_id,
      nome_dispositivo: current.nome_dispositivo ?? undefined,
      versao: APP_VERSION,
    },
    { baseUrl: current.panel_url }
  );

  if (!result.ok) {
    await recordCheck(supabase, {
      valido: false,
      status: result.status,
      data_validade: current.data_validade,
      dias_restantes: current.dias_restantes,
      plano: current.plano,
      max_maquinas: current.max_maquinas,
      maquinas_ativas: current.maquinas_ativas,
      motivo: result.message,
      last_check_error: result.message,
    });
    const fresh = await getLicense(supabase);
    return {
      valido: false,
      status: result.status,
      motivo: result.message,
      license: fresh,
    };
  }

  const data = result.data as ValidateResponse;
  await recordCheck(supabase, {
    valido: data.valido,
    status: data.status,
    data_validade: data.data_validade ?? null,
    dias_restantes: data.dias_restantes ?? null,
    plano: data.plano ?? null,
    max_maquinas: data.max_maquinas ?? null,
    maquinas_ativas: data.maquinas_ativas ?? null,
    motivo: data.valido ? null : data.motivo ?? null,
    last_check_error: null,
  });

  const fresh = await getLicense(supabase);
  return {
    valido: data.valido,
    status: data.status,
    motivo: data.valido ? null : data.motivo ?? null,
    license: fresh,
  };
}
