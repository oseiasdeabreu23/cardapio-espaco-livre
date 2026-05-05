import type { MenuCategory, MenuItem } from '@/lib/menu';
import MenuItemRow from './MenuItemRow';

type Props = {
  category: MenuCategory;
  items: MenuItem[];
};

export default function CategorySection({ category, items }: Props) {
  return (
    <section id={category.id} className="px-5 pt-7 scroll-mt-24">
      <header className="flex items-center gap-3">
        <div
          className="grid h-[38px] w-[38px] place-items-center rounded-xl text-[18px] text-white shadow-chip"
          style={{
            background:
              'linear-gradient(135deg, #C8141C 0%, #E5611B 60%, #F08A2E 100%)',
          }}
          aria-hidden
        >
          {category.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold leading-tight text-brand-ink">
            {category.name}
          </h2>
          {category.subtitle ? (
            <p className="text-[11.5px] font-medium text-brand-inkSoft">
              {category.subtitle}
            </p>
          ) : null}
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums"
          style={{ backgroundColor: '#FFF1E5', color: '#E5611B' }}
        >
          {items.length}
        </span>
      </header>

      <div className="mt-3">
        {items.map((it) => (
          <MenuItemRow key={category.id + '-' + it.name} item={it} />
        ))}
      </div>
    </section>
  );
}
