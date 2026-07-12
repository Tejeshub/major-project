import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { SEED_PRODUCTS } from "@/data/seed";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, ShoppingBag, MessageCircle, Save, Share2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute("/_app/detect/result/$id")({
  component: ResultPage,
});

function ResultPage() {
  const { id } = useParams({ from: "/_app/detect/result/$id" });
  const navigate = useNavigate();
  const det = useApp(s => s.detections.find(d => d.id === id));
  const addToCart = useApp(s => s.addToCart);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!det) return;
    const start = performance.now();
    const target = det.confidence;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      setPct(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [det]);

  if (!det) return <div className="text-center py-20 text-muted-foreground">Detection not found.</div>;

  if (det.lowConfidence) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <img src={det.photo} className="rounded-2xl w-full max-h-80 object-cover" alt="" />
        <div className="text-6xl">🔍</div>
        <h1 className="font-display text-3xl">Hard to tell from this photo</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">Try a closer crop on the affected leaf, better lighting, or a plain background.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/detect" className="btn-rust">Retake photo</Link>
          <Link to="/experts" className="btn-ghost-border">Ask an expert instead →</Link>
        </div>
      </div>
    );
  }

  const color = det.confidence >= 90 ? "var(--sage)" : det.confidence >= 80 ? "var(--amber-brand)" : "var(--rust)";
  const cross = det.crossSellId ? SEED_PRODUCTS.find(p => p.id === det.crossSellId) : null;
  const circumference = 2 * Math.PI * 50;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <img src={det.photo} className="rounded-2xl w-full max-h-96 object-cover shadow-warm" alt="" />

      <div className="card-warm p-6 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="eyebrow flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI diagnosis</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">{det.diseaseName}</h1>
          {det.plantName && <p className="text-sm text-muted-foreground mt-1">on {det.plantName}</p>}
        </div>
        <div className="relative w-32 h-32 mx-auto">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--secondary)" strokeWidth="10" />
            <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * pct) / 100}
              transition={{ duration: 0 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl" style={{ color }}>{pct}%</span>
            <span className="text-[10px] text-muted-foreground">confidence</span>
          </div>
        </div>
      </div>

      <details open className="card-warm p-5 group">
        <summary className="font-display text-lg cursor-pointer">Symptoms</summary>
        <p className="text-ink/80 mt-3 leading-relaxed">{det.symptoms}</p>
      </details>

      <div className="card-warm p-5">
        <h3 className="font-display text-xl mb-4 text-rust">Recommended treatment</h3>
        <div className="mt-4 text-base leading-relaxed text-ink font-sans markdown-body prose prose-stone max-w-none prose-headings:font-display prose-headings:mt-8 prose-headings:mb-3 prose-headings:text-rust prose-p:mb-5 prose-p:text-ink/90 prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:mb-2 prose-strong:text-ink prose-strong:font-semibold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {det.treatment.join('\n\n')}
          </ReactMarkdown>
        </div>
      </div>

      <div className="card-warm p-4 bg-amber-soft/40 flex items-start gap-3">
        <span className="text-2xl">☔</span>
        <p className="text-sm text-ink/80">Weather note: avoid spraying today — humidity is high through the afternoon.</p>
      </div>

      {cross && (
        <div className="card-warm p-4 flex items-center gap-4">
          <img src={cross.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="eyebrow">Recommended product</p>
            <p className="font-medium">{cross.name}</p>
            <p className="text-rust font-semibold">₹{cross.price}</p>
          </div>
          <button onClick={() => { addToCart(cross.id); toast.success("Added to cart"); }} className="btn-rust !py-2 !px-4 text-sm"><ShoppingBag className="w-4 h-4" /> Add to cart</button>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => { toast.success("Saved to history"); navigate({ to: "/detect/history" }); }} className="btn-ghost-border flex-1"><Save className="w-4 h-4" /> Save to history</button>
        <button onClick={() => { toast.success("Opening community composer"); navigate({ to: "/community" }); }} className="btn-rust flex-1"><Share2 className="w-4 h-4" /> Share to community</button>
      </div>
    </div>
  );
}
