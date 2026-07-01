import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useAllProducts } from "@/stores/app";
import { useState } from "react";
import { Search, ShoppingBag, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const CATS = ["All", "Plants", "Seeds", "Fertilizers", "Pots", "Tools"] as const;

export const Route = createFileRoute("/_app/market/")({
  head: () => ({ meta: [{ title: "Marketplace — PlantNest" }] }),
  component: Market,
});

function Market() {
  const products = useAllProducts();
  const addToCart = useApp(s => s.addToCart);
  const [cat, setCat] = useState<typeof CATS[number]>("All");
  const [q, setQ] = useState("");

  const list = products.filter(p => (cat === "All" || p.category === cat) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Marketplace</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Plants, seeds & supplies</h1>
      </div>
      <div className="flex items-center gap-2 card-warm px-4 py-2.5">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input className="bg-transparent flex-1 outline-none text-sm" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${cat === c ? "bg-rust text-white" : "bg-secondary text-ink/70"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map(p => (
          <Link key={p.id} to="/market/product/$id" params={{ id: p.id }} className="card-warm card-warm-hover overflow-hidden block group">
            <div className="aspect-square bg-secondary relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              {p.stock === 0 && <div className="absolute inset-0 bg-ink/40 flex items-center justify-center"><span className="chip !bg-card">Out of stock</span></div>}
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1">{p.seller} {p.verified && <BadgeCheck className="w-3.5 h-3.5 text-amber-brand" />}</p>
              <p className="font-medium text-sm line-clamp-1 mt-0.5">{p.name}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="font-display text-lg text-rust">₹{p.price}</p>
                <button onClick={e => { e.preventDefault(); if (p.stock === 0) { toast.info("Out of stock — we'll notify you"); return; } addToCart(p.id); toast.success("Added to cart"); }} className="w-8 h-8 rounded-full bg-rust text-white flex items-center justify-center hover:scale-110 transition"><ShoppingBag className="w-4 h-4" /></button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
