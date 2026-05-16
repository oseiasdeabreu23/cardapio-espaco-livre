'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { APP_VERSION } from '@/lib/version';
import { runLicenseCheck } from '@/lib/license/check';
import { upsertActivation } from '@/lib/license/repo';
import {
  isValidDocumento,
  onlyDigits,
  statusReason,
} from '@/lib/license/format';
import { LICENSE_PANEL_URL, type TipoCliente } from '@/lib/license/types';
import { getMyProfile } from '@/lib/permissions';

export type LicenseFormState = {
  error: string | null;
  success: string | null;
};

export async function activateLicenseAction(
  _prev: LicenseFormState,
  formData: FormData
): Promise<LicenseFormState> {
  const me = await getMyProfile();
  if (!me?.is_owner) {
    return { error: 'Apenas o dono pode ativar a licença.', success: null };
  }

  const tipoRaw = String(formData.get('tipo_cliente') ?? '').trim();
  const documentoRaw = String(formData.get('documento') ?? '').trim();
  const apiKey = String(formData.get('api_key') ?? '').trim();
  const holderName = String(formData.get('holder_name') ?? '').trim() || null;
  const nomeDispositivo =
    String(formData.get('nome_dispositivo') ?? '').trim() || null;

  if (tipoRaw !== 'pessoa_fisica' && tipoRaw !== 'empresa') {
    return { error: 'Selecione CPF ou CNPJ.', success: null };
  }
  const tipo_cliente = tipoRaw as TipoCliente;
  const documento = onlyDigits(documentoRaw);

  if (!isValidDocumento(tipo_cliente, documento)) {
    return {
      error:
        tipo_cliente === 'pessoa_fisica'
          ? 'CPF inválido. Confira os 11 dígitos.'
          : 'CNPJ inválido. Confira os 14 dígitos.',
      success: null,
    };
  }

  if (!apiKey) {
    return { error: 'Informe a chave de API do painel.', success: null };
  }

  const supabase = createClient();
  const upsert = await upsertActivation(supabase, {
    tipo_cliente,
    documento,
    holder_name: holderName,
    api_key: apiKey,
    panel_url: LICENSE_PANEL_URL,
    nome_dispositivo: nomeDispositivo,
    installed_version: APP_VERSION,
  });

  if (upsert.error) {
    return {
      error: `Não foi possível salvar a licença: ${upsert.error}`,
      success: null,
    };
  }

  const outcome = await runLicenseCheck(supabase);

  revalidatePath('/admin/license');
  revalidatePath('/', 'layout');

  if (!outcome.valido) {
    return {
      error: statusReason(outcome.status, outcome.motivo, {
        data_validade: outcome.license?.data_validade ?? null,
        max_maquinas: outcome.license?.max_maquinas ?? null,
        maquinas_ativas: outcome.license?.maquinas_ativas ?? null,
      }),
      success: null,
    };
  }

  return {
    error: null,
    success: 'Licença ativada e verificada com sucesso.',
  };
}

export async function revalidateLicenseAction(): Promise<void> {
  const me = await getMyProfile();
  if (!me?.is_owner) return;

  const supabase = createClient();
  await runLicenseCheck(supabase);

  revalidatePath('/admin/license');
  revalidatePath('/', 'layout');
}
