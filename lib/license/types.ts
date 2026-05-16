export const LICENSE_PANEL_URL = 'https://painel-licencas-rho.vercel.app';
export const LICENSE_VALIDATE_PATH = '/api/licenses/validate';
export const LICENSE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export type TipoCliente = 'pessoa_fisica' | 'empresa';

export type LicenseStatus =
  | 'ativo'
  | 'vencido'
  | 'pendente'
  | 'suspenso'
  | 'bloqueado'
  | 'cancelado'
  | 'nao_encontrado'
  | 'limite_excedido'
  | 'erro_rede'
  | 'erro_autenticacao'
  | 'desconhecido';

export type LicenseRow = {
  id: 1;
  tipo_cliente: TipoCliente;
  documento: string;
  holder_name: string | null;
  panel_url: string;
  api_key: string;
  machine_id: string;
  nome_dispositivo: string | null;
  valido: boolean;
  status: LicenseStatus | null;
  data_validade: string | null;
  dias_restantes: number | null;
  plano: string | null;
  max_maquinas: number | null;
  maquinas_ativas: number | null;
  motivo: string | null;
  installed_version: string | null;
  last_check_at: string | null;
  last_check_error: string | null;
  next_check_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LicensePublic = {
  id: 1;
  valido: boolean;
  status: LicenseStatus | null;
  data_validade: string | null;
  dias_restantes: number | null;
  motivo: string | null;
  max_maquinas: number | null;
  maquinas_ativas: number | null;
};

export type ValidateRequest = {
  tipo_cliente: TipoCliente;
  documento: string;
  machine_id?: string;
  nome_dispositivo?: string;
  versao?: string;
};

export type ValidateActiveResponse = {
  valido: true;
  status: 'ativo';
  data_validade?: string;
  dias_restantes?: number;
  plano?: string;
  max_maquinas?: number;
  maquinas_ativas?: number;
};

export type ValidateInactiveResponse = {
  valido: false;
  status: Exclude<LicenseStatus, 'ativo' | 'erro_rede' | 'erro_autenticacao' | 'desconhecido'>;
  data_validade?: string;
  dias_restantes?: number;
  plano?: string;
  max_maquinas?: number;
  maquinas_ativas?: number;
  motivo?: string;
};

export type ValidateResponse = ValidateActiveResponse | ValidateInactiveResponse;

export type ValidateError = {
  error: string;
  message?: string;
};
