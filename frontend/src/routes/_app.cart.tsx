import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useOrderSummary } from "@/hooks/useMarketplace";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { EmptyState, Skeleton } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/cart")({
  head: () => ({ meta: [{ title: "Cart — PlantNest" }] }),
  component: Cart,
});

function Cart() {
  const cart = useApp(s => s.cart);
  const setQty = useApp(s => s.setCartQty);
  const remove = useApp(s => s.removeFromCart);

  const { data: summary, isLoading, error } = useOrderSummary(cart);

  if (cart.length === 0) {
    return <EmptyState icon="🛒" title="Your cart is empty" subtitle="Browse plants, seeds and supplies from verified nurseries." action={<Link to="/market" className="btn-rust">Browse plants →</Link>} />;
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-48" />
        </div>
        <ul className="space-y-2">
          {[1, 2].map(i => (
            <li key={i} className="card-warm p-3 flex gap-3 items-center">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-8 w-24 rounded-full mt-2" />
              </div>
              <Skeleton className="h-5 w-16" />
            </li>
          ))}
        </ul>
        <Skeleton className="card-warm p-5 h-48 w-full" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <EmptyState icon="⚠️" title="Failed to load cart summary" subtitle="Please check your connection and try again." />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="eyebrow">Your bag</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Cart</h1>
      </div>

      <ul className="space-y-2">
        {summary.items.map((i: any) => (
          <li key={i.product_id} className="card-warm p-3 flex gap-3 items-center">
            <img src={i.product.image_url} alt="" className="w-20 h-20 rounded-lg object-cover bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{i.product.name}</p>
              <p className="text-xs text-muted-foreground">{i.product.seller}</p>
              <div className="flex items-center bg-secondary rounded-full w-fit mt-1.5">
                <button onClick={() => setQty(i.product_id, i.quantity - 1)} className="w-7 h-7 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                <span className="w-7 text-center text-xs">{i.quantity}</span>
                <button onClick={() => setQty(i.product_id, i.quantity + 1)} className="w-7 h-7 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{(i.product.price * i.quantity) / 100}</p>
              <button onClick={() => remove(i.product_id)} className="text-muted-foreground mt-1"><X className="w-4 h-4" /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card-warm p-5 space-y-2 text-sm">
        <Row l="Subtotal" v={`₹${summary.subtotal / 100}`} />
        <Row l="GST" v={`₹${summary.gst / 100}`} />
        <Row l="Delivery" v={summary.delivery === 0 ? "Free" : `₹${summary.delivery / 100}`} />
        <Row l="Platform fee" v={`₹${summary.fee / 100}`} />
        <div className="divider-warm my-2" />
        <Row l="Grand total" v={`₹${summary.total / 100}`} big />
        <Link to="/checkout" className="btn-rust w-full mt-3"><ShoppingBag className="w-4 h-4" /> Proceed to checkout →</Link>
      </div>
    </div>
  );
}

function Row({ l, v, big }: { l: string; v: string; big?: boolean }) {
  return <div className={`flex justify-between ${big ? "font-display text-lg" : ""}`}><span className={big ? "" : "text-muted-foreground"}>{l}</span><span>{v}</span></div>;
}
