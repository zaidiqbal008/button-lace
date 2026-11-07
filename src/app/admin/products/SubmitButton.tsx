"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export function FormActions({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
      <Link
        href="/admin"
        className="rounded-full px-4 py-2.5 text-sm font-medium text-foreground/60 transition hover:bg-surface-muted hover:text-foreground"
      >
        Cancel
      </Link>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        {pending ? "Saving…" : label}
      </button>
    </div>
  );
}
