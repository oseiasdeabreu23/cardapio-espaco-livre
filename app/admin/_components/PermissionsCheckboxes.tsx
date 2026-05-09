'use client';

import {
  PERMISSIONS,
  PERMISSION_LABELS,
  type Permission,
} from '@/lib/supabase/types';

type Props = {
  defaultSelected?: Permission[];
  disabled?: boolean;
};

export default function PermissionsCheckboxes({
  defaultSelected = [],
  disabled = false,
}: Props) {
  const set = new Set(defaultSelected);
  return (
    <fieldset className="space-y-2 rounded-2xl border border-brand-line bg-brand-bg p-4">
      <legend className="px-1 text-[11.5px] font-bold text-brand-inkSoft">
        Permissões
      </legend>
      {PERMISSIONS.map((perm) => (
        <label
          key={perm}
          className="flex cursor-pointer items-start gap-2 text-[13px] font-medium text-brand-ink"
        >
          <input
            type="checkbox"
            name={`perm:${perm}`}
            defaultChecked={set.has(perm)}
            disabled={disabled}
            className="mt-1"
          />
          <span>{PERMISSION_LABELS[perm]}</span>
        </label>
      ))}
    </fieldset>
  );
}
