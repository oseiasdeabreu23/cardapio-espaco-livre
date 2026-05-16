'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import {
  activateLicenseAction,
  type LicenseFormState,
} from '../_actions/license';

const initialState: LicenseFormState = { error: null, success: null };
import { formatCNPJ, formatCPF } from '@/lib/license/format';
import type { TipoCliente } from '@/lib/license/types';

type Props = {
  defaultTipo: TipoCliente;
  defaultDocumento: string;
  defaultHolderName: string;
  defaultNomeDispositivo: string;
  hasApiKey: boolean;
};

function SubmitButton({ hasApiKey }: { hasApiKey: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-red px-5 py-2.5 text-[12.5px] font-bold text-white shadow-chip disabled:opacity-60"
    >
      {pending ? 'Verificando…' : hasApiKey ? 'Atualizar licença' : 'Ativar licença'}
    </button>
  );
}

export default function LicenseForm({
  defaultTipo,
  defaultDocumento,
  defaultHolderName,
  defaultNomeDispositivo,
  hasApiKey,
}: Props) {
  const [state, action] = useFormState<LicenseFormState, FormData>(
    activateLicenseAction,
    initialState
  );
  const [tipo, setTipo] = useState<TipoCliente>(defaultTipo);
  const [documento, setDocumento] = useState(() =>
    defaultDocumento
      ? defaultTipo === 'pessoa_fisica'
        ? formatCPF(defaultDocumento)
        : formatCNPJ(defaultDocumento)
      : ''
  );

  const onDocChange = (raw: string) => {
    const digits = raw.replace(/\D+/g, '');
    if (tipo === 'pessoa_fisica') {
      setDocumento(digits.length >= 11 ? formatCPF(digits) : digits);
    } else {
      setDocumento(digits.length >= 14 ? formatCNPJ(digits) : digits);
    }
  };

  const onTipoChange = (next: TipoCliente) => {
    setTipo(next);
    const digits = documento.replace(/\D+/g, '');
    if (next === 'pessoa_fisica') {
      setDocumento(digits.length >= 11 ? formatCPF(digits) : digits);
    } else {
      setDocumento(digits.length >= 14 ? formatCNPJ(digits) : digits);
    }
  };

  return (
    <form action={action} className="space-y-4">
      <div>
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Tipo de licença
        </span>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-[13px] font-bold transition-colors ${
              tipo === 'pessoa_fisica'
                ? 'border-brand-red bg-white text-brand-ink'
                : 'border-brand-line bg-brand-bg text-brand-inkSoft'
            }`}
          >
            <input
              type="radio"
              name="tipo_cliente"
              value="pessoa_fisica"
              checked={tipo === 'pessoa_fisica'}
              onChange={() => onTipoChange('pessoa_fisica')}
              className="sr-only"
            />
            CPF
            <span className="text-[10.5px] font-medium text-brand-inkSoft">
              Pessoa Física
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-[13px] font-bold transition-colors ${
              tipo === 'empresa'
                ? 'border-brand-red bg-white text-brand-ink'
                : 'border-brand-line bg-brand-bg text-brand-inkSoft'
            }`}
          >
            <input
              type="radio"
              name="tipo_cliente"
              value="empresa"
              checked={tipo === 'empresa'}
              onChange={() => onTipoChange('empresa')}
              className="sr-only"
            />
            CNPJ
            <span className="text-[10.5px] font-medium text-brand-inkSoft">
              Empresa
            </span>
          </label>
        </div>
      </div>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          {tipo === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
        </span>
        <input
          name="documento"
          required
          inputMode="numeric"
          value={documento}
          onChange={(e) => onDocChange(e.target.value)}
          placeholder={tipo === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
          maxLength={tipo === 'pessoa_fisica' ? 14 : 18}
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Nome / Razão social (opcional)
        </span>
        <input
          name="holder_name"
          defaultValue={defaultHolderName}
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Nome do dispositivo (opcional)
        </span>
        <input
          name="nome_dispositivo"
          defaultValue={defaultNomeDispositivo}
          placeholder="Ex: Caixa-Recepção"
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Chave de API do painel
        </span>
        <input
          name="api_key"
          type="text"
          required
          placeholder={hasApiKey ? 'Cole uma nova chave para substituir' : 'pk_...'}
          className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2.5 font-mono text-[12.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
        <span className="mt-1 block text-[10.5px] font-medium text-brand-inkSoft">
          A chave nunca é exibida depois de salva. Para trocar, basta colar uma nova aqui.
        </span>
      </label>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[12.5px] font-bold text-brand-red">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-xl bg-green-50 px-3 py-2 text-[12.5px] font-bold text-brand-green">
          {state.success}
        </p>
      ) : null}

      <SubmitButton hasApiKey={hasApiKey} />
    </form>
  );
}
