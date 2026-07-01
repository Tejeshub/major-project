import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useState } from "react";

export const Route = createFileRoute("/_app/seller/orders")({
  component: SellerOrders,
});

const STATUSES = ["Placed", "Confirmed", "Shipped", "Delivered"] as const;

function SellerOrders() {
  const orders = useApp(s => s.orders);
  const updateStatus = useApp(s => s.updateOrderStatus);
  const [filter, setFilter] = useState<string>("All");
  const list = orders.filter(o => filter === "All" || o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === s ? "bg-rust text-white" : "bg-secondary"}`}>{s}</button>
        ))}
      </div>
      <div className="card-warm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr><th className="p-3">Order</th><th>Buyer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3 font-medium">#{o.id}</td>
                <td>{o.address.name}</td>
                <td>{o.items.map(i => i.product.name.split(" ")[0]).join(", ")}</td>
                <td>₹{o.total}</td>
                <td className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as any)} className="bg-secondary rounded-full px-3 py-1 text-xs">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
