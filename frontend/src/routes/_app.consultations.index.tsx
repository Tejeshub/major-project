import { createFileRoute, Link } from "@tanstack/react-router";
import { useConsultations } from "@/hooks/useExperts";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/consultations/")({
  head: () => ({ meta: [{ title: "Consultations — PlantNest" }] }),
  component: ConsultationsList,
});

function ConsultationsList() {
  const { data: items = [], isLoading, isError, refetch } = useConsultations();
  // Stubbing cancel and review since backend endpoints aren't available in MVP yet
  const cancel = (id: string) => toast.error("Cancellation will be supported in the next release.");
  const review = (id: string, r: number, t: string) => toast.error("Reviews will be supported in the next release.");
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  if (isLoading) return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading your consultations...</div>;
  if (isError) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <p className="text-muted-foreground">Unable to load consultations.</p>
      <button onClick={() => refetch()} className="btn-ghost-border px-6 py-2">Retry</button>
    </div>
  );
  if (items.length === 0) return <EmptyState icon="💬" title="No consultations yet" action={<Link to="/experts" className="btn-rust">Browse experts →</Link>} />;

  const STATUS: Record<string, string> = {
    Pending: "bg-amber-soft text-ink",
    Confirmed: "bg-rust-soft/40 text-rust",
    Completed: "bg-sage/30 text-sage",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <p className="eyebrow">Your sessions</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">My consultations</h1>
      </div>
      {items.map((c: any) => (
        <div key={c.id} className="card-warm p-4">
          <div className="flex items-center gap-3">
            <img src={c.expertAvatar} className="w-12 h-12 rounded-full bg-secondary" alt="" />
            <div className="flex-1">
              <p className="font-medium">{c.expertName}</p>
              <p className="text-xs text-muted-foreground">{c.specialisation} · {c.slot} · {c.mode}</p>
            </div>
            <span className={`chip ${STATUS[c.status] || STATUS.Pending}`}>{c.status}</span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {c.status === "Pending" && <button onClick={() => { cancel(c.id); toast.success("Cancelled"); }} className="btn-ghost-border !py-1.5 !px-3 text-xs">Cancel</button>}
            {c.status === "Confirmed" && <Link to="/consultations/$id/chat" params={{ id: c.id }} className="btn-rust !py-1.5 !px-3 text-xs">Open chat</Link>}
            {c.status === "Completed" && !c.review && <button onClick={() => setReviewing(c.id)} className="btn-ghost-border !py-1.5 !px-3 text-xs">Leave a review</button>}
            {c.review && <p className="text-xs text-amber-brand">{"★".repeat(c.review.rating)} · {c.review.text}</p>}
          </div>
        </div>
      ))}

      {reviewing && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setReviewing(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl">Rate your session</h3>
            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setRating(r)}><Star className={`w-8 h-8 ${r <= rating ? "fill-amber-brand text-amber-brand" : "text-muted-foreground"}`} /></button>
              ))}
            </div>
            <textarea className="input-warm mt-3" rows={3} placeholder="How was it?" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => { review(reviewing, rating, text); setReviewing(null); setText(""); toast.success("Review submitted"); }} className="btn-rust w-full mt-3">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}
