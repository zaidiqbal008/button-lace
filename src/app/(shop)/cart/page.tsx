"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-foreground/60">
          Browse our laces, dupattas, and trims to find something you love.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">Your cart</h1>

      <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary-dark">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-foreground/60">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full border border-border text-sm"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                className="h-8 w-8 rounded-full border border-border text-sm"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
            <button
              className="text-sm text-foreground/40 hover:text-primary"
              onClick={() => removeItem(item.productId)}
              aria-label="Remove item"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-surface-muted p-6">
        <span className="font-display text-xl">Subtotal</span>
        <span className="font-display text-xl text-primary-dark">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/checkout"
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
