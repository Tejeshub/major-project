import { useState } from "react";
import { useApp, useGates } from "@/stores/app";
import { PLANT_OPTIONS } from "@/data/seed";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AddPlantModal({ open, onClose, plantId }: { open: boolean; onClose: () => void; plantId?: string }) {
  const plants = useApp((s) => s.plants);
  const addPlant = useApp((s) => s.addPlant);
  const updatePlant = useApp((s) => s.updatePlant);
  const { canAddPlant } = useGates();
  const editing = plantId ? plants.find(p => p.id === plantId) : undefined;
  const [form, setForm] = useState({
    species: editing?.species || "Monstera",
    nickname: editing?.nickname || "",
    gardenType: editing?.gardenType || "balcony",
  });

  if (!open) return null;

  const save = () => {
    if (editing) {
      updatePlant(editing.id, form);
      toast.success("Plant updated");
    } else {
      if (!canAddPlant) { toast.error("Free plan supports up to 3 plants. Upgrade to add more."); return; }
      addPlant({ ...form, nickname: form.nickname || form.species });
      toast.success(`${form.nickname || form.species} added 🌿`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-card rounded-2xl w-full max-w-md p-6 shadow-warm-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl">{editing ? "Edit plant" : "Add a plant"}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Species</label>
              <select className="input-warm" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}>
                {PLANT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Nickname</label>
              <input className="input-warm" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} placeholder={form.species} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Garden type</label>
              <div className="grid grid-cols-4 gap-2">
                {["balcony", "terrace", "indoor", "mixed"].map(g => (
                  <button key={g} onClick={() => setForm({ ...form, gardenType: g })}
                    className={`py-2 text-xs rounded-full border ${form.gardenType === g ? "border-rust bg-rust-soft/20 text-rust" : "border-border"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={save} className="btn-rust w-full">{editing ? "Save changes" : "Add plant"}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
