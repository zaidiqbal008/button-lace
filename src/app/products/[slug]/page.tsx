import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground/40">
              No image yet
            </div>
          )}
        </div>

        <div>
          {product.is_dyeable && (
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-dark">
              Dyeable
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl text-foreground">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-primary-dark">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-foreground/40 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-foreground/70">
              {product.description}
            </p>
          )}

          <p className="mt-4 text-sm text-foreground/60">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Currently out of stock"}
          </p>

          <div className="mt-6 max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
