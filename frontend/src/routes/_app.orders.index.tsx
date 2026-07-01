import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/orders/")({
  head: () => ({ meta: [{ title: "Orders — PlantNest" }] }),
  component: Orders,
});

const STATUS_COLOR: Record<string, string> = {
  Placed: "bg-amber-soft text-ink",
  Confirmed: "bg-rust-soft/40 text-rust",
  Shipped: "bg-indigo-dusk/20 text-indigo-dusk",
  Delivered: "bg-sage/30 text-sage",
};

function Orders() {
  const orders = useApp(s => s.orders);
  if (orders.length === 0) return <EmptyState icon="📦" title="No orders yet" action={<Link to="/market" className="btn-rust">Start shopping →</Link>} />;
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <p className="eyebrow">Your orders</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Orders</h1>
      </div>
      <ul className="space-y-2">
        {orders.map(o => (
          <li key={o.id} className="card-warm card-warm-hover p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">#{o.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} {o.items.length === 1 ? "item" : "items"} · ₹{o.total}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`chip ${STATUS_COLOR[o.status]}`}>{o.status}</span>
              <Link to="/orders/$id" params={{ id: o.id }} className="text-rust text-sm">View →</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
