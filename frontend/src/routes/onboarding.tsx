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
    <div className="min-h-screen flex flex-col bg-cream-bg">
      <header className="px-6 py-5 flex items-center justify-between border-b border-sage-border/50">
        <div className="flex gap-2.5">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-2 w-10 rounded-full transition-all duration-300 ${s <= step ? "bg-terracotta" : "bg-sand-deep border border-sage-border/80"}`} />
          ))}
        </div>
        <button onClick={skip} disabled={loading} className="text-sm font-semibold text-forest-muted hover:text-forest-dark flex items-center gap-1 transition-colors cursor-pointer">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Skip
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="w-full max-w-2xl">
            {step === 1 && (
              <div>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-center text-forest-dark tracking-tight">What kind of garden do you have?</h2>
                <div className="grid grid-cols-2 gap-5 mt-10">
                  {GARDEN_TYPES.map((g) => (
                    <button key={g.id} onClick={() => setGardenType(g.id)}
                      className={`card-warm card-warm-hover p-8 text-center border-2 transition-all cursor-pointer ${gardenType === g.id ? "!border-terracotta ring-4 ring-terracotta/15 bg-cream-elevated" : "border-sage-border"}`}>
                      <div className="text-5xl mb-3">{g.emoji}</div>
                      <p className="font-display font-bold text-xl text-forest-dark">{g.label}</p>
                      {gardenType === g.id && <div className="mt-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-terracotta text-cream-bg shadow-sm"><Check className="w-4 h-4" strokeWidth={2.5} /></div>}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <button onClick={next} disabled={!gardenType} className="btn-rust px-10 text-base font-semibold">Continue →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-center text-forest-dark tracking-tight">Pick what you grow or want to grow</h2>
                <p className="text-center mt-2 text-forest-muted text-sm font-medium">{selected.length} / 8 selected</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-8">
                  {PLANT_OPTIONS.map((p) => {
                    const on = selected.includes(p);
                    return (
                      <button key={p} onClick={() => togglePlant(p)}
                        className={`flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer ${on ? "scale-105" : "hover:opacity-85"}`}>
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-warm-sm ${on ? "!border-terracotta ring-4 ring-terracotta/20 bg-terracotta-soft/30" : "border-sage-border bg-sand-deep"}`}>
                          <img src={PLANT_PHOTOS[p]} alt={p} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <span className={`text-xs font-semibold text-center ${on ? "text-terracotta" : "text-forest-dark"}`}>{p}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-10">
                  <button onClick={next} className="btn-rust px-10 text-base font-semibold">Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center card-warm p-10 md:p-12 shadow-warm-md">
                <div className="mx-auto w-24 h-24 rounded-full bg-sand-deep border border-sage-border flex items-center justify-center text-6xl mb-6 shadow-warm-sm">
                  <Bell className="w-12 h-12 text-terracotta" strokeWidth={1.75} />
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-dark">Stay on top of your plants</h2>
                <p className="text-forest-muted mt-3 max-w-md mx-auto leading-relaxed">Get watering reminders, disease alerts, and seasonal care tips crafted for your balcony.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button onClick={() => { toast.success("Notifications enabled"); next(); }} className="btn-rust text-base">Allow notifications</button>
                  <button onClick={next} className="btn-ghost-border text-base">Maybe later</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center card-warm p-10 md:p-12 shadow-warm-md">
                <div className="mx-auto w-24 h-24 rounded-full bg-sand-deep border border-sage-border flex items-center justify-center mb-6 shadow-warm-sm">
                  <MapPin className="w-12 h-12 text-terracotta" strokeWidth={1.75} />
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-dark">See what's growing near you</h2>
                <p className="text-forest-muted mt-3 max-w-md mx-auto leading-relaxed">Find nearby gardeners, get local weather, and discover nurseries in your area.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button onClick={() => { toast.success("Location enabled"); next(); }} disabled={loading} className="btn-rust flex items-center justify-center gap-2 text-base">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Allow location
                  </button>
                  <button onClick={next} disabled={loading} className="btn-ghost-border flex items-center justify-center gap-2 text-base">
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
