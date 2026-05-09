import Link from 'next/link';
import { signOutAction } from './_actions/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Admin · Espaço Livre',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page renders without header
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-brand-line bg-white px-5 py-3 shadow-thumb">
        <Link href="/admin" className="text-[15px] font-extrabold text-brand-ink">
          Admin · Espaço Livre
        </Link>
        <span className="ml-auto truncate text-[11.5px] font-medium text-brand-inkSoft">
          {user.email}
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
