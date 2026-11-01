import type { Category, Product } from "@/lib/types";

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <Field name="name" label="Product name" defaultValue={product?.name} required />

      <label className="block text-sm">
        <span className="font-medium text-foreground/80">Category</span>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground/80">Description</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field name="price" label="Price (Rs.)" type="number" step="0.01" defaultValue={product?.price} required />
        <Field
          name="compare_at_price"
          label="Compare-at price (optional)"
          type="number"
          step="0.01"
          defaultValue={product?.compare_at_price ?? undefined}
        />
      </div>

      <Field name="image_url" label="Image URL" defaultValue={product?.image_url ?? ""} />
      <Field name="stock" label="Stock" type="number" defaultValue={product?.stock ?? 0} required />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_dyeable" defaultChecked={product?.is_dyeable} />
          Dyeable
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
          Active (visible in store)
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  step,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
