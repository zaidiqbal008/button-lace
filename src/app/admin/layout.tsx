import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2 lg:flex-1 lg:basis-0">
            <Image
              src="/logo.png"
              alt="Stitch Bazaar"
              width={1701}
              height={773}
              className="h-8 w-auto"
              priority
            />
            <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-dark sm:inline-block">
              Admin
            </span>
          </Link>

          <div className="flex flex-1 justify-center">
            <AdminNav />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 lg:flex-1 lg:basis-0">
            <Link
              href="/"
              aria-label="View store"
              title="View store"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition hover:border-primary-light hover:text-foreground md:h-auto md:w-auto md:border-0 md:px-0 md:text-sm md:font-medium"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 md:hidden"
                aria-hidden="true"
              >
                <path d="M3 9.5 4.5 4h15L21 9.5" />
                <path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
                <path d="M5 12v8h14v-8" />
              </svg>
              <span className="hidden md:inline">View store ↗</span>
            </Link>
            <SignOutButton />
            <span
              title={user.email}
              className="hidden max-w-[180px] truncate text-sm text-foreground/50 lg:block"
            >
              {user.email}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
