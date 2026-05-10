import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMyProfile } from '@/lib/permissions';
import BackupActions from '../_components/BackupActions';

export const dynamic = 'force-dynamic';

export default async function BackupPage() {
  const me = await getMyProfile();
  if (!me?.is_owner) {
    redirect('/admin');
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[12px] font-bold text-brand-inkSoft hover:text-brand-ink"
      >
        ← Voltar
      </Link>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <h2 className="text-[15px] font-extrabold text-brand-ink">
          Backup e restauração
        </h2>
        <p className="mt-1 text-[12.5px] font-medium text-brand-inkSoft">
          Exporte um arquivo .json com todas as categorias, itens e
          configurações. Guarde em local seguro (Drive, email, pendrive). Para
          restaurar, suba o mesmo arquivo aqui — o sistema vai{' '}
          <strong className="text-brand-ink">apagar tudo</strong> e recriar a
          partir do backup.
        </p>

        <div className="mt-4">
          <BackupActions />
        </div>
      </section>
    </div>
  );
}
