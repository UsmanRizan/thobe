const API_BASE_URL = "http://localhost:3002/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  message?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  width: string;
  length: string;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  email: string;
  address: string;
  phone: string;
  items: CartItem[];
  total_price: number;
}

export interface OrderData {
  id: string;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  items: CartItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPayload {
  user_name: string;
  rating: number;
  comment: string;
}

export interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TrackingData {
  orderId: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createOrder(orderData: OrderPayload): Promise<OrderData> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const json: ApiResponse<OrderData> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to create order");
    }

    return json.data as OrderData;
  }

  async getOrder(orderId: string): Promise<OrderData> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`);
    const json: ApiResponse<OrderData> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to fetch order");
    }

    return json.data as OrderData;
  }

  async trackOrder(orderId: string): Promise<TrackingData> {
    const response = await fetch(`${this.baseUrl}/orders/track/${orderId}`);
    const json: ApiResponse<TrackingData> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || "Order not found");
    }

    return json.data as TrackingData;
  }

  async getReviews(): Promise<ReviewData[]> {
    const response = await fetch(`${this.baseUrl}/reviews`);
    const json: ApiResponse<ReviewData[]> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to fetch reviews");
    }

    return json.data as ReviewData[];
  }

  async createReview(reviewData: ReviewPayload): Promise<ReviewData> {
    const response = await fetch(`${this.baseUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const json: ApiResponse<ReviewData> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to create review");
    }

    return json.data as ReviewData;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
