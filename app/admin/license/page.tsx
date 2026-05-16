import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMyProfile } from '@/lib/permissions';
import { getLicense } from '@/lib/license/repo';
import {
  formatDate,
  formatDocumento,
  statusLabel,
  statusReason,
} from '@/lib/license/format';
import { APP_VERSION } from '@/lib/version';
import { signOutAction } from '../_actions/auth';
import LicenseForm from './LicenseForm';
import { revalidateLicenseAction } from '../_actions/license';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Licença · Espaço Livre',
};

export default async function LicensePage() {
  const me = await getMyProfile();

  if (!me?.is_owner) {
    return (
      <div className="space-y-4">
        <h2 className="text-[15px] font-extrabold text-brand-ink">
          Licença · v{APP_VERSION}
        </h2>
        <p className="rounded-2xl bg-white p-5 text-[13px] font-medium text-brand-inkSoft shadow-thumb">
          Apenas o <span className="font-bold text-brand-ink">dono</span> do sistema pode visualizar e atualizar a licença. Peça para ele entrar e ativar.
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-full bg-brand-bg px-4 py-2 text-[12px] font-bold text-brand-ink hover:bg-brand-line"
          >
            Sair
          </button>
        </form>
      </div>
    );
  }

  const supabase = createClient();
  const license = await getLicense(supabase);

  const isActive = license?.valido === true && license.status === 'ativo';
  const badgeClass = isActive
    ? 'bg-green-100 text-brand-green'
    : license
      ? 'bg-red-50 text-brand-red'
      : 'bg-brand-bg text-brand-inkSoft';

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[12px] font-bold text-brand-inkSoft hover:text-brand-ink"
      >
        ← Voltar
      </Link>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-extrabold text-brand-ink">
              Licença do programa
            </h2>
            <p className="mt-1 text-[12px] font-medium text-brand-inkSoft">
              Versão instalada{' '}
              <span className="font-mono font-bold text-brand-ink">
                v{APP_VERSION}
              </span>
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold ${badgeClass}`}
          >
            {statusLabel(license?.status ?? null)}
          </span>
        </div>

        {license ? (
          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Info
              label={license.tipo_cliente === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
              value={formatDocumento(license.tipo_cliente, license.documento)}
            />
            {license.holder_name ? (
              <Info label="Titular" value={license.holder_name} />
            ) : null}
            <Info label="Plano" value={license.plano ?? '—'} />
            <Info
              label="Validade"
              value={
                license.data_validade
                  ? `${formatDate(license.data_validade)}${
                      license.dias_restantes !== null
                        ? ` (${license.dias_restantes} dias)`
                        : ''
                    }`
                  : '—'
              }
            />
            <Info
              label="Máquinas"
              value={
                license.max_maquinas !== null
                  ? `${license.maquinas_ativas ?? 0} / ${license.max_maquinas}`
                  : '—'
              }
            />
            <Info
              label="Dispositivo"
              value={license.nome_dispositivo ?? '—'}
            />
            <Info
              label="Última verificação"
              value={
                license.last_check_at
                  ? new Date(license.last_check_at).toLocaleString('pt-BR')
                  : 'Nunca'
              }
            />
            <Info
              label="Próxima verificação"
              value={
                license.next_check_at
                  ? new Date(license.next_check_at).toLocaleString('pt-BR')
                  : '—'
              }
            />
          </dl>
        ) : (
          <p className="mt-4 rounded-2xl bg-brand-bg p-4 text-[12.5px] font-medium text-brand-inkSoft">
            Nenhuma licença cadastrada. Preencha o formulário abaixo para ativar.
          </p>
        )}

        {license && !isActive ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-3 py-2 text-[12.5px] font-bold text-brand-red">
            {statusReason(license.status, license.motivo, {
              data_validade: license.data_validade,
              max_maquinas: license.max_maquinas,
              maquinas_ativas: license.maquinas_ativas,
            })}
          </p>
        ) : null}

        {license ? (
          <form action={revalidateLicenseAction} className="mt-4">
            <button
              type="submit"
              className="rounded-full bg-brand-ink px-4 py-2 text-[12px] font-bold text-white"
            >
              Verificar agora
            </button>
          </form>
        ) : null}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <h3 className="text-[14px] font-extrabold text-brand-ink">
          {license ? 'Atualizar dados da licença' : 'Ativar licença'}
        </h3>
        <p className="mt-1 text-[12px] font-medium text-brand-inkSoft">
          Os dados são verificados contra o painel oficial a cada hora.
        </p>
        <div className="mt-4">
          <LicenseForm
            defaultTipo={license?.tipo_cliente ?? 'empresa'}
            defaultDocumento={license?.documento ?? ''}
            defaultHolderName={license?.holder_name ?? ''}
            defaultNomeDispositivo={license?.nome_dispositivo ?? ''}
            hasApiKey={!!license?.api_key}
          />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-brand-bg px-3 py-2">
      <dt className="text-[10.5px] font-bold uppercase tracking-wide text-brand-inkSoft">
        {label}
      </dt>
      <dd className="mt-0.5 text-[13px] font-bold text-brand-ink">{value}</dd>
    </div>
  );
}
