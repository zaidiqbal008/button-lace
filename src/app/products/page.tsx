import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">All products</h1>
      <p className="mt-2 text-foreground/60">
        Browse our full collection of laces, dupattas, and trims.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-8 text-center text-foreground/60">
          No products yet. Add some from the admin dashboard once Supabase is
          connected.
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
