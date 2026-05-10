import Hero from '@/components/Hero';
import MenuView from '@/components/MenuView';
import ClosedBanner from '@/components/ClosedBanner';
import { getMenu, getSettings } from '@/lib/menu-data';

export const revalidate = 0;

export default async function Page() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);

  return (
    <main>
      {!settings.is_open ? (
        <ClosedBanner message={settings.closed_message} />
      ) : null}
      <Hero isOpen={settings.is_open} />
      <MenuView categories={menu} />
      <footer className="px-5 pb-10 pt-6 text-center text-[11px] font-medium text-brand-inkSoft">
        ✦ Espaço Livre · Churrascaria &amp; Pizzaria ✦
      </footer>
    </main>
  );
}
