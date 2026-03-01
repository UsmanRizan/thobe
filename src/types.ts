export type Width = "S" | "M" | "L" | "XL" | "XXL";
export type Length =
  | "53"
  | "54"
  | "55"
  | "56"
  | "57"
  | "58"
  | "59"
  | "60"
  | "61"
  | "62";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export type Page =
  | "home"
  | "shipping"
  | "returns"
  | "contact"
  | "track"
  | "faq"
  | "admin";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  width: Width;
  length: Length;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
