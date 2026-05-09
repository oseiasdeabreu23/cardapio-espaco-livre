'use client';

import { useState, useTransition } from 'react';
import type { Item } from '@/lib/supabase/types';
import { updateItemAction } from '../_actions/items';
import { uploadImageAction } from '../_actions/upload';

type Props = {
  item: Item;
  onSaved: (updated: Item) => void;
};

function sizesToText(sizes: number[] | null): string {
  if (!sizes || sizes.length === 0) return '';
  return sizes.join(' / ');
}

function priceToText(price: number | null): string {
  if (price == null) return '';
  return String(price).replace('.', ',');
}

export default function ItemEditor({ item, onSaved }: Props) {
  const [imgUrl, setImgUrl] = useState<string>(item.img_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.set('file', file);
      const result = await uploadImageAction(fd);
      if (result.success) {
        setImgUrl(result.url);
      } else {
        setUploadError(result.error);
      }
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    start(async () => {
      await updateItemAction(fd);
      onSaved({
        ...item,
        name: String(fd.get('name') ?? item.name),
        description: (fd.get('description') as string) || null,
        price: parsePrice(String(fd.get('price') ?? '')),
        sizes: parseSizes(String(fd.get('sizes') ?? '')),
        img_url: String(fd.get('img_url') ?? '') || null,
        is_visible: fd.get('is_visible') === 'on',
      });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="category_id" value={item.category_id} />
      <input type="hidden" name="img_url" value={imgUrl} />

      <div className="flex items-start gap-3">
        <div
          className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white"
          style={{
            backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="flex-1 space-y-2">
          <label className="block">
            <span className="text-[11.5px] font-bold text-brand-inkSoft">
              Imagem (URL ou upload)
            </span>
            <input
              type="text"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[12.5px] text-brand-ink outline-none focus:border-brand-orange"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-[11.5px] font-bold text-brand-ink hover:bg-brand-line">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            {uploading ? 'Enviando…' : '📷 Subir foto'}
          </label>
          {uploadError ? (
            <p className="text-[11.5px] font-bold text-brand-red">
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">Nome</span>
        <input
          name="name"
          defaultValue={item.name}
          required
          className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <label className="block">
        <span className="text-[11.5px] font-bold text-brand-inkSoft">
          Descrição
        </span>
        <input
          name="description"
          defaultValue={item.description ?? ''}
          className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[12.5px] text-brand-ink outline-none focus:border-brand-orange"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Preço único (R$)
          </span>
          <input
            name="price"
            defaultValue={priceToText(item.price)}
            placeholder="12,50"
            inputMode="decimal"
            className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
          />
        </label>
        <label className="block">
          <span className="text-[11.5px] font-bold text-brand-inkSoft">
            Tamanhos (P / G ou 1kg / 500g / 300g)
          </span>
          <input
            name="sizes"
            defaultValue={sizesToText(item.sizes)}
            placeholder="33 / 55"
            className="mt-1 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-[13.5px] font-medium text-brand-ink outline-none focus:border-brand-orange"
          />
        </label>
      </div>
      <p className="text-[10.5px] font-medium text-brand-inkSoft">
        Use só um dos campos. Tamanhos: separe por vírgula, espaço ou /. Ex: 33 55 ou 190 / 105 / 75.
      </p>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_visible"
          defaultChecked={item.is_visible}
        />
        <span className="text-[12px] font-medium text-brand-ink">
          Visível no cardápio
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-bold text-white shadow-chip disabled:opacity-60"
      >
        {pending ? 'Salvando…' : 'Salvar alterações'}
      </button>
    </form>
  );
}

function parsePrice(raw: string): number | null {
  const cleaned = raw.replace(/\./g, '').replace(',', '.').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseSizes(raw: string): number[] | null {
  const values = raw
    .split(/[,\s/|]+/)
    .map((s) => s.replace(',', '.').trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
  return values.length > 0 ? values : null;
}
