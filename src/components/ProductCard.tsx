import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-surface-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground/40">
            No image yet
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.is_dyeable && (
          <span className="w-fit rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-dark">
            Dyeable
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="font-display text-lg leading-snug text-foreground hover:text-primary-dark">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="font-semibold text-primary-dark">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="ml-2 text-sm text-foreground/40 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
