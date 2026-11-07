"use client";

import { useTransition } from "react";
import { deleteProduct } from "./products/actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this product? This cannot be undone.")) return;
        startTransition(() => deleteProduct(productId));
      }}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/50 transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
