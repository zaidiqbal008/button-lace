"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

export type PlaceOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  notes?: string;
  paymentMethod: "cod" | "bank_transfer";
  items: CartItem[];
};

export async function placeOrder(input: PlaceOrderInput) {
  if (input.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const supabase = await createClient();
  const total = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      shipping_address: input.shippingAddress,
      city: input.city,
      notes: input.notes || null,
      payment_method: input.paymentMethod,
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not place order." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  return { orderId: order.id as string };
}
