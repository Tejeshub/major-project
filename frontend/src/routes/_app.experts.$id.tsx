import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { useExpert, useBookConsultation } from "@/hooks/useExperts";
import { useApp, useGates } from "@/stores/app";
import { useState } from "react";
import { Star, Check } from "lucide-react";
import { toast } from "sonner";
import { GateModal } from "./_app.detect.index";

export const Route = createFileRoute("/_app/experts/$id")({
  component: ExpertDetail,
});

const SLOTS = ["Mon 10am", "Mon 4pm", "Tue 11am", "Wed 2pm", "Thu 4pm", "Fri 6pm", "Sat 10am"];

function ExpertDetail() {
  const { id } = useParams({ from: "/_app/experts/$id" });
  const { data: expert, isLoading, isError, refetch } = useExpert(id);
  const bookMutation = useBookConsultation();
  const { canBookExpert } = useGates();
  const navigate = useNavigate();
  const [slot, setSlot] = useState<string>("");
  const [mode, setMode] = useState<"Chat" | "Video">("Chat");
  const [confirm, setConfirm] = useState(false);
  const [gate, setGate] = useState(false);

  if (isLoading) return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading expert details...</div>;
  if (isError || !expert) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <p className="text-muted-foreground">Unable to load expert details.</p>
      <button onClick={() => refetch()} className="btn-ghost-border px-6 py-2">Retry</button>
    </div>
  );
  
  const fee = 25;
  const total = expert.price + fee;

  const startBook = () => {
    if (!canBookExpert) { setGate(true); return; }
    setConfirm(true);
  };
  
  const finalize = () => {
    bookMutation.mutate({ expert_id: expert.id, slot, mode }, {
      onSuccess: () => {
        setConfirm(false);
        toast.success("Booked! Check your consultations.");
        navigate({ to: "/consultations" });
      },
      onError: () => {
        toast.error("Failed to book consultation. Please try again.");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card-warm p-6 flex items-center gap-5">
        <img src={expert.avatar} className="w-24 h-24 rounded-full bg-secondary" alt="" />
        <div>
          <h1 className="font-display text-3xl">{expert.name}</h1>
          <p className="text-sm text-muted-foreground">{expert.specialisation} · {expert.city}</p>
          <p className="text-sm mt-1"><Star className="w-4 h-4 inline text-amber-brand fill-amber-brand" /> {expert.rating} · {expert.consultations_count} consultations</p>
        </div>
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-lg mb-2">About</h3>
        <p className="text-sm text-ink/80 whitespace-pre-line leading-relaxed">{expert.bio}</p>
        <div className="flex gap-2 flex-wrap mt-4">
          {expert.tags?.map((t: string) => <span key={t} className="chip !bg-amber-soft text-ink">{t}</span>)}
        </div>
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-lg mb-3">Available time slots — this week</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {SLOTS.map(s => (
            <button key={s} onClick={() => setSlot(s)} className={`py-2 px-3 rounded-full text-sm border ${slot === s ? "bg-rust text-white border-rust" : "bg-card border-border"}`}>
              {slot === s && <Check className="w-3 h-3 inline mr-1" />}{s}
            </button>
          ))}
        </div>
      </div>

      <div className="card-warm p-5">
        <h3 className="font-display text-lg mb-3">Mode</h3>
        <div className="flex gap-2">
          <button onClick={() => setMode("Chat")} className={`flex-1 py-2 rounded-full text-sm ${mode === "Chat" ? "bg-rust text-white" : "bg-secondary"}`}>Chat consultation</button>
          <button disabled className="flex-1 py-2 rounded-full text-sm bg-secondary text-muted-foreground">Video call <span className="text-[10px]">(Coming soon)</span></button>
        </div>
      </div>

      <div className="card-warm p-5">
        <div className="flex justify-between text-sm"><span>Consultation</span><span>₹{expert.price}</span></div>
        <div className="flex justify-between text-sm"><span>Platform fee</span><span>₹{fee}</span></div>
        <div className="divider-warm my-2" />
        <div className="flex justify-between font-display text-lg"><span>Total</span><span>₹{total}</span></div>
        <p className="text-[10px] text-muted-foreground mt-1">Inclusive of GST</p>
        <button disabled={!slot} onClick={startBook} className="btn-rust w-full mt-4">Confirm booking →</button>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirm(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl">Confirm booking</h3>
            <div className="mt-4 space-y-1 text-sm">
              <p>Expert: <span className="font-medium">{expert.name}</span></p>
              <p>Slot: <span className="font-medium">{slot}</span></p>
              <p>Mode: <span className="font-medium">{mode}</span></p>
              <p>Price: <span className="font-medium">₹{total}</span></p>
            </div>
            <button onClick={finalize} disabled={bookMutation.isPending} className="btn-rust w-full mt-5">
              {bookMutation.isPending ? "Booking..." : "Yes, book it"}
            </button>
            <button onClick={() => setConfirm(false)} className="text-xs text-muted-foreground mt-3 block mx-auto">Cancel</button>
          </div>
        </div>
      )}

      {gate && <GateModal title="Expert consultations are available on Premium" onClose={() => setGate(false)} />}
    </div>
  );
}
