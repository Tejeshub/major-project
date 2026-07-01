import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useAllProducts } from "@/stores/app";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/cart")({
  head: () => ({ meta: [{ title: "Cart — PlantNest" }] }),
  component: Cart,
});

function Cart() {
  const products = useAllProducts();
  const cart = useApp(s => s.cart);
  const setQty = useApp(s => s.setCartQty);
  const remove = useApp(s => s.removeFromCart);

  const items = cart.map(c => ({ ...c, product: products.find(p => p.id === c.productId)! })).filter(c => c.product);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const gst = Math.round(items.reduce((sum, i) => sum + i.product.price * i.qty * (i.product.gstRate / 100), 0));
  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const fee = subtotal > 0 ? 20 : 0;
  const total = subtotal + gst + delivery + fee;

  if (items.length === 0) {
    return <EmptyState icon="🛒" title="Your cart is empty" subtitle="Browse plants, seeds and supplies from verified nurseries." action={<Link to="/market" className="btn-rust">Browse plants →</Link>} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="eyebrow">Your bag</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Cart</h1>
      </div>

      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.productId} className="card-warm p-3 flex gap-3 items-center">
            <img src={i.product.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{i.product.name}</p>
              <p className="text-xs text-muted-foreground">{i.product.seller}</p>
              <div className="flex items-center bg-secondary rounded-full w-fit mt-1.5">
                <button onClick={() => setQty(i.productId, i.qty - 1)} className="w-7 h-7 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                <span className="w-7 text-center text-xs">{i.qty}</span>
                <button onClick={() => setQty(i.productId, i.qty + 1)} className="w-7 h-7 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{i.product.price * i.qty}</p>
              <button onClick={() => remove(i.productId)} className="text-muted-foreground mt-1"><X className="w-4 h-4" /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card-warm p-5 space-y-2 text-sm">
        <Row l="Subtotal" v={`₹${subtotal}`} />
        <Row l="GST" v={`₹${gst}`} />
        <Row l="Delivery" v={delivery === 0 ? "Free" : `₹${delivery}`} />
        <Row l="Platform fee" v={`₹${fee}`} />
        <div className="divider-warm my-2" />
        <Row l="Grand total" v={`₹${total}`} big />
        <Link to="/checkout" className="btn-rust w-full mt-3"><ShoppingBag className="w-4 h-4" /> Proceed to checkout →</Link>
      </div>
    </div>
  );
}
function Row({ l, v, big }: { l: string; v: string; big?: boolean }) {
  return <div className={`flex justify-between ${big ? "font-display text-lg" : ""}`}><span className={big ? "" : "text-muted-foreground"}>{l}</span><span>{v}</span></div>;
}
