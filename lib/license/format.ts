import type { LicenseStatus, TipoCliente } from './types';

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '');
}

export function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calc = (factor: number, length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(cpf[i], 10) * (factor - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calc(10, 9) === parseInt(cpf[9], 10) && calc(11, 10) === parseInt(cpf[10], 10);
}

export function isValidCNPJ(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(cnpj[i], 10) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc(12) === parseInt(cnpj[12], 10) && calc(13) === parseInt(cnpj[13], 10);
}

export function isValidDocumento(tipo: TipoCliente, raw: string): boolean {
  return tipo === 'pessoa_fisica' ? isValidCPF(raw) : isValidCNPJ(raw);
}

export function formatCPF(raw: string): string {
  const d = onlyDigits(raw).padStart(11, '').slice(0, 11);
  if (d.length !== 11) return raw;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function formatCNPJ(raw: string): string {
  const d = onlyDigits(raw).padStart(14, '').slice(0, 14);
  if (d.length !== 14) return raw;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

export function formatDocumento(tipo: TipoCliente, raw: string): string {
  return tipo === 'pessoa_fisica' ? formatCPF(raw) : formatCNPJ(raw);
}

const STATUS_LABEL: Record<LicenseStatus, string> = {
  ativo: 'Ativa',
  vencido: 'Vencida',
  pendente: 'Pagamento pendente',
  suspenso: 'Suspensa',
  bloqueado: 'Bloqueada',
  cancelado: 'Cancelada',
  nao_encontrado: 'Documento não cadastrado',
  limite_excedido: 'Limite de máquinas atingido',
  erro_rede: 'Sem comunicação com o painel',
  erro_autenticacao: 'Chave de API inválida',
  desconhecido: 'Status desconhecido',
};

export function statusLabel(status: LicenseStatus | null | undefined): string {
  if (!status) return 'Sem verificação';
  return STATUS_LABEL[status] ?? STATUS_LABEL.desconhecido;
}

export function statusReason(
  status: LicenseStatus | null | undefined,
  motivo: string | null | undefined,
  extras: { data_validade?: string | null; max_maquinas?: number | null; maquinas_ativas?: number | null } = {}
): string {
  if (motivo) return motivo;
  if (!status) return 'Licença ainda não foi verificada.';
  switch (status) {
    case 'ativo':
      return 'Licença ativa.';
    case 'vencido':
      return extras.data_validade
        ? `Licença vencida em ${formatDate(extras.data_validade)}.`
        : 'Licença vencida.';
    case 'pendente':
      return 'Pagamento pendente. Regularize no painel para liberar.';
    case 'suspenso':
      return 'Licença suspensa pelo administrador do painel.';
    case 'bloqueado':
      return 'Licença bloqueada pelo administrador do painel.';
    case 'cancelado':
      return 'Licença cancelada.';
    case 'nao_encontrado':
      return 'Nenhuma licença encontrada para esse documento.';
    case 'limite_excedido':
      return `Limite de ${extras.max_maquinas ?? 0} máquina(s) atingido (${extras.maquinas_ativas ?? 0} ativa(s)).`;
    case 'erro_rede':
      return 'Não foi possível verificar a licença (painel offline).';
    case 'erro_autenticacao':
      return 'A chave de API foi rejeitada pelo painel.';
    default:
      return 'Status desconhecido retornado pelo painel.';
  }
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
