import { createFileRoute } from "@tanstack/react-router";
import { useApp, type Plan } from "@/stores/app";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/subscription")({
  head: () => ({ meta: [{ title: "Subscription — PlantNest" }] }),
  component: Subscription,
});

type PlanDef = {
  id: Plan;
  name: string;
  sub: string;
  monthly: number;
  annual: number;
  popular?: boolean;
  yes: string[];
  no?: string[];
  cta: string;
};

const PLANS: PlanDef[] = [
  {
    id: "free", name: "Free", sub: "For casual plant lovers", monthly: 0, annual: 0,
    yes: ["AI Disease Detection — 5 scans/month", "My Plants — up to 3 plants", "Care Reminders — up to 3 active", "Community Feed access", "Garden Map — view only", "Marketplace — browse & buy", "Basic Weather Advisory", "Education Hub — 5 guides/month"],
    no: ["Unlimited AI Disease Scans", "Disease History Export", "Expert Consultations", "Priority Support", "Ad-free Experience", "Premium Community Features"],
    cta: "Get started free",
  },
  {
    id: "premium", name: "Premium", sub: "For serious urban gardeners", monthly: 199, annual: 159, popular: true,
    yes: ["Everything in Free", "Unlimited AI Disease Scans", "Unlimited plants", "Unlimited reminders", "Disease History Export (PDF)", "Expert Consultations — 5/month", "Full Weather Reports + 6-day forecast", "Priority Support (24hr)", "Ad-free Experience", "Community Creator Badge", "Nearby Gardeners Map — full mode", "Unlimited Education Guides"],
    no: ["Unlimited Expert Consultations", "Advanced Analytics Dashboard", "Custom AI Care Schedule", "Seller Features"],
    cta: "Upgrade to Premium →",
  },
  {
    id: "pro", name: "Pro", sub: "For plant obsessives & power users", monthly: 499, annual: 399,
    yes: ["Everything in Premium", "Unlimited Expert Consultations", "Advanced Analytics Dashboard", "AI Custom Care Schedule", "Multi-device sync", "Gold Creator Badge", "Early access to features"],
    cta: "Upgrade to Pro →",
  },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes — upgrades take effect immediately, downgrades at your next billing date." },
  { q: "Is there a free trial for Premium?", a: "Premium and Pro plans come with a 7-day money-back guarantee." },
  { q: "What happens to my data if I downgrade?", a: "Your plants and reminders stay. Some features will be capped to Free limits." },
  { q: "How does the AI scan limit work on the Free plan?", a: "You get 5 scans per calendar month, resetting on the 1st." },
  { q: "Are expert consultations included in all plans?", a: "Premium includes 5/month, Pro includes unlimited. Free plan can book pay-per-session." },
  { q: "How do I cancel my subscription?", a: "Visit Profile → Manage plan → Cancel. Access continues until period end." },
];

function Subscription() {
  const plan = useApp(s => s.plan);
  const setPlan = useApp(s => s.setPlan);
  const [annual, setAnnual] = useState(false);
  const [pay, setPay] = useState<Plan | null>(null);
  const [card, setCard] = useState("");

  const confirmPay = () => { if (!pay) return; setPlan(pay); toast.success("Welcome to " + pay + " 🌿"); setPay(null); };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <p className="eyebrow">Subscription</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Choose your PlantNest plan</h1>
        <p className="text-muted-foreground mt-2">Start free. Upgrade when your garden needs more.</p>
        <div className="inline-flex bg-secondary rounded-full p-1 mt-6">
          <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm ${!annual ? "bg-card shadow-warm" : ""}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm flex items-center gap-2 ${annual ? "bg-card shadow-warm" : ""}`}>Annual <span className="chip !bg-amber-soft text-ink !text-[10px] !py-0">Save 20%</span></button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-stretch">
        {PLANS.map(p => {
          const price = annual ? p.annual : p.monthly;
          const current = plan === p.id;
          return (
            <div key={p.id} className={`card-warm p-6 flex flex-col relative ${p.popular ? "ring-2 ring-rust md:scale-105 z-10" : ""}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip !bg-amber-brand text-ink !font-semibold">Most popular</span>}
              {current && <span className="absolute top-3 right-3 chip !bg-amber-soft text-ink !text-[10px]">Your plan</span>}
              <h3 className="font-display text-2xl">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.sub}</p>
              <p className="font-display text-4xl text-rust mt-4">₹{price}<span className="text-base text-muted-foreground">/mo</span></p>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {p.yes.map(f => <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-sage shrink-0 mt-0.5" /> {f}</li>)}
                {p.no?.map(f => <li key={f} className="flex gap-2 text-muted-foreground"><X className="w-4 h-4 shrink-0 mt-0.5" /> {f}</li>)}
              </ul>
              {current ? (
                <button className="mt-5 py-3 px-4 rounded-full bg-secondary text-ink/60 font-medium">Current plan</button>
              ) : p.id === "free" ? (
                <button onClick={() => setPlan("free")} className="btn-ghost-border w-full mt-5">{p.cta}</button>
              ) : (
                <button onClick={() => setPay(p.id)} className="btn-rust w-full mt-5">{p.cta}</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Seller plan */}
      <div className="bg-indigo-dusk text-sand rounded-2xl p-8 grid md:grid-cols-2 gap-6 items-center shadow-warm-lg">
        <div>
          <p className="eyebrow !text-amber-brand">For nurseries</p>
          <h3 className="font-display text-3xl mt-2">Seller — ₹999/mo</h3>
          <p className="text-sand/80 mt-1">For nursery owners ready to grow online.</p>
          <ul className="mt-5 space-y-2 text-sm">
            {["Unlimited product listings", "Seller Dashboard + Analytics", "Promoted listing placement", "Chat with buyers", "Multi-store management", "GST billing integration", "Featured pin on Garden Map"].map(f => (
              <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-amber-brand shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <button onClick={() => setPay("seller")} className="btn-amber w-full md:w-auto">Become a seller partner →</button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Frequently asked</h2>
        <div className="space-y-2">
          {FAQ.map(f => (
            <details key={f.q} className="card-warm p-4 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between">{f.q} <span className="text-rust group-open:rotate-45 transition">+</span></summary>
              <p className="text-sm text-ink/75 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {pay && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setPay(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl">Confirm upgrade</h3>
            <p className="text-sm text-muted-foreground mt-1">Plan: <span className="font-medium text-ink">{pay}</span> · Sandbox payment.</p>
            <input className="input-warm mt-4" placeholder="Card number" value={card} onChange={e => setCard(e.target.value)} />
            <button onClick={confirmPay} className="btn-rust w-full mt-4">Confirm upgrade</button>
          </div>
        </div>
      )}
    </div>
  );
}
