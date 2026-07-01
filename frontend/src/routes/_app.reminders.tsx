import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { Droplets, Sprout, Scissors, Plus, X, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/reminders")({
  head: () => ({ meta: [{ title: "Reminders — PlantNest" }] }),
  component: Reminders,
});

function Reminders() {
  const reminders = useApp(s => s.reminders);
  const plants = useApp(s => s.plants);
  const markDone = useApp(s => s.markReminderDone);
  const addReminder = useApp(s => s.addReminder);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ plantId: string; task: "Water" | "Fertilize" | "Prune"; dueAt: string; repeat: "none" | "daily" | "2day" | "weekly" }>({ plantId: plants[0]?.id || "", task: "Water", dueAt: new Date().toISOString().slice(0, 10), repeat: "weekly" });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const overdue = reminders.filter(r => new Date(r.dueAt) < now && new Date(r.dueAt).toDateString() !== now.toDateString());
  const today = reminders.filter(r => new Date(r.dueAt).toDateString() === now.toDateString());
  const upcoming = reminders.filter(r => new Date(r.dueAt) >= tomorrow);

  const icon = (t: string) => t === "Water" ? Droplets : t === "Fertilize" ? Sprout : Scissors;
  const plantOf = (id: string) => plants.find(p => p.id === id);

  const save = () => {
    if (!form.plantId) { toast.error("Add a plant first"); return; }
    addReminder({ ...form, dueAt: new Date(form.dueAt).toISOString() });
    setOpen(false);
    toast.success("Reminder added");
  };

  const Section = ({ title, items, border }: { title: string; items: typeof reminders; border: string }) => (
    <div>
      <h3 className="font-display text-lg mb-2">{title} <span className="text-sm text-muted-foreground">({items.length})</span></h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Nothing here — your plants are happy.</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
          {items.map(r => {
            const Icon = icon(r.task);
            const plant = plantOf(r.plantId);
            return (
              <motion.li key={r.id} layout exit={{ opacity: 0, x: 100 }}
                className={`card-warm p-4 flex items-center justify-between border-l-4 ${border}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Icon className="w-4 h-4 text-rust" /></div>
                  <div>
                    <p className="font-medium text-sm">{r.task} {plant?.nickname || "—"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.dueAt).toDateString()}</p>
                  </div>
                </div>
                <button onClick={() => { markDone(r.id); toast.success(`Done! Next ${r.task.toLowerCase()} in 3 days.`); }}
                  className="w-9 h-9 rounded-full bg-sage/20 hover:bg-sage/40 flex items-center justify-center transition">
                  <Check className="w-4 h-4 text-sage" />
                </button>
              </motion.li>
            );
          })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <p className="eyebrow">Care</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Reminders</h1>
        </div>
        <button onClick={() => setOpen(true)} className="btn-rust !py-2 !px-4 text-sm md:hidden"><Plus className="w-4 h-4" /></button>
        <button onClick={() => setOpen(true)} className="btn-rust hidden md:inline-flex"><Plus className="w-4 h-4" /> Add reminder</button>
      </div>
      {reminders.length === 0 ? (
        <EmptyState icon="⏰" title="No reminders yet" subtitle="Set watering, feeding and pruning so nothing slips." action={<button onClick={() => setOpen(true)} className="btn-rust">Add your first →</button>} />
      ) : (
        <div className="space-y-8">
          <Section title="Overdue" items={overdue} border="border-rust" />
          <Section title="Today" items={today} border="border-amber-brand" />
          <Section title="Upcoming" items={upcoming} border="border-indigo-dusk" />
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl">Add reminder</h3>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Plant</label>
                <select className="input-warm" value={form.plantId} onChange={e => setForm({ ...form, plantId: e.target.value })}>
                  {plants.map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Task</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Water", "Fertilize", "Prune"] as const).map(t => (
                    <button key={t} onClick={() => setForm({ ...form, task: t })}
                      className={`py-2 text-xs rounded-full border ${form.task === t ? "border-rust bg-rust-soft/20 text-rust" : "border-border"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Due</label>
                <input type="date" className="input-warm" value={form.dueAt} onChange={e => setForm({ ...form, dueAt: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Repeat</label>
                <select className="input-warm" value={form.repeat} onChange={e => setForm({ ...form, repeat: e.target.value as any })}>
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="2day">Every 2 days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <button onClick={save} className="btn-rust w-full">Save reminder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
