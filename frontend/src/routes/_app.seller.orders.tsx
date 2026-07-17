import { createFileRoute } from "@tanstack/react-router";
import { useSellerOrders } from "@/hooks/useMarketplace";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton, EmptyState } from "@/components/ui-brand/primitives";
import { useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

export const Route = createFileRoute("/_app/seller/orders")({
  component: SellerOrders,
});

const STATUSES = ["placed", "paid", "confirmed", "shipped", "delivered"] as const;

function SellerOrders() {
  const { data, isLoading, error } = useSellerOrders({ limit: 50 });
  const orders = data?.items || [];
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<string>("All");
  const list = orders.filter((o: any) => filter === "All" || o.status === filter);

  // Mock status update since we don't have a dedicated hook yet
  const updateStatus = async (id: string, status: string) => {
    toast.info("Status update not fully implemented in backend yet");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-full" />
        <div className="card-warm overflow-x-auto p-4 space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Error" subtitle="Could not load incoming orders." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap capitalize ${filter === s ? "bg-rust text-white" : "bg-secondary"}`}>{s}</button>
        ))}
      </div>
      <div className="card-warm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr><th className="p-3">Order</th><th>Buyer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {list.map((o: any) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3 font-medium">#{o.id.split("-")[0]}</td>
                <td>{"Customer"}</td>
                <td>{o.items.map((i: any) => i.product?.name || `Item`).join(", ")}</td>
                <td>₹{o.total_amount / 100}</td>
                <td className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="bg-secondary rounded-full px-3 py-1 text-xs capitalize">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
