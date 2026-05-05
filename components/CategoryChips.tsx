'use client';

import type { MenuCategory } from '@/lib/menu';

type Props = {
  categories: MenuCategory[];
  active: string;
  onChange: (id: string) => void;
};

export default function CategoryChips({ categories, active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-30 -mx-px bg-brand-bg/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/80">
      <div className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5">
        <Chip
          icon="✦"
          label="Todos"
          active={active === 'all'}
          onClick={() => onChange('all')}
        />
        {categories.map((c) => (
          <Chip
            key={c.id}
            icon={c.icon}
            label={c.name}
            active={active === c.id}
            onClick={() => onChange(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'snap-start whitespace-nowrap rounded-full px-4 text-[13px] font-semibold transition-all',
        'flex h-11 min-h-[44px] items-center gap-1.5',
        active
          ? 'bg-brand-red text-white shadow-chip'
          : 'bg-white text-brand-ink',
      ].join(' ')}
      style={
        active
          ? undefined
          : { border: '1.5px solid #F5E6D6' }
      }
    >
      <span aria-hidden className="text-[14px] leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
