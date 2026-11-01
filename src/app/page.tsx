import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/queries";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-surface-muted to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-dark">
            Handpicked trims, delivered nationwide
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Laces, dupattas &amp; trims
            <br className="hidden sm:block" /> made for your own creations
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-foreground/70">
            Dyeable laces, ready dupattas, and finishing buttons for tailors,
            designers, and anyone customizing their own outfits.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/products"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Shop all products
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl text-foreground">Shop by category</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-primary-light hover:shadow-md"
              >
                <h3 className="font-display text-xl text-primary-dark">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-sm text-foreground/60">
                    {category.description}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-accent-dark group-hover:underline">
                  Browse →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-foreground">New arrivals</h2>
          <Link href="/products" className="text-sm font-medium text-accent-dark hover:underline">
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-foreground/60">
            No products yet. Add some from the admin dashboard once Supabase
            is connected.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
