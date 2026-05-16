import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getLicensePublic } from '@/lib/license/repo';
import { statusLabel, statusReason, formatDate } from '@/lib/license/format';
import { APP_VERSION } from '@/lib/version';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Licença indisponível · Espaço Livre',
};

export default async function LicenseBlockedPage() {
  const supabase = createClient();
  const license = await getLicensePublic(supabase);

  const reason = statusReason(
    license?.status ?? 'nao_encontrado',
    license?.motivo ?? null,
    {
      data_validade: license?.data_validade ?? null,
      max_maquinas: license?.max_maquinas ?? null,
      maquinas_ativas: license?.maquinas_ativas ?? null,
    }
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg px-5 py-10">
      <div className="w-full max-w-sm space-y-5 rounded-3xl bg-white p-6 shadow-thumb">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[11.5px] font-bold text-brand-red">
            {statusLabel(license?.status ?? null)}
          </span>
          <h1 className="mt-3 text-[20px] font-extrabold text-brand-ink">
            Cardápio indisponível
          </h1>
          <p className="mt-1 text-[13px] font-medium text-brand-inkSoft">
            A licença deste sistema não está ativa no momento.
          </p>
        </div>

        <p className="rounded-2xl bg-brand-bg px-4 py-3 text-[13px] font-medium text-brand-ink">
          {reason}
        </p>

        {license?.data_validade ? (
          <p className="text-[12px] font-medium text-brand-inkSoft">
            Validade registrada:{' '}
            <span className="font-bold text-brand-ink">
              {formatDate(license.data_validade)}
            </span>
          </p>
        ) : null}

        <div className="space-y-2">
          <Link
            href="/admin/login?redirect=/admin/license"
            className="block w-full rounded-2xl bg-brand-red py-3 text-center text-[13.5px] font-bold text-white shadow-chip"
          >
            Entrar como administrador
          </Link>
          <p className="text-center text-[11px] font-medium text-brand-inkSoft">
            Versão{' '}
            <span className="font-mono font-bold">v{APP_VERSION}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
