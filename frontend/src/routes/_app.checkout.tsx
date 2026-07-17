import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useOrderSummary, useCreateOrder } from "@/hooks/useMarketplace";
import { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Skeleton, EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/checkout")({
  head: () => ({ meta: [{ title: "Checkout — PlantNest" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const cart = useApp(s => s.cart);
  const clearCart = useApp(s => s.clearCart);

  const { data: summary, isLoading, error } = useOrderSummary(cart);
  const createOrder = useCreateOrder();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", line2: "", city: "", pincode: "" });
  const [payment, setPayment] = useState<"UPI" | "Card" | "COD">("UPI");
  const [orderId, setOrderId] = useState<string>("");

  if (cart.length === 0 && step !== 3) {
    return <div className="text-center py-20"><p>Cart empty.</p><Link to="/market" className="btn-rust mt-4 inline-flex">Shop →</Link></div>;
  }

  if (isLoading && step !== 3) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full card-warm" />
      </div>
    );
  }

  if ((error || !summary) && step !== 3) {
    return <EmptyState icon="⚠️" title="Error" subtitle="Could not load checkout summary." />;
  }

  const place = async () => {
    try {
      // Backend expects product_id and quantity
      const items = cart.map(c => ({ product_id: c.productId, quantity: c.qty }));
      const order = await createOrder.mutateAsync({ items });
      
      setOrderId(order.id);
      setStep(3);
      clearCart();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, colors: ["#c1532b", "#e8a33d", "#6f8f6a"] });
      toast.success("Order placed 🌿");
    } catch (e: any) {
      toast.error(e.message || "Failed to place order.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${s <= step ? "bg-rust text-white" : "bg-secondary text-ink/60"}`}>{s < step ? <Check className="w-3.5 h-3.5" /> : s}</div>
            <span className={`text-xs ${s === step ? "text-rust" : "text-muted-foreground"}`}>{["Address", "Payment", "Confirm"][s - 1]}</span>
            {s < 3 && <div className="w-8 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card-warm p-6 space-y-3">
          <h2 className="font-display text-2xl">Delivery address</h2>
          {[
            { k: "name", l: "Full name" }, { k: "phone", l: "Phone" }, { k: "line1", l: "Address line 1" },
            { k: "line2", l: "Address line 2" }, { k: "city", l: "City" }, { k: "pincode", l: "Pincode" },
          ].map(f => (
            <div key={f.k}>
              <label className="text-sm font-medium block mb-1">{f.l}</label>
              <input className="input-warm" value={(address as any)[f.k]} onChange={e => setAddress({ ...address, [f.k]: e.target.value })} />
            </div>
          ))}
          <button onClick={() => { if (Object.values(address).some(v => !v)) { toast.error("Fill all fields"); return; } setStep(2); }} className="btn-rust w-full">Save & continue</button>
        </div>
      )}

      {step === 2 && summary && (
        <div className="card-warm p-6 space-y-4">
          <div className="bg-amber-soft/60 p-3 rounded-lg text-xs text-ink">⚠️ Test/Sandbox mode — no real payments (Razorpay integration simulated via backend)</div>
          <h2 className="font-display text-2xl">Payment</h2>
          <div className="grid grid-cols-3 gap-2">
            {(["UPI", "Card", "COD"] as const).map(p => (
              <button key={p} onClick={() => setPayment(p)} className={`p-4 rounded-xl border-2 ${payment === p ? "border-rust bg-rust-soft/20" : "border-border"}`}>
                <p className="font-medium text-sm">{p}</p>
              </button>
            ))}
          </div>
          {payment === "UPI" && (
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-secondary rounded-lg flex items-center justify-center text-6xl">⬜</div>
              <input className="input-warm mt-3" placeholder="yourname@upi" />
            </div>
          )}
          {payment === "Card" && (
            <>
              <input className="input-warm" placeholder="Card number" />
              <div className="flex gap-3"><input className="input-warm" placeholder="MM/YY" /><input className="input-warm" placeholder="CVV" /></div>
            </>
          )}
          {payment === "COD" && <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> I'll pay ₹{summary.total / 100} on delivery.</label>}
          <button onClick={place} disabled={createOrder.isPending} className="btn-rust w-full">
            {createOrder.isPending ? "Placing order..." : `Place order — ₹${summary.total / 100} →`}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <motion.svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
            <motion.circle cx="40" cy="40" r="36" fill="none" stroke="var(--rust)" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            <motion.path d="M25 42 L36 53 L57 30" fill="none" stroke="var(--rust)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
          </motion.svg>
          <h1 className="font-display text-3xl mt-6">Order placed successfully!</h1>
          <p className="text-muted-foreground mt-2">Your plants are on their way 🌿</p>
          <p className="text-xs text-muted-foreground mt-1">Order #{orderId}</p>
          {summary && (
            <div className="card-warm p-5 max-w-sm mx-auto mt-6 text-left text-sm">
              {summary.items.map((i: any) => <div key={i.product.id} className="flex justify-between py-1"><span>{i.product.name} × {i.quantity}</span><span>₹{(i.product.price * i.quantity) / 100}</span></div>)}
              <div className="divider-warm my-2" />
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{summary.total / 100}</span></div>
            </div>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/market" className="btn-rust">Continue shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
