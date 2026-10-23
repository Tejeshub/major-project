import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo, HeroPot } from "@/components/ui-brand/Logo";
import { Counter } from "@/components/ui-brand/primitives";
import { useRef } from "react";
import { Camera, BellRing, Store, MessageCircle, Leaf } from "lucide-react";
import { useApp } from "@/stores/app";
import { usePosts } from "@/hooks/useCommunity";

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
  const { data: posts = [] } = usePosts({ limit: 6 });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-cream-bg/90 backdrop-blur-md border-b border-sage-border/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-forest-muted hover:text-forest-dark transition-colors">Features</a>
            <a href="#how" className="text-forest-muted hover:text-forest-dark transition-colors">How it works</a>
            <Link to="/learn" className="text-forest-muted hover:text-forest-dark transition-colors">Learn</Link>
            <Link to="/experts" className="text-forest-muted hover:text-forest-dark transition-colors">Experts</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-forest-muted hover:text-forest-dark hidden sm:inline transition-colors">Sign in</Link>
            <Link to="/login" className="btn-rust !py-2 !px-4 text-sm">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero with Ghibli Meadow Atmospheric Backdrop */}
      <section ref={heroRef} className="relative overflow-hidden pt-12 md:pt-20 pb-20 md:pb-32">
        {/* Scenic Ghibli Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 md:opacity-45 scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: "url('/assets/ghibli/ghibli-garden-landscape.jpg')" }}
          aria-hidden="true"
        />
        {/* Soft Watercolor Mist Gradient Overlay ensuring 100% text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-bg/85 via-cream-bg/92 to-cream-bg pointer-events-none" aria-hidden="true" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="chip !bg-cream-elevated/95 !border-sage-border text-forest-dark font-medium !px-3.5 !py-1 shadow-warm-sm backdrop-blur-sm">🌿 Built for Indian balconies, not farms</span>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.03] mt-6 tracking-tight">
              <span className="text-forest-dark font-bold">Grow plants,</span><br />
              <span className="italic font-normal text-terracotta">not stress.</span>
            </h1>
            <p className="text-forest-muted text-lg md:text-xl mt-6 max-w-md leading-relaxed font-normal">
              PlantNest is a quiet companion for your pots — AI disease checks, weather-aware reminders, a real nursery marketplace, and experts a tap away.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/login" className="btn-rust text-base">Start free →</Link>
              <a href="#how" className="btn-ghost-border text-base bg-cream-elevated/70 backdrop-blur-sm">See how it works</a>
            </div>
            <div className="flex flex-wrap gap-8 md:gap-12 mt-12 pt-8 border-t border-sage-border/70">
              <Stat n={38000} suffix="+" label="Plants tracked" />
              <Stat n={92} suffix="%" label="Diagnosis accuracy" />
              <Stat n={240} suffix="+" label="Nurseries onboard" />
            </div>
          </div>
          <motion.div style={{ y: potY }}>
            <HeroPot className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Features with Soft Wavy Divider and Sunrise Backdrop */}
      <section id="features" className="relative py-24 bg-sand-deep/75 border-y border-sage-border/60 overflow-hidden">
        {/* Subtle Atmospheric Sky Scenery */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('/assets/ghibli/sky-mist-clean.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <p className="eyebrow text-center">What's inside</p>
          <h2 className="font-display text-3xl md:text-5xl text-center mt-3 text-forest-dark font-bold">Everything your balcony needs.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works with Handcrafted Step Parchments */}
      <section id="how" className="py-28 max-w-7xl mx-auto px-4 md:px-6 relative">
        <p className="eyebrow text-center">How it works</p>
        <h2 className="font-display text-3xl md:text-5xl text-center mt-3 text-forest-dark font-bold">Three steps to a thriving pot.</h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mt-16">
          {STEPS.map((s, i) => (
            <div key={s.title} className="text-center bg-[#FAF7F2]/85 backdrop-blur-md border border-[#E4DEC9] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(43,62,43,0.08)] hover:-translate-y-1.5 transition-all duration-300 group">
              {/* Sun-faded terracotta step watermark */}
              <div className="font-serif text-8xl font-bold text-[#D97746]/20 leading-none select-none absolute top-3 right-5 group-hover:text-[#D97746]/35 transition-colors">{String(i + 1).padStart(2, "0")}</div>
              <div className="relative z-10 pt-4">
                <h3 className="font-display text-2xl font-bold text-forest-dark mt-2">{s.title}</h3>
                <p className="text-forest-muted mt-3 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials with Warm Cottagecore Glow */}
      <section className="relative py-24 bg-sand-deep/60 border-y border-sage-border/60 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('/assets/ghibli/botanical-greenery-clean.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <p className="eyebrow text-center">From the community</p>
          <h2 className="font-display text-3xl md:text-5xl text-center mt-3 text-forest-dark font-bold">Loved by gardeners across India.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E4DEC9] rounded-3xl p-7 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3.5">
                  <img src={t.avatar} className="w-12 h-12 rounded-full bg-sand-deep border border-sage-border/80 shadow-warm-sm" alt="" />
                  <div>
                    <p className="font-semibold text-forest-dark">{t.name}</p>
                    <p className="text-xs text-forest-muted">{t.city}</p>
                  </div>
                </div>
                <p className="text-forest-dark/85 mt-4 leading-relaxed font-serif italic text-base">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community preview with lush botanical ambiance */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">From the community</p>
            <h2 className="font-display text-3xl md:text-5xl mt-3 text-forest-dark font-bold">Join 38,000 gardeners growing in real time.</h2>
            <p className="text-forest-muted mt-4 max-w-md text-base leading-relaxed">A feed of real Indian balconies, terraces and window-sills — share wins, get advice, and find people growing what you grow.</p>
            <Link to="/login" className="btn-rust mt-6 inline-flex text-base">Join the community</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {posts.slice(0, 6).map((p, i) => (
              <img key={p.id} src={p.image} alt="" className={`rounded-2xl border border-sage-border/70 shadow-warm-sm object-cover aspect-square ${i === 1 || i === 4 ? "translate-y-4" : ""}`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-dark text-cream-bg py-16 border-t border-forest-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex w-8 h-8 rounded-full bg-terracotta text-cream-bg items-center justify-center font-display font-semibold">P</span>
              <span className="font-display font-bold text-xl text-cream-bg tracking-tight">PlantNest</span>
            </div>
            <p className="text-cream-bg/70 mt-4 max-w-xs leading-relaxed text-sm">A quiet companion for your pots. Built in India, for Indian balconies.</p>
          </div>
          {FOOTER_COLS.map((c) => (
            <div key={c.title}>
              <p className="font-semibold text-cream-bg/90 tracking-wide text-sm">{c.title}</p>
              <ul className="mt-3.5 space-y-2.5 text-cream-bg/60 text-sm">
                {c.links.map((l) => <li key={l} className="hover:text-cream-bg transition-colors cursor-pointer">{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-6 border-t border-cream-bg/10 text-cream-bg/50 text-xs flex flex-wrap justify-between gap-2">
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
      <p className="font-display text-3xl md:text-4xl font-bold text-terracotta"><Counter to={n} suffix={suffix} /></p>
      <p className="eyebrow !text-forest-muted mt-1.5">{label}</p>
    </div>
  );
}

const FEATURES = [
  { icon: Camera, title: "Detect Disease", desc: "Snap a leaf, get a diagnosis in seconds.", tint: "bg-[#E9F0E8] text-[#2D5A3A] border border-[#2D5A3A]/20" },
  { icon: BellRing, title: "Care Reminders", desc: "Watering, feeding and pruning — never missed.", tint: "bg-[#FDF2E9] text-[#C85A32] border border-[#C85A32]/20" },
  { icon: Store, title: "Local Marketplace", desc: "Verified nurseries, seeds, pots, delivered home.", tint: "bg-[#EAF2ED] text-[#244833] border border-[#244833]/20" },
  { icon: MessageCircle, title: "Expert Consults", desc: "Chat or call horticulturists across India.", tint: "bg-[#F5EFE6] text-[#4A584D] border border-[#4A584D]/20" },
];

function FeatureCard({ icon: Icon, title, desc, tint }: any) {
  return (
    <div className="bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E4DEC9] rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(43,62,43,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className={`w-13 h-13 rounded-2xl flex items-center justify-center ${tint} shadow-warm-sm`}>
          <Icon className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h3 className="font-display font-bold text-xl mt-5 text-forest-dark">{title}</h3>
        <p className="text-forest-muted text-sm mt-2 leading-relaxed">{desc}</p>
      </div>
      <div className="mt-5 pt-3 border-t border-sage-border/50 flex items-center gap-1.5 text-xs font-semibold text-terracotta">
        <span>Explore</span>
        <span>→</span>
      </div>
    </div>
  );
}

const STEPS = [
  { title: "Photograph your plant", desc: "Aim, snap, upload. Good natural light helps." },
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
