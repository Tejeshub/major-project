import { createFileRoute } from "@tanstack/react-router";
import { useSellerOrders, useProducts } from "@/hooks/useMarketplace";
import { Counter, Skeleton, EmptyState } from "@/components/ui-brand/primitives";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/seller/")({
  component: SellerOverview,
});

function SellerOverview() {
  const { data: prodData, isLoading: prodLoading } = useProducts({ limit: 100 });
  const { data: ordData, isLoading: ordLoading, error } = useSellerOrders({ limit: 50 });
  
  const products = prodData?.items || [];
  const orders = ordData?.items || [];

  const updateStatus = async (id: string, status: string) => {
    toast.info("Status update not fully implemented in backend yet");
  };

  if (prodLoading || ordLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full card-warm" />)}
        </div>
        <Skeleton className="h-64 w-full card-warm" />
      </div>
    );
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Error" subtitle="Could not load dashboard data." />;
  }

  const revenue = orders.reduce((s: number, o: any) => s + (o.total_amount / 100), 0);
  const pending = orders.filter((o: any) => o.status !== "delivered").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { n: products.filter((p: any) => p.stock > 0).length, l: "Active listings" },
          { n: pending, l: "Pending orders" },
          { n: revenue, l: "Revenue (₹)", prefix: "₹" },
          { n: orders.length, l: "Total sales" },
        ].map((s, i) => (
          <div key={i} className="card-warm p-4">
            <p className="font-display text-3xl text-rust">{s.prefix || ""}<Counter to={s.n} /></p>
            <p className="eyebrow !text-ink/55 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-xl mb-3">Recent orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr><th className="pb-2">Order</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o: any) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">#{o.id.split("-")[0]}</td>
                  <td>{o.items.length}</td>
                  <td>₹{o.total_amount / 100}</td>
                  <td>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="bg-secondary rounded-full px-3 py-1 text-xs capitalize">
                      {["placed", "paid", "confirmed", "shipped", "delivered"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
