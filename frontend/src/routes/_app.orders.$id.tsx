import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_app/orders/$id")({
  component: OrderDetail,
});

const STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"] as const;

function OrderDetail() {
  const { id } = useParams({ from: "/_app/orders/$id" });
  const order = useApp(s => s.orders.find(o => o.id === id));
  if (!order) return <div className="text-center py-20">Order not found.</div>;
  const stepIdx = STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/orders" className="text-sm text-muted-foreground">← All orders</Link>
      <div>
        <p className="eyebrow">Order #{order.id}</p>
        <h1 className="font-display text-3xl mt-1">{new Date(order.createdAt).toLocaleDateString()}</h1>
      </div>

      <div className="card-warm p-6">
        <h3 className="font-display text-lg mb-4">Status</h3>
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div className="flex flex-col items-center text-center flex-shrink-0 w-20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= stepIdx ? "bg-rust text-white" : "bg-secondary text-muted-foreground"}`}>
                  {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <p className={`text-xs mt-1.5 ${i <= stepIdx ? "text-ink" : "text-muted-foreground"}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < stepIdx ? "bg-rust" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-lg mb-3">Items</h3>
        <ul className="space-y-2">
          {order.items.map(i => (
            <li key={i.product.id} className="flex gap-3 items-center">
              <img src={i.product.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-secondary" />
              <div className="flex-1">
                <p className="font-medium text-sm">{i.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
              </div>
              <p className="font-medium">₹{i.product.price * i.qty}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-warm p-5">
          <h3 className="font-display text-lg mb-2">Delivery</h3>
          <p className="text-sm text-ink/80">{order.address.name}<br />{order.address.line1}, {order.address.line2}<br />{order.address.city} — {order.address.pincode}<br />{order.address.phone}</p>
        </div>
        <div className="card-warm p-5 text-sm">
          <h3 className="font-display text-lg mb-2">Payment</h3>
          <p className="text-ink/80">Method: {order.payment}</p>
          <div className="divider-warm my-3" />
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{order.gst}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₹{order.delivery}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform fee</span><span>₹{order.fee}</span></div>
            <div className="flex justify-between font-display text-lg mt-2"><span>Total</span><span>₹{order.total}</span></div>
          </div>
        </div>
      </div>
      <button className="text-sm text-rust">Contact seller</button>
    </div>
  );
}
