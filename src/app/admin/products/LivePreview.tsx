"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";

type PreviewState = {
  name: string;
  price: number;
  compareAt: number | null;
  stock: number;
  isDyeable: boolean;
  isActive: boolean;
  imageUrl: string | null;
};

export function LivePreview({
  initial,
  children,
}: {
  initial: PreviewState;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [state, setState] = useState<PreviewState>(initial);

  const sync = useCallback(() => {
    const form = wrapRef.current?.querySelector("form");
    if (!form) return;

    const data = new FormData(form);
    const num = (key: string) => {
      const raw = String(data.get(key) ?? "").trim();
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };

    const file = data.get("image");
    let imageUrl = initial.imageUrl;

    if (file instanceof File && file.size > 0) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(file);
      imageUrl = objectUrlRef.current;
    }

    setState({
      name: String(data.get("name") ?? "").trim(),
      price: num("price") ?? 0,
      compareAt: num("compare_at_price"),
      stock: num("stock") ?? 0,
      isDyeable: data.get("is_dyeable") !== null,
      isActive: data.get("is_active") !== null,
      imageUrl,
    });
  }, [initial.imageUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const outOfStock = state.stock <= 0;
  const discounted = state.compareAt !== null && state.compareAt > state.price;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div ref={wrapRef} onInput={sync} onChange={sync}>
        {children}
      </div>

      <aside className="xl:sticky xl:top-24">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Live preview
          </h2>
          {!state.isActive && (
            <span className="rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[11px] font-medium text-foreground/50">
              Hidden
            </span>
          )}
        </div>

        <div
          className={`overflow-hidden rounded-2xl border border-border bg-surface transition ${
            state.isActive ? "" : "opacity-55 saturate-50"
          }`}
        >
          <div className="relative aspect-square overflow-hidden bg-surface-muted">
            {state.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-foreground/35">
                No image yet
              </div>
            )}
            {outOfStock && (
              <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-white">
                Out of stock
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 p-4">
            {state.isDyeable && (
              <span className="w-fit rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-dark">
                Dyeable
              </span>
            )}
            <p className="font-display text-lg leading-snug text-foreground">
              {state.name || <span className="text-foreground/30">Product name</span>}
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-semibold text-primary-dark tabular-nums">
                {formatPrice(state.price)}
              </span>
              {discounted && (
                <span className="text-sm text-foreground/40 line-through tabular-nums">
                  {formatPrice(state.compareAt as number)}
                </span>
              )}
            </div>
            <button
              type="button"
              disabled
              className="mt-2 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white opacity-90"
            >
              Add to cart
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-foreground/50">
          How this product will appear in the shop.
          {discounted && ` Saves ${formatPrice((state.compareAt as number) - state.price)}.`}
        </p>
      </aside>
    </div>
  );
}
