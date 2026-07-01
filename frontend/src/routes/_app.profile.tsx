import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useState } from "react";
import { LogOut, Download, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — PlantNest" }] }),
  component: Profile,
});

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-11 h-6 rounded-full transition ${on ? "bg-rust" : "bg-border"} relative`}>
      <span className={`absolute top-0.5 ${on ? "left-5" : "left-0.5"} w-5 h-5 bg-white rounded-full shadow transition-all`} />
    </button>
  );
}

function Profile() {
  const user = useApp(s => s.user);
  const role = useApp(s => s.role);
  const plan = useApp(s => s.plan);
  const plants = useApp(s => s.plants);
  const detections = useApp(s => s.detections);
  const posts = useApp(s => s.posts);
  const settings = useApp(s => s.settings);
  const updateSettings = useApp(s => s.updateSettings);
  const logout = useApp(s => s.logout);
  const navigate = useNavigate();
  const [confirmDel, setConfirmDel] = useState("");
  const [delOpen, setDelOpen] = useState(false);

  if (!user) return null;

  const setNotif = (k: keyof typeof settings.notifications, v: boolean) => updateSettings({ notifications: { ...settings.notifications, [k]: v } });
  const setPriv = (k: keyof typeof settings.privacy, v: any) => updateSettings({ privacy: { ...settings.privacy, [k]: v } });
  const setMap = (k: keyof typeof settings.map, v: boolean) => updateSettings({ map: { ...settings.map, [k]: v } });

  const exportData = () => {
    const data = JSON.stringify({ user, plants, detections }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "plantnest-data.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card-warm p-6 flex items-center gap-4">
        <div className="relative group">
          <img src={user.avatar} className="w-20 h-20 rounded-full bg-secondary" alt="" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="chip !bg-amber-soft text-ink capitalize">{role}</span>
            <span className="chip !bg-rust-soft/40 text-rust capitalize flex items-center gap-1"><Crown className="w-3 h-3" /> {plan}</span>
            {plan === "free" && <Link to="/subscription" className="text-xs text-rust underline">Upgrade</Link>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[{ n: plants.length, l: "Plants" }, { n: detections.length, l: "Detections" }, { n: posts.filter(p => p.user === user.name).length, l: "Posts" }].map(s => (
          <div key={s.l} className="card-warm p-4">
            <p className="font-display text-2xl text-rust">{s.n}</p>
            <p className="eyebrow !text-ink/55">{s.l}</p>
          </div>
        ))}
      </div>

      <Section title="Notifications">
        {Object.entries({
          watering: "Watering reminders", disease: "Disease alerts", community: "Community likes & comments",
          expertAvailability: "New expert availability", orders: "Order updates", weather: "Weather advisories",
        }).map(([k, l]) => (
          <Row key={k} label={l}>
            <Toggle on={(settings.notifications as any)[k]} onChange={v => setNotif(k as any, v)} />
          </Row>
        ))}
      </Section>

      <Section title="Privacy">
        <Row label="Location sharing" hint="Used only for Garden Map & local nursery discovery">
          <Toggle on={settings.privacy.locationSharing} onChange={v => setPriv("locationSharing", v)} />
        </Row>
        <Row label="Profile visibility">
          <div className="flex bg-secondary rounded-full p-1 text-xs">
            {(["public", "friends", "private"] as const).map(v => (
              <button key={v} onClick={() => setPriv("profileVisibility", v)} className={`px-3 py-1 rounded-full ${settings.privacy.profileVisibility === v ? "bg-card shadow-warm" : ""}`}>{v}</button>
            ))}
          </div>
        </Row>
        <Row label="Activity visibility">
          <Toggle on={settings.privacy.activityVisibility} onChange={v => setPriv("activityVisibility", v)} />
        </Row>
      </Section>

      <Section title="Garden Map">
        <Row label="Show my avatar on map"><Toggle on={settings.map.showAvatar} onChange={v => setMap("showAvatar", v)} /></Row>
        <Row label="Show my plants count"><Toggle on={settings.map.showPlantCount} onChange={v => setMap("showPlantCount", v)} /></Row>
      </Section>

      <Section title="Account">
        <button onClick={exportData} className="btn-ghost-border w-full"><Download className="w-4 h-4" /> Export my data</button>
        <button onClick={() => setDelOpen(true)} className="text-sm text-destructive">Delete account</button>
      </Section>

      <button onClick={() => { logout(); navigate({ to: "/" }); toast.success("Signed out"); }} className="btn-ghost-border w-full !border-rust !text-rust"><LogOut className="w-4 h-4" /> Logout</button>

      {delOpen && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4" onClick={() => setDelOpen(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-destructive">Delete account?</h3>
            <p className="text-sm text-muted-foreground mt-2">Type DELETE to confirm. This cannot be undone.</p>
            <input className="input-warm mt-3" value={confirmDel} onChange={e => setConfirmDel(e.target.value)} />
            <button disabled={confirmDel !== "DELETE"} onClick={() => { logout(); navigate({ to: "/" }); toast.success("Account deleted"); }} className="btn-rust w-full mt-3 !bg-destructive">Delete forever</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-warm p-5">
      <h3 className="font-display text-lg mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
