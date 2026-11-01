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
      className="font-medium text-foreground/50 hover:text-primary disabled:opacity-50"
    >
      Delete
    </button>
  );
}
