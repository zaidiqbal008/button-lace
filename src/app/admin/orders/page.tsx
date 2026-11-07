import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (orders ?? []) as Order[];

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">Orders</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-foreground/60">
            <tr>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Customer</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id} className="border-t border-border align-top">
                <td className="px-4 py-3 text-foreground/50">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
                <td className="px-4 py-3 capitalize">{order.payment_method.replace("_", " ")}</td>
                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">{order.city}</td>
                <td className="px-4 py-3">{order.customer_phone}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-foreground/50">{order.customer_email}</div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-foreground/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
