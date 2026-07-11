import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/stores/app";
import { PLANT_OPTIONS, PLANT_PHOTOS } from "@/data/seed";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Bell, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — PlantNest" }] }),
  component: Onboarding,
});

const GARDEN_TYPES = [
  { id: "balcony", label: "Balcony", emoji: "🪴" },
  { id: "terrace", label: "Terrace", emoji: "🌿" },
  { id: "indoor", label: "Indoor", emoji: "🏠" },
  { id: "mixed", label: "Mixed Pots", emoji: "🌱" },
];

function Onboarding() {
  const navigate = useNavigate();
  const setOnboarding = useApp((s) => s.setOnboarding);
  const user = useApp((s) => s.user);
  const [step, setStep] = useState(1);
  const [gardenType, setGardenType] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const next = async () => {
    if (step === 4) {
      setLoading(true);
      try {
        await setOnboarding(gardenType || "balcony", selected);
        toast.success(`Welcome${user ? ", " + user.name.split(" ")[0] : ""} 🌿`);
        navigate({ to: "/dashboard" });
      } catch (e) {
        toast.error("Failed to save plants");
      } finally {
        setLoading(false);
      }
    } else setStep(step + 1);
  };
  const skip = async () => {
    setLoading(true);
    try {
      await setOnboarding(gardenType || "balcony", selected);
      navigate({ to: "/dashboard" });
    } catch (e) {
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  const togglePlant = (p: string) => {
    setSelected((s) => s.includes(p) ? s.filter(x => x !== p) : s.length < 8 ? [...s, p] : s);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition ${s <= step ? "bg-rust" : "bg-border"}`} />
          ))}
        </div>
        <button onClick={skip} disabled={loading} className="text-sm text-ink/60 hover:text-ink flex items-center gap-1">
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          Skip
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="w-full max-w-2xl">
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-center">What kind of garden do you have?</h2>
                <div className="grid grid-cols-2 gap-4 mt-10">
                  {GARDEN_TYPES.map((g) => (
                    <button key={g.id} onClick={() => setGardenType(g.id)}
                      className={`card-warm card-warm-hover p-8 text-center border-2 ${gardenType === g.id ? "border-rust ring-2 ring-rust/30" : "border-transparent"}`}>
                      <div className="text-5xl mb-3">{g.emoji}</div>
                      <p className="font-display text-xl">{g.label}</p>
                      {gardenType === g.id && <div className="mt-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-rust text-white"><Check className="w-3.5 h-3.5" /></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-center">Pick the plants you grow or want to grow</h2>
                <p className="text-center mt-2 text-muted-foreground text-sm">{selected.length} / 8 selected</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-8">
                  {PLANT_OPTIONS.map((p) => {
                    const on = selected.includes(p);
                    return (
                      <button key={p} onClick={() => togglePlant(p)}
                        className={`flex flex-col items-center gap-2 transition ${on ? "scale-105" : ""}`}>
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-4 transition ${on ? "border-rust bg-amber-soft" : "border-transparent bg-secondary"}`}>
                          <img src={PLANT_PHOTOS[p]} alt={p} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <span className={`text-xs font-medium text-center ${on ? "text-rust" : "text-ink/70"}`}>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="mx-auto w-32 h-32 rounded-full bg-amber-soft/40 flex items-center justify-center text-6xl mb-6">
                  <Bell className="w-16 h-16 text-rust" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl">Stay on top of your plants</h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">Get watering reminders, disease alerts, and weather tips.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <button onClick={() => { toast.success("Notifications enabled"); next(); }} className="btn-rust">Allow notifications</button>
                  <button onClick={next} className="btn-ghost-border">Maybe later</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="mx-auto w-32 h-32 rounded-full bg-rust-soft/40 flex items-center justify-center mb-6">
                  <MapPin className="w-16 h-16 text-rust" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl">See what's growing near you</h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">Find nearby gardeners, get local weather, and discover nurseries in your area.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <button onClick={() => { toast.success("Location enabled"); next(); }} disabled={loading} className="btn-rust flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Allow location
                  </button>
                  <button onClick={next} disabled={loading} className="btn-ghost-border flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Skip for now
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-6 flex justify-between items-center max-w-2xl mx-auto w-full">
        <Link to="/" className="text-sm text-muted-foreground hover:text-ink">← Back</Link>
        {(step === 1 || step === 2) && (
          <button onClick={next} disabled={step === 1 && !gardenType} className="btn-rust">Next →</button>
        )}
      </footer>
    </div>
  );
}
