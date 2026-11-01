import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, admin] = await Promise.all([
    getProducts({ categorySlug: slug }),
    isAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-foreground/60">{category.description}</p>
          )}
        </div>
        {admin && (
          <Link
            href={`/admin/products/new?category=${category.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <span aria-hidden className="text-base leading-none">+</span>
            Add item
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-8 text-center text-foreground/60">
          No products in this category yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
