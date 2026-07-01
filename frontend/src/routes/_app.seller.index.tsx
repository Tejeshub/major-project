import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { Counter } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/seller/")({
  component: SellerOverview,
});

function SellerOverview() {
  const products = useApp(s => s.sellerProducts);
  const orders = useApp(s => s.orders);
  const updateStatus = useApp(s => s.updateOrderStatus);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status !== "Delivered").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { n: products.filter(p => p.stock > 0).length, l: "Active listings" },
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
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">#{o.id}</td>
                  <td>{o.items.length}</td>
                  <td>₹{o.total}</td>
                  <td>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as any)} className="bg-secondary rounded-full px-3 py-1 text-xs">
                      {["Placed", "Confirmed", "Shipped", "Delivered"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
