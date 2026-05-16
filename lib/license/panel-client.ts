import {
  LICENSE_PANEL_URL,
  LICENSE_VALIDATE_PATH,
  type LicenseStatus,
  type ValidateRequest,
  type ValidateResponse,
} from './types';

const TIMEOUT_MS = 5000;

export type PanelCallResult =
  | { ok: true; data: ValidateResponse }
  | { ok: false; status: LicenseStatus; message: string };

export async function callPanelValidate(
  apiKey: string,
  body: ValidateRequest,
  options: { baseUrl?: string; timeoutMs?: number } = {}
): Promise<PanelCallResult> {
  const baseUrl = options.baseUrl ?? LICENSE_PANEL_URL;
  const url = `${baseUrl.replace(/\/+$/, '')}${LICENSE_VALIDATE_PATH}`;
  const timeoutMs = options.timeoutMs ?? TIMEOUT_MS;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (res.status === 401) {
      return {
        ok: false,
        status: 'erro_autenticacao',
        message: 'Chave de API inválida ou ausente.',
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: 'erro_rede',
        message: `Painel respondeu HTTP ${res.status}.`,
      };
    }

    const data = (await res.json()) as ValidateResponse;
    if (typeof data?.valido !== 'boolean' || typeof data?.status !== 'string') {
      return {
        ok: false,
        status: 'desconhecido',
        message: 'Resposta do painel em formato inesperado.',
      };
    }
    return { ok: true, data };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === 'AbortError'
          ? `Tempo esgotado ao falar com o painel (${timeoutMs}ms).`
          : err.message
        : 'Erro desconhecido ao contatar o painel.';
    return { ok: false, status: 'erro_rede', message };
  } finally {
    clearTimeout(timer);
  }
}
