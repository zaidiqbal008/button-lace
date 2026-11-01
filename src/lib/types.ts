export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  stock: number;
  is_dyeable: boolean;
  is_active: boolean;
  created_at: string;
};

export type ProductWithCategory = Product & {
  category: Category | null;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  notes: string | null;
  payment_method: "cod" | "bank_transfer";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};
