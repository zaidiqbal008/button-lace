"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => {
        addItem(
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            imageUrl: product.image_url,
          },
          quantity
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="mt-2 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-foreground/20"
    >
      {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
