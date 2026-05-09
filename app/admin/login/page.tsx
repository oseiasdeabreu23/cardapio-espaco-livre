import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login admin · Espaço Livre',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-[22px] font-extrabold text-brand-ink">
            Admin · Espaço Livre
          </h1>
          <p className="mt-1 text-[12.5px] font-medium text-brand-inkSoft">
            Entre para gerenciar o cardápio.
          </p>
        </div>
        <LoginForm redirectTo={searchParams.redirect ?? '/admin'} />
      </div>
    </main>
  );
}
