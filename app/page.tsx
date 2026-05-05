import Hero from '@/components/Hero';
import MenuView from '@/components/MenuView';
import { MENU } from '@/lib/menu';

export default function Page() {
  return (
    <main>
      <Hero />
      <MenuView categories={MENU} />
      <footer className="px-5 pb-10 pt-6 text-center text-[11px] font-medium text-brand-inkSoft">
        ✦ Espaço Livre · Churrascaria &amp; Pizzaria ✦
      </footer>
    </main>
  );
}
