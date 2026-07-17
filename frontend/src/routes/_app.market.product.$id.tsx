import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useProduct } from "@/hooks/useMarketplace";
import { Skeleton, EmptyState } from "@/components/ui-brand/primitives";
import { useState } from "react";
import { BadgeCheck, Star, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/market/product/$id")({
  component: Product,
});

function Product() {
  const { id } = useParams({ from: "/_app/market/product/$id" });
  const { data: product, isLoading, error } = useProduct(id);
  
  const addToCart = useApp(s => s.addToCart);
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 pb-24 md:pb-0">
        <Skeleton className="w-full aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <EmptyState 
        icon="⚠️" 
        title="Product not found" 
        subtitle="This product may have been removed or is currently unavailable."
      />
    );
  }

  const priceInRupees = product.price / 100;
  const gst = Math.round((priceInRupees * product.gst_rate) / 100);
  const total = priceInRupees + gst;
  const photos = [product.image_url, product.image_url, product.image_url];

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 pb-24 md:pb-0">
      <div>
        <div className="aspect-square card-warm overflow-hidden">
          <img src={photos[photo]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-2 mt-3">
          {photos.map((src, i) => (
            <button key={i} onClick={() => setPhoto(i)} className={`w-16 aspect-square rounded-lg overflow-hidden border-2 ${photo === i ? "border-rust" : "border-transparent"}`}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="chip">{product.category}</span>
        <h1 className="font-display text-3xl md:text-4xl mt-2">{product.name}</h1>
        <p className="font-display text-3xl text-rust mt-3">₹{priceInRupees}</p>
        <p className="text-xs text-muted-foreground">₹{priceInRupees} + ₹{gst} GST = ₹{total} total</p>

        <div className="card-warm p-3 flex items-center gap-3 mt-5">
          <div className="w-10 h-10 rounded-full bg-amber-soft flex items-center justify-center"><BadgeCheck className="w-5 h-5 text-rust" /></div>
          <div className="flex-1">
            <p className="font-medium text-sm">{product.seller}</p>
            <p className="text-xs text-muted-foreground">{product.verified ? "Verified nursery" : "Seller"} · <Star className="w-3 h-3 inline text-amber-brand" /> {product.rating}</p>
          </div>
        </div>

        <p className="mt-3 text-sm">{product.stock > 0 ? <span className="text-sage">● In stock ({product.stock} available)</span> : <span className="text-rust">● Out of stock</span>}</p>

        <p className="mt-5 text-ink/80 leading-relaxed">{product.description}</p>

        <h3 className="font-display text-lg mt-8">Reviews</h3>
        <div className="space-y-3 mt-3">
          {[
            { n: "Riya Kapoor", r: 5, t: "Healthy plant, well-packed. Reached Mumbai in 2 days." },
            { n: "Arjun Verma", r: 4, t: "Good value. One leaf was bruised but recovered." },
            { n: "Sneha Iyer", r: 5, t: "Beautiful — exactly as pictured. Will reorder." },
          ].map((r, i) => (
            <div key={i} className="card-warm p-4">
              <p className="font-medium text-sm">{r.n}</p>
              <p className="text-xs text-amber-brand">{"★".repeat(r.r)}{"☆".repeat(5 - r.r)}</p>
              <p className="text-sm mt-1 text-ink/80">{r.t}</p>
            </div>
          ))}
        </div>

        <div className="md:static fixed bottom-0 inset-x-0 md:inset-auto bg-card md:bg-transparent md:p-0 p-4 border-t md:border-0 border-border flex items-center gap-3 z-30 md:mt-6">
          <div className="flex items-center bg-secondary rounded-full">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
          </div>
          <button onClick={() => { addToCart(product.id, qty); toast.success(`Added ${qty} to cart`); }} disabled={product.stock === 0} className="btn-rust flex-1"><ShoppingBag className="w-4 h-4" /> Add to cart</button>
        </div>
      </div>
    </div>
  );
}
