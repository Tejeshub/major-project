import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders } from "@/hooks/useMarketplace";
import { EmptyState, Skeleton } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/orders/")({
  head: () => ({ meta: [{ title: "Orders — PlantNest" }] }),
  component: Orders,
});

const STATUS_COLOR: Record<string, string> = {
  placed: "bg-amber-soft text-ink",
  paid: "bg-rust-soft/40 text-rust",
  confirmed: "bg-rust-soft/40 text-rust",
  shipped: "bg-indigo-dusk/20 text-indigo-dusk",
  delivered: "bg-sage/30 text-sage",
};

function Orders() {
  const { data, isLoading, error } = useOrders({ limit: 50 });
  const orders = data?.items || [];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48 mb-6" />
        <ul className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full card-warm" />)}
        </ul>
      </div>
    );
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Error" subtitle="Could not load your orders." />;
  }

  if (orders.length === 0) return <EmptyState icon="📦" title="No orders yet" action={<Link to="/market" className="btn-rust">Start shopping →</Link>} />;
  
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <p className="eyebrow">Your orders</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Orders</h1>
      </div>
      <ul className="space-y-2">
        {orders.map((o: any) => (
          <li key={o.id} className="card-warm card-warm-hover p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">#{o.id.split("-")[0]}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} {o.items.length === 1 ? "item" : "items"} · ₹{o.total_amount / 100}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`chip capitalize ${STATUS_COLOR[o.status] || "bg-secondary text-ink"}`}>{o.status}</span>
              <Link to="/orders/$id" params={{ id: o.id }} className="text-rust text-sm">View →</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
