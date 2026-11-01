import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/queries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">{category.name}</h1>
      {category.description && (
        <p className="mt-2 text-foreground/60">{category.description}</p>
      )}

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
