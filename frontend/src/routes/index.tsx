import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo, HeroPot } from "@/components/ui-brand/Logo";
import { Counter } from "@/components/ui-brand/primitives";
import { useRef } from "react";
import { Camera, BellRing, Store, MessageCircle, Leaf } from "lucide-react";
import { SEED_POSTS } from "@/data/seed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlantNest — Grow plants, not stress." },
      { name: "description", content: "Built for Indian balconies, not farms. AI disease checks, smart reminders, nursery marketplace, and experts a tap away." },
      { property: "og:title", content: "PlantNest — Grow plants, not stress." },
      { property: "og:description", content: "A quiet companion for your pots." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const potY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-ink/70 hover:text-ink">Features</a>
            <a href="#how" className="text-ink/70 hover:text-ink">How it works</a>
            <Link to="/learn" className="text-ink/70 hover:text-ink">Learn</Link>
            <Link to="/experts" className="text-ink/70 hover:text-ink">Experts</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-ink/80 hover:text-ink hidden sm:inline">Sign in</Link>
            <Link to="/login" className="btn-rust !py-2 !px-4 text-sm">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="chip !bg-amber-soft text-ink !px-3">🌿 Built for Indian balconies, not farms</span>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] mt-6">
            <span className="text-ink">Grow plants,</span><br />
            <span className="italic text-rust">not stress.</span>
          </h1>
          <p className="text-ink/75 text-lg mt-6 max-w-md leading-relaxed">
            PlantNest is a quiet companion for your pots — AI disease checks, weather-aware reminders, a real nursery marketplace, and experts a tap away.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/login" className="btn-rust">Start free →</Link>
            <a href="#how" className="btn-ghost-border">See how it works</a>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50">
            <Stat n={38000} suffix="+" label="Plants tracked" />
            <Stat n={92} suffix="%" label="Diagnosis accuracy" />
            <Stat n={240} suffix="+" label="Nurseries onboard" />
          </div>
        </div>
        <motion.div style={{ y: potY }}>
          <HeroPot className="max-w-md mx-auto" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-sand-deep/40 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="eyebrow text-center">What's inside</p>
          <h2 className="font-display text-3xl md:text-5xl text-center mt-3">Everything your balcony needs.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 max-w-7xl mx-auto px-4 md:px-6">
        <p className="eyebrow text-center">How it works</p>
        <h2 className="font-display text-3xl md:text-5xl text-center mt-3">Three steps to a thriving pot.</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {STEPS.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="font-display text-7xl text-rust/30 leading-none">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-2xl mt-4">{s.title}</h3>
              <p className="text-ink/70 mt-3 max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-deep/40 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="eyebrow text-center">From the community</p>
          <h2 className="font-display text-3xl md:text-5xl text-center mt-3">Loved by gardeners across India.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-warm p-6">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} className="w-12 h-12 rounded-full bg-secondary" alt="" />
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
                <p className="text-ink/80 mt-4 leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">From the community</p>
            <h2 className="font-display text-3xl md:text-5xl mt-3">Join 38,000 gardeners growing in real time.</h2>
            <p className="text-ink/75 mt-4 max-w-md">A feed of real Indian balconies, terraces and window-sills — share wins, get advice, and find people growing what you grow.</p>
            <Link to="/login" className="btn-rust mt-6 inline-flex">Join the community</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SEED_POSTS.slice(0, 6).map((p, i) => (
              <img key={p.id} src={p.image} alt="" className={`rounded-xl object-cover aspect-square ${i === 1 || i === 4 ? "translate-y-4" : ""}`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-dusk text-sand py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-8 h-8 rounded-full bg-rust text-[#fffaf2] items-center justify-center font-display">P</span>
              <span className="font-medium text-lg">PlantNest</span>
            </div>
            <p className="text-sand/70 mt-4 max-w-xs leading-relaxed">A quiet companion for your pots. Built in India, for Indian balconies.</p>
          </div>
          {FOOTER_COLS.map((c) => (
            <div key={c.title}>
              <p className="font-medium text-sand/90">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sand/60 text-sm">
                {c.links.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-6 border-t border-sand/10 text-sand/50 text-xs flex flex-wrap justify-between gap-2">
          <span>© 2026 PlantNest. Made with 🌿 in Mumbai.</span>
          <span>v1.0</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, suffix, label }: { n: number; suffix?: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-rust"><Counter to={n} suffix={suffix} /></p>
      <p className="eyebrow !text-ink/55 mt-1">{label}</p>
    </div>
  );
}

const FEATURES = [
  { icon: Camera, title: "Detect Disease", desc: "Snap a leaf, get a diagnosis in seconds.", tint: "bg-rust-soft/40" },
  { icon: BellRing, title: "Care Reminders", desc: "Watering, feeding and pruning — never missed.", tint: "bg-amber-soft/50" },
  { icon: Store, title: "Local Marketplace", desc: "Verified nurseries, seeds, pots, delivered home.", tint: "bg-sage/30" },
  { icon: MessageCircle, title: "Expert Consults", desc: "Chat or call horticulturists across India.", tint: "bg-indigo-dusk/15" },
];

function FeatureCard({ icon: Icon, title, desc, tint }: any) {
  return (
    <div className="card-warm card-warm-hover p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon className="w-6 h-6 text-rust" />
      </div>
      <h3 className="font-display text-xl mt-4">{title}</h3>
      <p className="text-ink/70 text-sm mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

const STEPS = [
  { title: "Photograph your plant", desc: "Aim, snap, upload. Good light helps." },
  { title: "Get an instant AI diagnosis", desc: "Disease, confidence, treatment — in seconds." },
  { title: "Buy the fix or call an expert", desc: "Pick up the right spray or consult a horticulturist." },
];

const TESTIMONIALS = [
  { name: "Riya Kapoor", city: "Bandra, Mumbai", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya&backgroundColor=f6dba0", quote: "My tulsi died three times before PlantNest. Now I've got a balcony full." },
  { name: "Arjun Verma", city: "Pune", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=e7b9a3", quote: "Caught early blight on my tomatoes the day it started. Saved the whole crop." },
  { name: "Sneha Iyer", city: "Bengaluru", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=f0e8da", quote: "The reminders actually feel friendly, not naggy. My Monstera thanks you." },
];

const FOOTER_COLS = [
  { title: "Product", links: ["Features", "Marketplace", "Experts", "Subscription"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { title: "Support", links: ["Help center", "Contact", "Status", "API"] },
];
