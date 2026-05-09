'use client';

import { useTransition } from 'react';
import { setOpenStatusAction } from '../_actions/settings';

export default function OpenToggle({ initial }: { initial: boolean }) {
  const [pending, start] = useTransition();

  const onToggle = (next: boolean) => {
    start(async () => {
      const fd = new FormData();
      fd.set('is_open', String(next));
      await setOpenStatusAction(fd);
    });
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-brand-bg p-1">
      <button
        type="button"
        onClick={() => onToggle(true)}
        disabled={pending}
        className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
          initial
            ? 'bg-brand-green/90 text-white shadow-chip'
            : 'text-brand-inkSoft hover:text-brand-ink'
        }`}
      >
        🟢 Aberto
      </button>
      <button
        type="button"
        onClick={() => onToggle(false)}
        disabled={pending}
        className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
          !initial
            ? 'bg-brand-red text-white shadow-chip'
            : 'text-brand-inkSoft hover:text-brand-ink'
        }`}
      >
        ⏸ Fechado
      </button>
    </div>
  );
}
