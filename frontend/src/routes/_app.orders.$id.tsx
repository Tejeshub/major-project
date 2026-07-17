import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useOrder } from "@/hooks/useMarketplace";
import { Check } from "lucide-react";
import { Skeleton, EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/orders/$id")({
  component: OrderDetail,
});

const STEPS = ["placed", "paid", "confirmed", "shipped", "delivered"] as const;

function OrderDetail() {
  const { id } = useParams({ from: "/_app/orders/$id" });
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-24 w-full card-warm" />
        <Skeleton className="h-48 w-full card-warm" />
      </div>
    );
  }

  if (error || !order) return <EmptyState icon="❌" title="Order not found" subtitle="The order you are looking for does not exist." />;
  const stepIdx = STEPS.indexOf(order.status as any) >= 0 ? STEPS.indexOf(order.status as any) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/orders" className="text-sm text-muted-foreground">← All orders</Link>
      <div>
        <p className="eyebrow">Order #{order.id.split("-")[0]}</p>
        <h1 className="font-display text-3xl mt-1">{new Date(order.created_at).toLocaleDateString()}</h1>
      </div>

      <div className="card-warm p-6">
        <h3 className="font-display text-lg mb-4">Status</h3>
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div className="flex flex-col items-center text-center flex-shrink-0 w-20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center capitalize ${i <= stepIdx ? "bg-rust text-white" : "bg-secondary text-muted-foreground"}`}>
                  {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <p className={`text-xs mt-1.5 capitalize ${i <= stepIdx ? "text-ink" : "text-muted-foreground"}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < stepIdx ? "bg-rust" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-lg mb-3">Items</h3>
        <ul className="space-y-2">
          {order.items.map((i: any) => (
            <li key={i.product_id} className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-xl">🌱</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{i.product?.name || `Product ID: ${i.product_id.split("-")[0]}`}</p>
                <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
              </div>
              <p className="font-medium">₹{(i.price * i.quantity) / 100}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-warm p-5">
          <h3 className="font-display text-lg mb-2">Delivery</h3>
          <p className="text-sm text-ink/80">{"Customer"}<br />{"123 Address Line"}<br />{"City"} — {"Pincode"}<br />{"Phone"}</p>
        </div>
        <div className="card-warm p-5 text-sm">
          <h3 className="font-display text-lg mb-2">Payment</h3>
          <p className="text-ink/80">Method: {"Online/COD"}</p>
          <div className="divider-warm my-3" />
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.base_amount / 100}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{order.gst_amount / 100}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform fee</span><span>₹{order.commission_amount / 100}</span></div>
            <div className="flex justify-between font-display text-lg mt-2"><span>Total</span><span>₹{order.total_amount / 100}</span></div>
          </div>
        </div>
      </div>
      <button className="text-sm text-rust">Contact seller</button>
    </div>
  );
}
