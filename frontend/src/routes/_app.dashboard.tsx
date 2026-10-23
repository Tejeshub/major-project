import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useGates } from "@/stores/app";
import { usePosts } from "@/hooks/useCommunity";
import { useReminders } from "@/hooks/useReminders";
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
  const { data: reminders = [] } = useReminders();
  
  const { data: posts = [], isLoading: isLoadingPosts, isError: isErrorPosts } = usePosts();
  
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
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Your garden</p>
        <h1 className="font-display font-bold text-3xl md:text-5xl mt-1 text-forest-dark tracking-tight">{greeting()}, {user?.name.split(" ")[0]} ☀️</h1>
      </div>

      {/* Weather card with Atmospheric Canopy Backdrop */}
      <div className="relative overflow-hidden rounded-3xl border border-sage-border bg-cream-surface/90 backdrop-blur-md p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Subtle Ghibli botanical wash in corner */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-right opacity-20 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('/assets/ghibli/botanical-greenery-clean.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E9F0E8] border border-[#2D5A3A]/20 flex items-center justify-center shadow-warm-sm">
            {weather?.condition?.toLowerCase().includes("rain") ? (
                <CloudRain className="w-8 h-8 text-[#2D5A3A]" strokeWidth={1.75} />
            ) : weather?.condition?.toLowerCase().includes("clear") ? (
                <Sun className="w-8 h-8 text-[#C85A32]" strokeWidth={1.75} />
            ) : (
                <Cloud className="w-8 h-8 text-[#4A584D]" strokeWidth={1.75} />
            )}
          </div>
          <div>
            {weather ? (
              <p className="font-display font-bold text-3xl md:text-4xl text-forest-dark">{weather.temperature}°C <span className="text-lg font-serif italic text-forest-muted">({weather.condition})</span></p>
            ) : (
              <p className="font-display font-bold text-3xl md:text-4xl text-forest-dark">--°C <span className="text-lg font-serif italic text-forest-muted">Loading weather...</span></p>
            )}
            <p className="text-sm text-forest-muted mt-1">Balcony microclimate conditions updated live.</p>
          </div>
        </div>
        <span className="relative z-10 chip !bg-cream-elevated/95 !border-sage-border text-forest-dark font-medium !px-4 !py-2 shadow-warm-sm backdrop-blur-sm">
          🌿 Care status: <span className="font-bold text-terracotta ml-1.5">{weather?.condition?.toLowerCase().includes("rain") ? "Avoid spraying today" : "Optimal for watering"}</span>
        </span>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {[
          { to: "/detect", icon: Camera, label: "Detect Disease" },
          { to: "/detect/history", icon: History, label: "View History" },
          { to: "/reminders", icon: Droplets, label: "Manage Reminders" },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="card-warm card-warm-hover p-5 md:p-6 flex flex-col items-center text-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-warm-sm">
              <Icon className="w-6 h-6 text-terracotta" strokeWidth={1.75} />
            </div>
            <span className="text-xs md:text-sm font-semibold text-forest-dark tracking-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* Reminders Overview */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-bold text-2xl text-forest-dark">Reminders Overview</h2>
          <Link to="/reminders" className="text-sm text-terracotta font-semibold hover:underline flex items-center gap-1">View All →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 86400000);
            const overdue = reminders.filter(r => new Date(r.dueAt) < now && new Date(r.dueAt).toDateString() !== now.toDateString());
            const today = reminders.filter(r => new Date(r.dueAt).toDateString() === now.toDateString() && r.status !== "completed");
            const upcoming = reminders.filter(r => new Date(r.dueAt) >= tomorrow && r.status !== "completed");
            
            return (
              <>
                <div className="card-warm p-5 flex flex-col justify-between border-l-4 !border-l-terracotta">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-1">Overdue</p>
                    <p className="font-display font-bold text-4xl text-forest-dark">{overdue.length}</p>
                  </div>
                  {overdue.length > 0 && <p className="text-xs text-terracotta font-medium mt-3">Needs immediate attention</p>}
                </div>
                <div className="card-warm p-5 flex flex-col justify-between border-l-4 !border-l-sage">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sage mb-1">Due Today</p>
                    <p className="font-display font-bold text-4xl text-forest-dark">{today.length}</p>
                  </div>
                  {today.length > 0 && <p className="text-xs text-forest-muted mt-3">Scheduled for today</p>}
                </div>
                <div className="card-warm p-5 flex flex-col justify-between border-l-4 !border-l-forest-muted">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-forest-muted mb-1">Upcoming</p>
                    <p className="font-display font-bold text-4xl text-forest-dark">{upcoming.length}</p>
                  </div>
                  {upcoming.length > 0 && <p className="text-xs text-forest-muted mt-3">Later this week</p>}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* My Plants */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-bold text-2xl text-forest-dark">My Plants</h2>
          <button onClick={() => canAddPlant ? setAddOpen(true) : alert("Free plan supports up to 3 plants. Upgrade to Premium for unlimited.")} className="text-sm text-terracotta font-semibold hover:underline flex items-center gap-1 cursor-pointer">
            <Plus className="w-4 h-4" strokeWidth={1.75} /> Add Plant
          </button>
        </div>
        {plants.length === 0 ? (
          <div className="card-warm p-10 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="font-display font-bold text-xl text-forest-dark">No plants in your balcony yet</p>
            <p className="text-forest-muted text-sm mt-1">Start tracking care schedules and health checks.</p>
            <button onClick={() => setAddOpen(true)} className="btn-rust mt-5">Add your first plant →</button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
            {plants.map((p) => {
              const due = reminders.find(r => String(r.plantId) === String(p.id) && new Date(r.dueAt) <= new Date(Date.now() + 86400000));
              return (
                <Link key={p.id} to="/plants/$id" params={{ id: p.id }} className="snap-start card-warm card-warm-hover p-4 min-w-[170px] flex flex-col items-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-sand-deep border border-sage-border/80 mb-3 shadow-warm-sm">
                    <img src={p.photo || PLANT_PHOTOS[p.species] || PLANT_PHOTOS.Monstera} alt={p.nickname} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className="font-semibold text-center text-sm text-forest-dark">{p.nickname}</p>
                  <p className="text-xs text-forest-muted text-center font-serif italic">{p.species}</p>
                  {due && <span className="chip mx-auto mt-2.5 !bg-sand-deep text-terracotta !border-sage-border !text-[10px] font-semibold"><Droplets className="w-3 h-3" strokeWidth={1.75} /> {due.task} {new Date(due.dueAt).toDateString() === new Date().toDateString() ? "today" : "soon"}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Community */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-bold text-2xl text-forest-dark">Community Highlights</h2>
          <Link to="/community" className="text-sm text-terracotta font-semibold hover:underline">See all →</Link>
        </div>
        
        {isLoadingPosts ? (
          <div className="text-sm text-forest-muted animate-pulse">Loading community highlights...</div>
        ) : isErrorPosts ? (
          <div className="text-sm text-forest-muted">Unable to load highlights.</div>
        ) : (posts.length === 0 ? SEED_POSTS : posts).length === 0 ? (
          <div className="text-sm text-forest-muted">No posts to highlight.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(posts.length === 0 ? SEED_POSTS : posts).slice(0, 3).map((p) => (
              <Link key={p.id} to="/community/post/$id" params={{ id: p.id }} className="card-warm card-warm-hover overflow-hidden block">
                <img src={p.image} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                <div className="p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} className="w-7 h-7 rounded-full bg-sand-deep border border-sage-border" alt="" />
                    <span className="text-sm font-semibold text-forest-dark">{p.user}</span>
                  </div>
                  <p className="text-sm text-forest-muted mt-2 line-clamp-2 leading-relaxed">{p.caption}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AddPlantModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
