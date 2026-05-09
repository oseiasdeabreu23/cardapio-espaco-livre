import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMyProfile, profileHas } from '@/lib/permissions';
import type { Profile } from '@/lib/supabase/types';
import NewAdminForm from '../_components/NewAdminForm';
import AdminListItem from '../_components/AdminListItem';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const me = await getMyProfile();
  if (!profileHas(me, 'manage_users')) {
    redirect('/admin');
  }

  const supabase = createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('is_owner', { ascending: false })
    .order('created_at', { ascending: true });

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
          Cadastrar novo admin
        </h2>
        <div className="mt-3">
          <NewAdminForm />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-thumb">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-brand-ink">
            Admins cadastrados
          </h2>
          <span className="rounded-full bg-brand-bg px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-inkSoft">
            {(profiles ?? []).length}
          </span>
        </div>
        <ul className="mt-3 divide-y divide-brand-line">
          {((profiles ?? []) as Profile[]).map((p) => (
            <AdminListItem
              key={p.user_id}
              profile={p}
              currentUserId={me!.user_id}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
