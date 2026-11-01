"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await signIn(
      String(formData.get("email") || ""),
      String(formData.get("password") || "")
    );
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-foreground">Admin sign in</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Use the account you created in Supabase Auth.
      </p>
      <form action={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-foreground/80">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground/80">Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
