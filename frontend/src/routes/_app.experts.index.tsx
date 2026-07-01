import { createFileRoute, Link } from "@tanstack/react-router";
import { SEED_EXPERTS } from "@/data/seed";
import { Star } from "lucide-react";
import { useState } from "react";

const SPECS = ["All", "Ornamental Plants", "Vegetables & Herbs", "Pest Control", "Soil & Composting", "Landscape Design"];

export const Route = createFileRoute("/_app/experts/")({
  head: () => ({ meta: [{ title: "Experts — PlantNest" }] }),
  component: Experts,
});

function Experts() {
  const [spec, setSpec] = useState("All");
  const list = SEED_EXPERTS.filter(e => spec === "All" || e.specialisation === spec);
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Consultations</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Talk to an expert</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPECS.map(s => (
          <button key={s} onClick={() => setSpec(s)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${spec === s ? "bg-rust text-white" : "bg-secondary text-ink/70"}`}>{s}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(e => (
          <div key={e.id} className="card-warm card-warm-hover p-5 text-center">
            <img src={e.avatar} className="w-20 h-20 rounded-full bg-secondary mx-auto" alt="" />
            <p className="font-display text-lg mt-3">{e.name}</p>
            <span className="chip !bg-amber-soft text-ink !text-[10px] mt-1 inline-flex">{e.specialisation}</span>
            <p className="text-xs mt-2 text-muted-foreground"><Star className="w-3 h-3 inline text-amber-brand fill-amber-brand" /> {e.rating} · {e.consultations} sessions</p>
            <p className="text-sm mt-2">From <span className="text-rust font-semibold">₹{e.price}</span></p>
            <Link to="/experts/$id" params={{ id: e.id }} className="btn-rust w-full mt-3 !py-2 text-sm">Book now</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
