'use client';

import { useEffect, useRef, useState } from 'react';

export default function ExpandableDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const truncated = el.scrollWidth > el.clientWidth + 1;
      setOverflows(truncated);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className="mt-0.5">
      <p
        ref={ref}
        className={
          expanded
            ? 'text-[11.5px] font-medium text-brand-inkSoft'
            : 'line-clamp-1 text-[11.5px] font-medium text-brand-inkSoft'
        }
      >
        {text}
      </p>
      {overflows ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-0.5 text-[11px] font-bold text-brand-red hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? 'ver menos' : 'ver mais'}
        </button>
      ) : null}
    </div>
  );
}
