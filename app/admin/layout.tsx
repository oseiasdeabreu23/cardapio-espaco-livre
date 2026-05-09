import Link from 'next/link';
import { signOutAction } from './_actions/auth';
import { getMyProfile, profileHas } from '@/lib/permissions';

export const metadata = {
  title: 'Admin · Espaço Livre',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMyProfile();

  if (!me) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-brand-line bg-white px-5 py-3 shadow-thumb">
        <Link
          href="/admin"
          className="text-[15px] font-extrabold text-brand-ink"
        >
          Admin · Espaço Livre
        </Link>
        {profileHas(me, 'manage_users') ? (
          <Link
            href="/admin/users"
            className="ml-3 rounded-full bg-brand-bg px-3 py-1 text-[11.5px] font-bold text-brand-ink hover:bg-brand-line"
          >
            Usuários
          </Link>
        ) : null}
        <span className="ml-auto truncate text-[11.5px] font-medium text-brand-inkSoft">
          {me.display_name && me.display_name !== me.email
            ? me.display_name
            : me.email}
        </span>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-full bg-brand-bg px-3 py-1.5 text-[11.5px] font-bold text-brand-ink hover:bg-brand-line"
          >
            Sair
          </button>
        </form>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-6">{children}</div>
    </div>
  );
}
