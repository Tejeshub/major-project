import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { Droplets, Sprout, Scissors, Plus, X, Check, Trash2, Edit2, Clock, Calendar, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useReminders, useCreateReminder, useCompleteReminder, useDeleteReminder, useEditReminder, Reminder } from "@/hooks/useReminders";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/reminders")({
  head: () => ({ meta: [{ title: "Reminders — PlantNest" }] }),
  component: RemindersPage,
});

function RemindersPage() {
  const { data: reminders = [], isLoading, isError, refetch } = useReminders();
  const { mutate: completeReminder, isPending: isCompleting } = useCompleteReminder();
  const { mutate: createReminder, isPending: isCreating } = useCreateReminder();
  const { mutate: deleteReminder, isPending: isDeleting } = useDeleteReminder();
  const { mutate: editReminder, isPending: isEditing } = useEditReminder();
  
  const plants = useApp(s => s.plants);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"All" | "Water" | "Fertilize" | "Prune">("All");

  const defaultForm = { plantId: plants[0]?.id || "", task: "Water" as "Water" | "Fertilize" | "Prune", dueAt: new Date().toISOString().slice(0, 10), repeat: "weekly" as "none" | "daily" | "2day" | "weekly" };
  const [form, setForm] = useState(defaultForm);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);

  const filteredReminders = useMemo(() => {
    return reminders.filter(r => filterType === "All" || r.task === filterType);
  }, [reminders, filterType]);

  const overdue = filteredReminders.filter(r => new Date(r.dueAt) < now && new Date(r.dueAt).toDateString() !== now.toDateString() && r.status !== "completed");
  const today = filteredReminders.filter(r => new Date(r.dueAt).toDateString() === now.toDateString() && r.status !== "completed");
  const upcoming = filteredReminders.filter(r => new Date(r.dueAt) >= tomorrow && r.status !== "completed");
  const completed = filteredReminders.filter(r => r.status === "completed").sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());

  const icon = (t: string) => t === "Water" ? Droplets : t === "Fertilize" ? Sprout : Scissors;
  const plantOf = (id: string) => plants.find(p => String(p.id) === String(id));

  const save = () => {
    if (!form.plantId) { toast.error("Add a plant first"); return; }
    const dueAtISO = new Date(form.dueAt).toISOString();
    
    if (editingId) {
      editReminder({ id: editingId, data: { ...form, plantId: parseInt(form.plantId), dueAt: dueAtISO } });
      toast.success("Reminder updated");
    } else {
      createReminder({ ...form, plantId: parseInt(form.plantId), dueAt: dueAtISO });
      toast.success("Reminder created");
    }
    setOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const startEdit = (r: Reminder) => {
    setEditingId(r.id);
    setForm({
      plantId: String(r.plantId),
      task: r.task,
      dueAt: new Date(r.dueAt).toISOString().slice(0, 10),
      repeat: r.repeat
    });
    setOpen(true);
  };

  const Section = ({ title, items, border, icon: SectionIcon }: { title: string; items: typeof reminders; border: string; icon: any }) => (
    <div>
      <h3 className="font-display text-xl mb-4 flex items-center gap-2">
        <SectionIcon className="w-5 h-5 text-muted-foreground" />
        {title} <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic card-warm p-4 bg-transparent border border-dashed text-center">No {title.toLowerCase()} reminders.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
          {items.map(r => {
            const Icon = icon(r.task);
            const plant = plantOf(r.plantId);
            const isDone = r.status === "completed";
            return (
              <motion.li key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`card-warm p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between border-l-4 ${border} ${isDone ? "opacity-60 grayscale-[0.5]" : ""}`}>
                
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDone ? "bg-muted text-muted-foreground" : "bg-rust-soft/30 text-rust"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-base flex items-center gap-2">
                      {r.task} <span className="text-muted-foreground font-normal text-sm">— {plant?.nickname || "Unknown Plant"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(r.dueAt).toDateString()}</span>
                      {r.repeat !== "none" && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Repeats {r.repeat}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {!isDone && (
                    <button onClick={() => { completeReminder(r.id); toast.success(`Done! Scheduled next recurrence if applicable.`); }}
                      disabled={isCompleting}
                      className="btn-ghost-border !p-2 rounded-full hover:bg-sage/20 hover:text-sage transition disabled:opacity-50" title="Mark Complete">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {!isDone && (
                    <button onClick={() => startEdit(r)} disabled={isEditing} className="btn-ghost-border !p-2 rounded-full hover:bg-amber-brand/20 hover:text-amber-brand transition disabled:opacity-50" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { deleteReminder(r.id); toast.success("Reminder deleted"); }} disabled={isDeleting} className="btn-ghost-border !p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition disabled:opacity-50" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.li>
            );
          })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="eyebrow">Management</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Reminders</h1>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="input-warm !py-2 shrink-0 bg-transparent text-sm" value={filterType} onChange={e => setFilterType(e.target.value as any)}>
            <option value="All">All Types</option>
            <option value="Water">Water</option>
            <option value="Fertilize">Fertilize</option>
            <option value="Prune">Prune</option>
          </select>
          <button onClick={() => { setEditingId(null); setForm(defaultForm); setOpen(true); }} className="btn-rust w-full md:w-auto flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Reminder</button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-card-warm rounded-2xl w-full"></div>
          <div className="h-24 bg-card-warm rounded-2xl w-full"></div>
          <div className="h-24 bg-card-warm rounded-2xl w-full"></div>
        </div>
      ) : isError ? (
        <div className="card-warm p-8 text-center text-destructive flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8" />
          <p>Failed to load reminders. Please try again.</p>
          <button onClick={() => refetch()} className="btn-ghost-border">Retry</button>
        </div>
      ) : reminders.length === 0 ? (
        <EmptyState icon="⏰" title="No reminders yet" subtitle="Set watering, feeding and pruning schedules so nothing slips." action={<button onClick={() => { setEditingId(null); setForm(defaultForm); setOpen(true); }} className="btn-rust">Add your first →</button>} />
      ) : (
        <div className="space-y-12">
          {overdue.length > 0 && <Section title="Overdue" items={overdue} border="border-rust" icon={AlertCircle} />}
          <Section title="Today" items={today} border="border-amber-brand" icon={Clock} />
          <Section title="Upcoming" items={upcoming} border="border-indigo-dusk" icon={Calendar} />
          {completed.length > 0 && <Section title="Completed" items={completed} border="border-sage" icon={Check} />}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl">{editingId ? "Edit Reminder" : "New Reminder"}</h3>
              <button onClick={() => setOpen(false)} className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Plant</label>
                <select className="input-warm w-full" value={form.plantId} onChange={e => setForm({ ...form, plantId: e.target.value })}>
                  {plants.length === 0 ? <option value="">No plants available</option> : plants.map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Task</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Water", "Fertilize", "Prune"] as const).map(t => (
                    <button key={t} onClick={() => setForm({ ...form, task: t })}
                      className={`py-2.5 text-sm rounded-xl border transition ${form.task === t ? "border-rust bg-rust-soft/20 text-rust font-medium shadow-sm" : "border-border hover:bg-secondary/50"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Due Date</label>
                  <input type="date" className="input-warm w-full" value={form.dueAt} onChange={e => setForm({ ...form, dueAt: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Repeat</label>
                  <select className="input-warm w-full" value={form.repeat} onChange={e => setForm({ ...form, repeat: e.target.value as any })}>
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="2day">Every 2 days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button onClick={() => setOpen(false)} className="btn-ghost-border flex-1 py-3">Cancel</button>
                <button onClick={save} disabled={isCreating || isEditing} className="btn-rust flex-1 py-3 disabled:opacity-50">
                  {isCreating || isEditing ? "Saving..." : "Save Reminder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
