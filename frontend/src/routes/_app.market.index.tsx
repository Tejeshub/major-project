import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useProducts } from "@/hooks/useMarketplace";
import { Skeleton, EmptyState } from "@/components/ui-brand/primitives";
import { useState } from "react";
import { Search, ShoppingBag, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const CATS = ["All", "Plants", "Seeds", "Fertilizers", "Pots", "Tools"] as const;

export const Route = createFileRoute("/_app/market/")({
  head: () => ({ meta: [{ title: "Marketplace — PlantNest" }] }),
  component: Market,
});

function Market() {
  const addToCart = useApp(s => s.addToCart);
  const [cat, setCat] = useState<typeof CATS[number]>("All");
  const [q, setQ] = useState("");

  const { data, isLoading, error } = useProducts({ 
    category: cat === "All" ? undefined : cat, 
    keyword: q || undefined 
  });

  const list = data?.items || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Marketplace</p>
        <h1 className="font-display font-bold text-3xl md:text-5xl mt-1 text-forest-dark tracking-tight">Plants, seeds & supplies</h1>
      </div>
      <div className="flex items-center gap-3 card-warm px-5 py-3 shadow-warm-sm border border-sage-border focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20 transition-all">
        <Search className="w-5 h-5 text-forest-muted" strokeWidth={1.75} />
        <input className="bg-transparent flex-1 outline-none text-sm text-forest-dark placeholder:text-forest-muted/70" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 shadow-warm-sm ${
              cat === c ? "bg-terracotta text-cream-bg shadow-md" : "bg-sand-deep border border-sage-border/80 text-forest-muted hover:text-forest-dark hover:bg-cream-elevated"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-warm overflow-hidden block">
              <Skeleton className="w-full aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center mt-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState 
          icon="⚠️" 
          title="Failed to load products" 
          subtitle={(error as Error).message || "Please check your connection and try again."} 
        />
      ) : list.length === 0 ? (
        <EmptyState 
          icon="🛒" 
          title="No products found" 
          subtitle="Try adjusting your search or category filters." 
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((p: any) => (
            <Link key={p.id} to="/market/product/$id" params={{ id: p.id }} className="card-warm card-warm-hover overflow-hidden block group">
              <div className="aspect-square bg-sand-deep relative overflow-hidden border-b border-sage-border/60">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                {p.stock === 0 && <div className="absolute inset-0 bg-forest-dark/50 backdrop-blur-sm flex items-center justify-center"><span className="chip !bg-cream-surface text-forest-dark font-semibold">Out of stock</span></div>}
              </div>
              <div className="p-4">
                <p className="text-xs text-forest-muted flex items-center gap-1 font-medium">{p.seller} {p.verified && <BadgeCheck className="w-3.5 h-3.5 text-sage" strokeWidth={1.75} />}</p>
                <p className="font-semibold text-sm line-clamp-1 mt-1 text-forest-dark group-hover:text-terracotta transition-colors">{p.name}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-display font-bold text-lg text-forest-dark">₹{p.price / 100}</p>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      if (p.stock === 0) {
                        toast.info("Out of stock — we'll notify you");
                        return;
                      }
                      addToCart(p.id);
                      toast.success("Added to cart");
                    }}
                    className="w-9 h-9 rounded-full bg-sand-deep border border-sage-border text-forest-dark hover:bg-terracotta hover:text-cream-bg hover:border-transparent flex items-center justify-center transition-all duration-200 active:scale-95 shadow-warm-sm"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
