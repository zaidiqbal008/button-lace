import { getCategories } from "@/lib/queries";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage(
  props: PageProps<"/admin/products/new">
) {
  const [categories, searchParams] = await Promise.all([
    getCategories(),
    props.searchParams,
  ]);

  const requested = searchParams.category;
  const preselected = Array.isArray(requested) ? requested[0] : requested;

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">New product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={createProduct}
          defaultCategoryId={preselected}
        />
      </div>
    </div>
  );
}
