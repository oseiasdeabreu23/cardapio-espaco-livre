type Variant = 'p' | 'g' | 'kg' | 'm' | 's';

type Props = {
  label: string;
  value: number;
  variant?: Variant;
  small?: boolean;
};

const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function PriceBadge({
  label,
  value,
  variant = 'p',
  small = false,
}: Props) {
  const bg =
    variant === 'g' || variant === 'kg' ? '#FFE0CC' : '#FFF1E5';

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-xl font-bold tabular-nums',
        small ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[12.5px]',
      ].join(' ')}
      style={{ backgroundColor: bg, color: '#231510' }}
    >
      <span className="font-extrabold uppercase tracking-wide text-brand-orange">
        {label}
      </span>
      <span className="opacity-90">R$ {formatBRL(value)}</span>
    </span>
  );
}
