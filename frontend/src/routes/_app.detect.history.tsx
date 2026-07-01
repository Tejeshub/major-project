import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/detect/history")({
  head: () => ({ meta: [{ title: "Detection history — PlantNest" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const detections = useApp(s => s.detections);
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <p className="eyebrow">Detection history</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Past diagnoses</h1>
      </div>
      {detections.length === 0 ? (
        <EmptyState icon="🔬" title="No detections yet" subtitle="Try scanning a leaf to begin." action={<Link to="/detect" className="btn-rust">Run a scan →</Link>} />
      ) : (
        <ul className="space-y-2">
          {detections.map(d => {
            const color = d.confidence >= 90 ? "bg-sage/30 text-sage" : d.confidence >= 60 ? "bg-amber-soft text-ink" : "bg-rust-soft/40 text-rust";
            return (
              <li key={d.id} className="card-warm card-warm-hover p-3 flex items-center gap-3">
                <img src={d.photo} alt="" className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                <div className="flex-1">
                  <p className="font-medium">{d.diseaseName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.ts).toLocaleString()}</p>
                </div>
                <span className={`chip ${color}`}>{d.confidence}%</span>
                <Link to="/detect/result/$id" params={{ id: d.id }} className="text-rust text-sm">View →</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
