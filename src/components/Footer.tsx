import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl text-primary-dark">Stitch Bazaar</h3>
          <p className="mt-2 max-w-xs text-sm text-foreground/70">
            Laces, dupattas, and trims for tailoring and custom dyeing, curated
            in small batches and shipped nationwide.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Shop
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-primary-dark" href="/products">All products</Link></li>
            <li><Link className="hover:text-primary-dark" href="/categories/laces">Laces</Link></li>
            <li><Link className="hover:text-primary-dark" href="/categories/motifs">Motifs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Support
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>Cash on delivery &amp; bank transfer</li>
            <li>Delivery across Pakistan</li>
            <li>Questions? Reach us anytime.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} Stitch Bazaar. All rights reserved.
      </div>
    </footer>
  );
}
