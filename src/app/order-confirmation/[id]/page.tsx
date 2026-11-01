import Link from "next/link";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-3xl text-foreground">Thank you for your order!</h1>
      <p className="mt-3 text-foreground/70">
        We&apos;ve received your order and will reach out shortly to confirm
        delivery details.
      </p>
      <p className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground/60">
        Order reference: <span className="font-mono">{id}</span>
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Continue shopping
      </Link>
    </div>
  );
}
