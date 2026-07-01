import { createFileRoute, Link } from "@tanstack/react-router";
import { SEED_GUIDES } from "@/data/seed";
import { useState } from "react";

const CATS = ["All", "Care Guides", "Pest & Disease", "Seasonal Tips", "Hydroponics", "Organic Farming"];

export const Route = createFileRoute("/_app/learn/")({
  head: () => ({ meta: [{ title: "Learn — PlantNest" }] }),
  component: Learn,
});

function Learn() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = SEED_GUIDES.filter(g => (cat === "All" || g.category === cat) && (q === "" || g.title.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Education</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Guides for Indian gardeners</h1>
      </div>
      <input className="input-warm max-w-md" placeholder="Search guides..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${cat === c ? "bg-rust text-white" : "bg-secondary text-ink/70"}`}>{c}</button>
        ))}
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {list.map(g => (
          <Link key={g.slug} to="/learn/$slug" params={{ slug: g.slug }} className="card-warm card-warm-hover overflow-hidden block break-inside-avoid">
            <img src={g.cover} alt="" className="w-full object-cover" loading="lazy" />
            <div className="p-4">
              <span className="chip !bg-amber-soft text-ink !text-[10px]">{g.category}</span>
              <h3 className="font-display text-lg mt-2 leading-tight">{g.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.excerpt}</p>
              <p className="text-xs text-muted-foreground mt-2">{g.readTime} read</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
