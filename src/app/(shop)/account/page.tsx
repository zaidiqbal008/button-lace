import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { SignOutButton } from "./SignOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  // Admins run the shop rather than buy from it.
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            {profile?.full_name ? `Hello, ${profile.full_name}` : "Your account"}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <h2 className="mt-10 font-display text-xl text-foreground">Your orders</h2>

      {!orders?.length ? (
        <div className="mt-4 rounded-2xl border border-border bg-surface-muted/50 p-8 text-center">
          <p className="text-sm text-foreground/70">
            You have no orders yet. Orders placed while signed in will appear here.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-foreground/60">
                  {new Date(order.created_at).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs capitalize text-foreground/70">
                  {order.status}
                </span>
                <span className="text-sm font-semibold text-primary-dark">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
