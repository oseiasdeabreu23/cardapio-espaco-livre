import Image from 'next/image';
import type { MenuItem } from '@/lib/menu';
import PriceBadge from './PriceBadge';
import ExpandableDescription from './ExpandableDescription';

const ALLOWED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'live.staticflickr.com',
  'wxhqhyavwgjcqiolokzp.supabase.co',
]);

function isSafeImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const showImage = isSafeImageUrl(item.img);
  return (
    <article
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: '1px dashed #F0E2D2' }}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-[14.5px] font-bold uppercase leading-tight tracking-wide text-brand-ink">
          {item.name}
        </h3>
        {item.desc ? <ExpandableDescription text={item.desc} /> : null}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {item.sizes ? (
            <>
              <PriceBadge label="P" value={item.sizes[0]} variant="p" />
              <PriceBadge label="G" value={item.sizes[1]} variant="g" />
            </>
          ) : null}

          {item.sizes3 ? (
            <>
              <PriceBadge label="1kg" value={item.sizes3[0]} variant="kg" small />
              <PriceBadge label="500g" value={item.sizes3[1]} variant="m" small />
              <PriceBadge label="300g" value={item.sizes3[2]} variant="s" small />
            </>
          ) : null}

          {item.price !== undefined ? (
            <span className="text-[15.5px] font-extrabold tabular-nums text-brand-red">
              R$ {formatBRL(item.price)}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-bg shadow-thumb"
        style={{ border: '2px solid #FFFFFF' }}
      >
        {showImage ? (
          <Image
            src={item.img}
            alt={item.name}
            fill
            loading="lazy"
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="text-xl font-extrabold text-brand-inkSoft"
          >
            {item.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </article>
  );
}
