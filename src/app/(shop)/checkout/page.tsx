"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const result = await placeOrder({
      customerName: String(formData.get("name") || ""),
      customerEmail: String(formData.get("email") || ""),
      customerPhone: String(formData.get("phone") || ""),
      shippingAddress: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      notes: String(formData.get("notes") || ""),
      paymentMethod: formData.get("paymentMethod") === "bank_transfer" ? "bank_transfer" : "cod",
      items,
    });

    setSubmitting(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/order-confirmation/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-foreground/60">Add something to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full name" required />
            <Field name="phone" label="Phone number" type="tel" required />
          </div>
          <Field name="email" label="Email" type="email" required />
          <Field name="address" label="Shipping address" required textarea />
          <Field name="city" label="City" required />
          <Field name="notes" label="Order notes (optional)" textarea />

          <fieldset className="rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-medium text-foreground/70">
              Payment method
            </legend>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="radio" name="paymentMethod" value="cod" defaultChecked />
              Cash on delivery
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="radio" name="paymentMethod" value="bank_transfer" />
              Bank transfer (details sent after order)
            </label>
          </fieldset>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-border bg-surface-muted p-6">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      )}
    </label>
  );
}
