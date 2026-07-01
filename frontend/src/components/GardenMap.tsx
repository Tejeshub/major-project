import { useEffect, useRef, useState } from "react";
import { useApp } from "@/stores/app";
import { SEED_MAP_GARDENERS, SEED_MAP_NURSERIES, USER_LOCATION, type MapGardener, type MapNursery } from "@/data/seed";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Crosshair, Filter, Store, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Filter = "all" | "gardeners" | "nurseries";

export function GardenMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedG, setSelectedG] = useState<MapGardener | null>(null);
  const [selectedN, setSelectedN] = useState<MapNursery | null>(null);
  const user = useApp(s => s.user);
  const hideBanner = useApp(s => s.hideMapPrivacyBanner);
  const dismissBanner = useApp(s => s.dismissMapPrivacyBanner);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    let map: any;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      if (leafletRef.current) return;

      map = L.map(mapRef.current, { zoomControl: false }).setView([USER_LOCATION.lat, USER_LOCATION.lng], 13);
      leafletRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OSM, © CARTO", subdomains: "abcd", maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // User pin
      const userIcon = L.divIcon({
        className: "", html: `<div style="position:relative; transform:translate(-50%,-100%);">
          <div style="width:48px;height:48px;border-radius:50%;background:#c1532b;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.25);overflow:hidden">
            <img src="${user?.avatar || ''}" style="width:100%;height:100%;object-fit:cover"/>
          </div>
          <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:12px solid #c1532b;margin:0 auto;"></div>
        </div>`,
      });
      L.marker([USER_LOCATION.lat, USER_LOCATION.lng], { icon: userIcon }).addTo(map);

      const addGardeners = () => {
        SEED_MAP_GARDENERS.forEach(g => {
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:42px;height:42px;border-radius:50%;border:3px solid #fff;background:#e8a33d;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.2);transform:translate(-50%,-50%);cursor:pointer">
              <img src="${g.avatar}" style="width:100%;height:100%;object-fit:cover"/>
            </div>`,
          });
          const m = L.marker([g.lat, g.lng], { icon }).addTo(map);
          m.on("click", () => { setSelectedG(g); setSelectedN(null); });
          markersRef.current.push(m);
        });
      };
      const addNurseries = () => {
        SEED_MAP_NURSERIES.forEach(n => {
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:36px;height:36px;border-radius:10px;background:#e8a33d;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.2);transform:translate(-50%,-50%);cursor:pointer">🌿</div>`,
          });
          const m = L.marker([n.lat, n.lng], { icon }).addTo(map);
          m.on("click", () => { setSelectedN(n); setSelectedG(null); });
          markersRef.current.push(m);
        });
      };
      addGardeners();
      addNurseries();
    })();
    return () => {
      cancelled = true;
      markersRef.current.forEach(m => m.remove?.());
      markersRef.current = [];
      if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }
    };
  }, [user?.avatar]);

  const recenter = () => leafletRef.current?.setView([USER_LOCATION.lat, USER_LOCATION.lng], 14);

  return (
    <div className="grid md:grid-cols-[1fr_2.3fr] gap-4 h-[70vh] md:h-[75vh]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col gap-2 overflow-y-auto pr-1">
        <h3 className="font-display text-lg">Nearby</h3>
        {SEED_MAP_GARDENERS.map(g => (
          <button key={g.id} onClick={() => { setSelectedG(g); leafletRef.current?.setView([g.lat, g.lng], 15); }} className="card-warm card-warm-hover p-3 text-left flex items-center gap-3">
            <img src={g.avatar} className="w-10 h-10 rounded-full bg-secondary" alt="" />
            <div>
              <p className="font-medium text-sm">{g.name}</p>
              <p className="text-xs text-muted-foreground">{g.area} · {g.plantCount} plants</p>
            </div>
          </button>
        ))}
        <h3 className="font-display text-lg mt-3">Nurseries</h3>
        {SEED_MAP_NURSERIES.map(n => (
          <button key={n.id} onClick={() => { setSelectedN(n); leafletRef.current?.setView([n.lat, n.lng], 15); }} className="card-warm card-warm-hover p-3 text-left">
            <p className="font-medium text-sm flex items-center gap-2"><Store className="w-4 h-4 text-amber-brand" /> {n.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{n.address}</p>
            <p className="text-xs mt-1"><span className="text-rust">★ {n.rating}</span> · {n.openNow ? <span className="text-sage">Open now</span> : <span className="text-muted-foreground">Closed</span>}</p>
          </button>
        ))}
      </aside>

      {/* Map */}
      <div className="relative card-warm overflow-hidden">
        <div ref={mapRef} className="w-full h-full" style={{ background: "#f0e8da" }} />

        {/* Top controls */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 pointer-events-none">
          <div className="card-warm flex items-center gap-2 px-3 py-2 flex-1 max-w-sm pointer-events-auto">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input className="bg-transparent flex-1 outline-none text-sm" placeholder="Search area..." />
          </div>
          <button onClick={recenter} className="card-warm w-10 h-10 flex items-center justify-center pointer-events-auto"><Crosshair className="w-4 h-4 text-rust" /></button>
          <details className="pointer-events-auto">
            <summary className="card-warm w-10 h-10 flex items-center justify-center cursor-pointer list-none"><Filter className="w-4 h-4 text-rust" /></summary>
            <div className="absolute right-0 mt-1 card-warm p-2 flex flex-col gap-1 min-w-[140px]">
              {(["all", "gardeners", "nurseries"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`text-left text-sm px-2 py-1 rounded ${filter === f ? "bg-rust-soft/30 text-rust" : ""}`}>{f}</button>
              ))}
            </div>
          </details>
        </div>

        {/* Privacy banner */}
        {!hideBanner && (
          <div className="absolute top-16 left-3 right-3 md:left-auto md:max-w-xs card-warm bg-amber-soft/80 p-3 text-xs text-ink flex items-start gap-2">
            <span>📍</span>
            <p className="flex-1">Location is approximate — exact addresses are never shared.</p>
            <button onClick={dismissBanner}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* Bottom strip — friends */}
        <div className="absolute bottom-3 left-3 right-3 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SEED_MAP_GARDENERS.map(g => (
              <button key={g.id} onClick={() => setSelectedG(g)} className="flex flex-col items-center min-w-[60px]">
                <img src={g.avatar} className="w-12 h-12 rounded-full border-2 border-rust" alt="" />
                <span className="text-[10px] mt-1 text-ink/80">{g.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Drawer */}
        <AnimatePresence>
          {(selectedG || selectedN) && (
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 inset-x-0 bg-card rounded-t-2xl shadow-warm-lg p-5 max-h-[60%] overflow-y-auto">
              <button onClick={() => { setSelectedG(null); setSelectedN(null); }} className="absolute top-3 right-3"><X className="w-4 h-4" /></button>
              {selectedG && (
                <div>
                  <div className="flex items-center gap-3">
                    <img src={selectedG.avatar} className="w-16 h-16 rounded-full bg-secondary" alt="" />
                    <div>
                      <p className="font-display text-xl">{selectedG.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedG.area}</p>
                      <p className="text-xs text-rust mt-1">🌿 {selectedG.plantCount} plants growing</p>
                    </div>
                  </div>
                  <p className="eyebrow mt-4">Recent posts</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedG.recentPosts.map((src, i) => <img key={i} src={src} alt="" className="aspect-square rounded-lg object-cover" />)}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="btn-ghost-border flex-1 !py-2 text-sm">View profile</button>
                    <button className="btn-rust flex-1 !py-2 text-sm">Send message</button>
                  </div>
                </div>
              )}
              {selectedN && (
                <div>
                  <p className="eyebrow flex items-center gap-1"><Store className="w-3 h-3" /> Nursery</p>
                  <p className="font-display text-2xl mt-1">{selectedN.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedN.address}</p>
                  <p className="text-sm mt-2"><Star className="w-4 h-4 inline text-rust" /> {selectedN.rating} · {selectedN.openNow ? <span className="text-sage">● Open now</span> : <span className="text-muted-foreground">● Closed</span>}</p>
                  <Link to="/market" className="btn-rust w-full mt-4">View in marketplace →</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
