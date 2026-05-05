'use client';

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="px-5 pt-5">
      <label
        className="flex h-[50px] items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_4px_14px_rgba(35,21,16,0.05)]"
        style={{ border: '1px solid #F5E6D6' }}
      >
        <svg
          aria-hidden
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0867A"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar prato, bebida..."
          aria-label="Buscar no cardápio"
          className="min-w-0 flex-1 bg-transparent text-[14.5px] font-medium text-brand-ink placeholder:text-brand-rose/80 focus:outline-none"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Limpar busca"
            className="grid h-11 w-11 -mr-2 place-items-center rounded-full text-brand-inkSoft transition-colors hover:text-brand-red"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        ) : null}
      </label>
    </div>
  );
}
