import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";
import type { Product } from "@/data/seed"; // Temporary type import, will refine later

// Standardized Query Keys
export const QUERY_KEYS = {
  products: (params: any) => ["products", params],
  product: (id: string) => ["product", id],
  orders: () => ["orders"],
  sellerOrders: () => ["seller-orders"],
};

// 1. Fetch Products List
export function useProducts(params: { limit?: number; offset?: number; category?: string; keyword?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      if (params.category && params.category !== "All") searchParams.set("category", params.category);
      if (params.keyword) searchParams.set("keyword", params.keyword);

      const qs = searchParams.toString();
      return fetchWithAuth(`/products${qs ? `?${qs}` : ""}`);
    },
  });
}

// 2. Fetch Single Product
export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => fetchWithAuth(`/products/${id}`),
    enabled: !!id,
  });
}

export function useOrderSummary(cartItems: { productId: string; qty: number }[]) {
  return useQuery({
    queryKey: ["order-summary", cartItems],
    queryFn: () => {
      if (cartItems.length === 0) return null;
      return fetchWithAuth("/orders/summary", {
        method: "POST",
        body: JSON.stringify({ 
          items: cartItems.map(c => ({ product_id: c.productId, quantity: c.qty })) 
        }),
      });
    },
    enabled: cartItems.length > 0,
  });
}

// 3. Create Order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { items: { product_id: string; quantity: number }[] }) => {
      return fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders() });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// 4. Verify Payment
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: any }) => {
      return fetchWithAuth(`/orders/${orderId}/verify`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders() });
    },
  });
}

// 5. Seller Orders
export function useSellerOrders(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.sellerOrders(),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      const qs = searchParams.toString();
      return fetchWithAuth(`/orders/seller${qs ? `?${qs}` : ""}`);
    },
  });
}

// 5b. Buyer Orders
export function useOrders(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.orders(),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      const qs = searchParams.toString();
      return fetchWithAuth(`/orders${qs ? `?${qs}` : ""}`);
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchWithAuth(`/orders/${id}`),
    enabled: !!id,
  });
}

// 6. Manage Seller Products
export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return fetchWithAuth("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => {
      return fetchWithAuth(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return fetchWithAuth(`/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
