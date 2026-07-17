import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp, useGates } from "@/stores/app";
import { MOCK_DETECTIONS } from "@/data/seed";
import { useState, useRef } from "react";
import { Camera, Upload, Lightbulb, Sun, Leaf, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/detect/")({
  head: () => ({ meta: [{ title: "Detect — PlantNest" }] }),
  component: DetectCapture,
});

function DetectCapture() {
  const navigate = useNavigate();
  const plants = useApp(s => s.plants);
  const addDetection = useApp(s => s.addDetection);
  const incrementScanCount = useApp(s => s.incrementScanCount);
  const cycle = useApp(s => s.detectionCycle);
  const { canScan, scanRemaining } = useGates();
  const [photo, setPhoto] = useState<string>("");
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [plantId, setPlantId] = useState<string>(plants[0]?.id || "");
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showGate, setShowGate] = useState(false);

  const pickFile = (f?: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);

    // Also read as base64 for the API
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(f);
  };

  const analyse = async () => {
    if (!canScan) { setShowGate(true); return; }
    if (!plantId) { toast.error("Please select a plant to analyse"); return; }
    setAnalyzing(true);
    
    try {
      const { fetchWithAuth } = await import("@/lib/apiClient");
      
      const response = await fetchWithAuth("/detections", {
        method: "POST",
        body: JSON.stringify({
          plant_id: parseInt(plantId, 10),
          image_url: photoBase64 || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=70"
        })
      });

      const plant = plants.find(p => String(p.id) === String(plantId));
      const id = addDetection({
        plantId: String(plantId),
        plantName: plant?.nickname,
        photo: photo || response.image_url,
        diseaseName: response.disease_name,
        confidence: response.confidence,
        symptoms: `Based on AI analysis, this plant shows signs of ${response.disease_name}.`,
        treatment: response.treatment_text ? [response.treatment_text] : ["Ensure adequate water and sunlight."],
        crossSellId: "prod-2", // Hardcoding a cross-sell ID from SEED_PRODUCTS for the demo
        lowConfidence: response.confidence < 60,
      });
      incrementScanCount();
      navigate({ to: "/detect/result/$id", params: { id } });
    } catch (e: any) {
      toast.error(`Analysis failed: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <Leaf className="w-16 h-16 text-rust" />
        </motion.div>
        <p className="font-display text-2xl mt-6">Analysing your plant...</p>
        <p className="text-sm text-muted-foreground mt-2">Looking for symptoms, comparing to our library.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="eyebrow">Diagnose</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Diagnose your plant</h1>
        {scanRemaining < Infinity && <p className="text-sm text-muted-foreground mt-1">{scanRemaining} free scans left this month</p>}
      </div>

      <div onClick={() => fileRef.current?.click()} className="cursor-pointer card-warm border-2 border-dashed border-rust-soft p-10 text-center">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => pickFile(e.target.files?.[0])} />
        {photo ? (
          <img src={photo} alt="" className="max-h-72 mx-auto rounded-lg object-contain" />
        ) : (
          <>
            <Leaf className="w-12 h-12 text-rust mx-auto mb-3" />
            <p className="font-medium">Drop a photo here or tap to upload</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
            <button className="btn-rust mt-4" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
              <Camera className="w-4 h-4" /> Take photo
            </button>
          </>
        )}
      </div>

      {plants.length > 0 && (
        <div>
          <label className="text-sm font-medium block mb-1.5">Which plant is this?</label>
          <select className="input-warm" value={plantId} onChange={e => setPlantId(e.target.value)}>
            <option value="">Not in my plants</option>
            {plants.map(p => <option key={p.id} value={p.id}>{p.nickname} ({p.species})</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[{ i: Sun, t: "Good lighting" }, { i: Leaf, t: "Close-up of leaf" }, { i: Upload, t: "Clean background" }].map(({ i: Icon, t }) => (
          <div key={t} className="card-warm p-3 text-center">
            <Icon className="w-5 h-5 mx-auto text-rust mb-1" />
            <p className="text-xs text-ink/70">{t}</p>
          </div>
        ))}
      </div>

      <button disabled={!photo} onClick={analyse} className="btn-rust w-full">Analyse now →</button>

      {showGate && <GateModal title="You've used your 5 free scans this month" onClose={() => setShowGate(false)} />}
    </div>
  );
}

export function GateModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute"><X className="w-4 h-4" /></button>
        <div className="text-5xl mb-3">🌿</div>
        <h3 className="font-display text-xl">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">Upgrade to Premium for unlimited scans, expert consultations and more.</p>
        <Link to="/subscription" className="btn-rust w-full mt-5">Upgrade to Premium →</Link>
        <button onClick={onClose} className="text-xs text-muted-foreground mt-3">Maybe later</button>
      </div>
    </div>
  );
}
