import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useGates } from "@/stores/app";
import { PLANT_PHOTOS, SEED_POSTS } from "@/data/seed";
import { Camera, History, ShoppingBag, Cloud, Droplets, Plus, Sun, CloudRain } from "lucide-react";
import { useState, useEffect } from "react";
import { AddPlantModal } from "@/components/AddPlantModal";
import { fetchWithAuth } from "@/lib/apiClient";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PlantNest" }] }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const user = useApp((s) => s.user);
  const plants = useApp((s) => s.plants);
  const reminders = useApp((s) => s.reminders);
  const { canAddPlant } = useGates();
  const [addOpen, setAddOpen] = useState(false);
  const [weather, setWeather] = useState<{temperature: number, condition: string} | null>(null);

  useEffect(() => {
    // Defaulting to New Delhi coordinates for demo purposes
    fetchWithAuth("/weather?lat=28.6139&lng=77.2090")
      .then(res => setWeather(res))
      .catch(err => console.error("Weather fetch failed:", err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Your garden</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">{greeting()}, {user?.name.split(" ")[0]} ☀️</h1>
      </div>

      {/* Weather card */}
      <div className="card-warm p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-soft/60 flex items-center justify-center">
            {weather?.condition?.toLowerCase().includes("rain") ? (
                <CloudRain className="w-7 h-7 text-rust" />
            ) : weather?.condition?.toLowerCase().includes("clear") ? (
                <Sun className="w-7 h-7 text-rust" />
            ) : (
                <Cloud className="w-7 h-7 text-rust" />
            )}
          </div>
          <div>
            {weather ? (
              <p className="font-display text-2xl">{weather.temperature}°C <span className="text-base text-muted-foreground">{weather.condition}</span></p>
            ) : (
              <p className="font-display text-2xl">--°C <span className="text-base text-muted-foreground">Loading...</span></p>
            )}
            <p className="text-sm text-ink/70 mt-0.5">Based on your location.</p>
          </div>
        </div>
        <span className="chip !bg-amber-soft text-ink">Spraying: {weather?.condition?.toLowerCase().includes("rain") ? "Avoid" : "Favourable"}</span>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { to: "/detect", icon: Camera, label: "Detect Disease" },
          { to: "/detect/history", icon: History, label: "View History" },
          { to: "/market", icon: ShoppingBag, label: "Shop Products" },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="card-warm card-warm-hover p-4 md:p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-rust-soft/30 flex items-center justify-center"><Icon className="w-5 h-5 text-rust" /></div>
            <span className="text-xs md:text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      {/* My Plants */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl">My Plants</h2>
          <button onClick={() => canAddPlant ? setAddOpen(true) : alert("Free plan supports up to 3 plants. Upgrade to Premium for unlimited.")} className="text-sm text-rust font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Plant</button>
        </div>
        {plants.length === 0 ? (
          <div className="card-warm p-8 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="font-display text-lg">No plants yet</p>
            <button onClick={() => setAddOpen(true)} className="btn-rust mt-4">Add your first plant →</button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {plants.map((p) => {
              const due = reminders.find(r => r.plantId === p.id && new Date(r.dueAt) <= new Date(Date.now() + 86400000));
              return (
                <Link key={p.id} to="/plants/$id" params={{ id: p.id }} className="snap-start card-warm card-warm-hover p-4 min-w-[160px]">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-secondary mb-3">
                    <img src={p.photo || PLANT_PHOTOS[p.species] || PLANT_PHOTOS.Monstera} alt={p.nickname} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className="font-medium text-center text-sm">{p.nickname}</p>
                  <p className="text-xs text-muted-foreground text-center">{p.species}</p>
                  {due && <span className="chip mx-auto mt-2 !bg-amber-soft text-ink !text-[10px]"><Droplets className="w-3 h-3" /> {due.task} {new Date(due.dueAt).toDateString() === new Date().toDateString() ? "today" : "soon"}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Community */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl">Community Highlights</h2>
          <Link to="/community" className="text-sm text-rust">See all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SEED_POSTS.slice(0, 3).map((p) => (
            <Link key={p.id} to="/community/post/$id" params={{ id: p.id }} className="card-warm card-warm-hover overflow-hidden">
              <img src={p.image} alt="" className="w-full aspect-video object-cover" loading="lazy" />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <img src={p.avatar} className="w-7 h-7 rounded-full" alt="" />
                  <span className="text-sm font-medium">{p.user}</span>
                </div>
                <p className="text-sm text-ink/75 mt-2 line-clamp-2">{p.caption}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AddPlantModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
