'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  exportBackupAction,
  restoreBackupAction,
  type RestoreState,
} from '../_actions/backup';

const initialRestore: RestoreState = { error: null, success: null };

function todayStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export default function BackupActions() {
  return (
    <div className="space-y-6">
      <DownloadBackup />
      <hr className="border-brand-line" />
      <UploadRestore />
    </div>
  );
}

function DownloadBackup() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    start(async () => {
      const result = await exportBackupAction();
      if (!result.ok || !result.data) {
        setError(result.error ?? 'Erro ao gerar backup.');
        return;
      }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cardapio-espaco-livre_backup_${todayStamp()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <h3 className="text-[13.5px] font-extrabold text-brand-ink">
        Fazer backup
      </h3>
      <p className="mt-1 text-[11.5px] font-medium text-brand-inkSoft">
        Baixa um arquivo .json com tudo do cardápio.
      </p>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="mt-3 rounded-full bg-brand-ink px-4 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
      >
        {pending ? 'Gerando…' : '⬇ Baixar backup (.json)'}
      </button>
      {error ? (
        <p className="mt-2 text-[12px] font-bold text-brand-red">{error}</p>
      ) : null}
    </div>
  );
}

function RestoreSubmit({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  const disabled = !ready || pending;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-bold text-white shadow-chip disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? 'Restaurando…' : 'Restaurar (apaga tudo + recria)'}
    </button>
  );
}

function UploadRestore() {
  const [state, action] = useFormState(restoreBackupAction, initialRestore);
  const [confirmation, setConfirmation] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const ready = confirmation.trim().toUpperCase() === 'ESPACO LIVRE' && fileName;

  return (
    <div>
      <h3 className="text-[13.5px] font-extrabold text-brand-ink">
        Restaurar backup
      </h3>
      <p className="mt-1 text-[11.5px] font-medium text-brand-inkSoft">
        ⚠️ Apaga todas as categorias e itens atuais e recria a partir do
        arquivo. Essa ação não pode ser desfeita.
      </p>

      <form action={action} className="mt-3 space-y-3">
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Arquivo .json
          </span>
          <input
            name="file"
            type="file"
            accept="application/json,.json"
            required
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name ?? null)
            }
            className="mt-1 block w-full text-[12.5px] text-brand-ink"
          />
          {fileName ? (
            <span className="mt-1 block text-[11px] font-medium text-brand-inkSoft">
              {fileName}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Para confirmar, digite exatamente:{' '}
            <code className="rounded bg-brand-bg px-1.5 py-0.5 text-brand-red">
              ESPACO LIVRE
            </code>
          </span>
          <input
            name="confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-brand-line bg-brand-bg px-3 py-2 text-[13.5px] uppercase text-brand-ink outline-none focus:border-brand-red"
          />
        </label>

        {state.error ? (
          <p className="text-[12.5px] font-bold text-brand-red">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-[12.5px] font-bold text-brand-green">
            ✓ {state.success}
          </p>
        ) : null}

        <RestoreSubmit ready={Boolean(ready)} />
      </form>
    </div>
  );
}
