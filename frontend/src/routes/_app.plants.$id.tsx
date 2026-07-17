import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { PLANT_PHOTOS } from "@/data/seed";
import { Edit2, Trash2, Droplets, Sprout, Scissors } from "lucide-react";
import { useState } from "react";
import { AddPlantModal } from "@/components/AddPlantModal";
import { useReminders, useCompleteReminder } from "@/hooks/useReminders";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/plants/$id")({
  component: PlantDetail,
});

function PlantDetail() {
  const { id } = useParams({ from: "/_app/plants/$id" });
  const navigate = useNavigate();
  const plant = useApp((s) => s.plants.find(p => p.id === id));
  const detections = useApp((s) => s.detections.filter(d => d.plantId === id));
  
  const { data: allReminders = [], isLoading: isLoadingReminders, isError: isErrorReminders } = useReminders();
  const { mutate: completeReminder } = useCompleteReminder();
  const reminders = allReminders.filter((r: any) => String(r.plantId) === id && r.status !== "completed");
  
  const deletePlant = useApp((s) => s.deletePlant);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!plant) return <div className="text-center py-20 text-muted-foreground">Plant not found.</div>;

  const icon = (t: string) => t === "Water" ? Droplets : t === "Fertilize" ? Sprout : Scissors;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="card-warm overflow-hidden">
        <div className="relative aspect-[2/1] bg-secondary">
          <img src={plant.photo || PLANT_PHOTOS[plant.species] || PLANT_PHOTOS.Monstera} alt={plant.nickname} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => setEditOpen(true)} className="bg-card/90 backdrop-blur p-2 rounded-full shadow-warm hover:scale-105 transition"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => setConfirmDel(true)} className="bg-card/90 backdrop-blur p-2 rounded-full shadow-warm hover:scale-105 transition"><Trash2 className="w-4 h-4 text-destructive" /></button>
          </div>
        </div>
        <div className="p-6">
          <p className="eyebrow">{plant.species}</p>
          <h1 className="font-display text-3xl mt-1">{plant.nickname}</h1>
          <div className="flex gap-2 mt-3">
            <span className="chip">🪴 {plant.gardenType}</span>
            <span className="chip">Added {new Date(plant.addedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-display text-xl mb-3">Upcoming Care</h2>
        {isLoadingReminders ? (
          <div className="card-warm p-5 text-sm text-muted-foreground animate-pulse">Loading reminders...</div>
        ) : isErrorReminders ? (
          <div className="card-warm p-5 text-sm text-destructive">Failed to load reminders.</div>
        ) : reminders.length === 0 ? (
          <div className="card-warm p-5 text-sm text-muted-foreground">No reminders yet. Add one from Reminders.</div>
        ) : (
          <ul className="space-y-2">
            {reminders.map((r: any) => {
              const Icon = icon(r.task);
              return (
                <li key={r.id} className="card-warm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rust-soft/30 flex items-center justify-center"><Icon className="w-4 h-4 text-rust" /></div>
                    <div>
                      <p className="font-medium text-sm">{r.task}</p>
                      <p className="text-xs text-muted-foreground">Due {new Date(r.dueAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => { completeReminder(r.id); toast.success(`${r.task} done! Scheduled next recurrence if applicable.`); }} className="btn-ghost-border !py-1.5 !px-3 text-xs">Mark done</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">Detection History</h2>
        {detections.length === 0 ? (
          <div className="card-warm p-5 text-sm text-muted-foreground">No detections yet for this plant.</div>
        ) : (
          <ul className="space-y-2">
            {detections.map(d => (
              <li key={d.id} className="card-warm p-3 flex items-center gap-3">
                <img src={d.photo} alt="" className="w-14 h-14 rounded-lg object-cover bg-secondary" />
                <div className="flex-1">
                  <p className="font-medium">{d.diseaseName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.ts).toLocaleDateString()}</p>
                </div>
                <span className="chip !bg-amber-soft text-ink">{d.confidence}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AddPlantModal open={editOpen} onClose={() => setEditOpen(false)} plantId={plant.id} />
      {confirmDel && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDel(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg">Delete {plant.nickname}?</h3>
            <p className="text-sm text-muted-foreground mt-2">This will also remove its reminders.</p>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setConfirmDel(false)} className="btn-ghost-border !py-2 !px-4 text-sm">Cancel</button>
              <button onClick={() => { deletePlant(plant.id); toast.success("Plant removed"); navigate({ to: "/dashboard" }); }} className="btn-rust !py-2 !px-4 text-sm !bg-destructive">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
