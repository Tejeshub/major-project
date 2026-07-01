import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, X, MapPin as MapPinIcon, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { GardenMap } from "@/components/GardenMap";

export const Route = createFileRoute("/_app/community/")({
  head: () => ({ meta: [{ title: "Community — PlantNest" }] }),
  component: Community,
});

function Community() {
  const [tab, setTab] = useState<"feed" | "map">("feed");
  return (
    <div className="space-y-5 -mt-2 md:mt-0">
      <div>
        <p className="eyebrow">Community</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">From your fellow gardeners</h1>
      </div>
      <div className="flex bg-secondary rounded-full p-1 w-fit">
        <button onClick={() => setTab("feed")} className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "feed" ? "bg-card text-ink shadow-warm" : "text-ink/60"}`}><List className="w-4 h-4" /> Feed</button>
        <button onClick={() => setTab("map")} className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "map" ? "bg-card text-ink shadow-warm" : "text-ink/60"}`}><MapPinIcon className="w-4 h-4" /> Garden Map</button>
      </div>
      {tab === "feed" ? <Feed /> : <GardenMap />}
    </div>
  );
}

function Feed() {
  const posts = useApp(s => s.posts);
  const toggleLike = useApp(s => s.toggleLike);
  const addPost = useApp(s => s.addPost);
  const user = useApp(s => s.user);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ caption: "", image: "" });

  const submit = () => {
    if (!user || !draft.caption.trim()) return;
    addPost({
      user: user.name, avatar: user.avatar, city: "Mumbai",
      image: draft.image || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=70",
      caption: draft.caption,
    });
    setDraft({ caption: "", image: "" });
    setComposerOpen(false);
    toast.success("Posted 🌿");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {posts.map(p => (
        <article key={p.id} className="card-warm overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <img src={p.avatar} className="w-10 h-10 rounded-full bg-secondary" alt="" />
            <div className="flex-1">
              <p className="font-medium text-sm">{p.user}</p>
              <p className="text-xs text-muted-foreground">{p.city} · {p.ts}</p>
            </div>
          </div>
          <Link to="/community/post/$id" params={{ id: p.id }}>
            <img src={p.image} alt="" className="w-full aspect-video object-cover" loading="lazy" />
          </Link>
          <div className="p-4">
            <div className="flex items-center gap-4">
              <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1.5 group">
                <motion.div whileTap={{ scale: 1.4 }}>
                  <Heart className={`w-5 h-5 transition ${p.liked ? "fill-rust text-rust" : "text-ink/60 group-hover:text-rust"}`} />
                </motion.div>
                <span className="text-sm">{p.likes}</span>
              </button>
              <Link to="/community/post/$id" params={{ id: p.id }} className="flex items-center gap-1.5 text-ink/60 hover:text-ink">
                <MessageCircle className="w-5 h-5" /> <span className="text-sm">{p.comments.length}</span>
              </Link>
              <button className="ml-auto text-ink/60"><Share2 className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-ink/85 mt-3"><span className="font-medium">{p.user}</span> {p.caption}</p>
            {p.comments.length > 0 && (
              <Link to="/community/post/$id" params={{ id: p.id }} className="text-xs text-muted-foreground mt-2 inline-block">View all {p.comments.length} comments</Link>
            )}
          </div>
        </article>
      ))}

      <button onClick={() => setComposerOpen(true)} className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-full bg-rust text-white shadow-warm-lg flex items-center justify-center hover:scale-105 transition z-30"><Plus className="w-6 h-6" /></button>

      <AnimatePresence>
        {composerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setComposerOpen(false)} className="fixed inset-0 bg-ink/40 z-50 flex md:items-center items-end justify-center">
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} onClick={e => e.stopPropagation()} className="bg-card w-full md:max-w-md md:rounded-2xl rounded-t-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl">New post</h3>
                <button onClick={() => setComposerOpen(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="aspect-video bg-secondary rounded-lg mb-3 overflow-hidden flex items-center justify-center text-muted-foreground">
                {draft.image ? <img src={draft.image} className="w-full h-full object-cover" alt="" /> : "Photo preview"}
              </div>
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setDraft({ ...draft, image: URL.createObjectURL(f) }); }} className="text-xs mb-3" />
              <textarea className="input-warm" rows={3} placeholder="Share your plant story..." value={draft.caption} onChange={e => setDraft({ ...draft, caption: e.target.value })} />
              <button onClick={submit} className="btn-rust w-full mt-3">Post</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
