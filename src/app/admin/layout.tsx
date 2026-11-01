import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

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
    return <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg text-primary-dark">
            Admin
          </Link>
          <Link href="/admin/products/new" className="text-sm font-medium hover:text-primary-dark">
            New product
          </Link>
          <Link href="/admin/orders" className="text-sm font-medium hover:text-primary-dark">
            Orders
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm text-foreground/60">
          <span>{user.email}</span>
          <SignOutButton />
        </div>
      </div>
      <div className="py-8">{children}</div>
    </div>
  );
}
