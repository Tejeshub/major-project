import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/stores/app";
import { Logo } from "@/components/ui-brand/Logo";
import { Eye, EyeOff, Sprout, Store, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — PlantNest" }, { name: "description", content: "Sign in to grow with PlantNest." }] }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "gardener" as "gardener" | "nursery" | "expert", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useApp((s) => s.login);
  const syncUserWithBackend = useApp((s) => s.syncUserWithBackend);
  const plants = useApp((s) => s.plants);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (tab === "signup" && !form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = "Enter a valid email";
    if (!form.password) err.password = "Password is required";
    if (tab === "signup" && !form.terms) err.terms = "Please accept the terms";
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    let authError = null;

    // Temporary bypass for local development without real Supabase project
    if (import.meta.env.VITE_SUPABASE_URL?.includes("mockurl")) {
      login(form.name || form.email.split("@")[0], form.email, form.role as any);
      setLoading(false);
      toast.success(tab === "signup" ? "Account created 🌿" : "Welcome back");
      navigate({ to: tab === "signup" || plants.length === 0 ? "/onboarding" : "/dashboard" });
      return;
    }

    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, role: form.role }
        }
      });
      authError = error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
      authError = error;
    }

    setLoading(false);

    if (authError) {
      toast.error(authError.message);
      return;
    }

    await syncUserWithBackend();
    toast.success(tab === "signup" ? "Account created 🌿" : "Welcome back");
    navigate({ to: tab === "signup" || plants.length === 0 ? "/onboarding" : "/dashboard" });
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-cream-bg overflow-hidden">
      {/* Soft scenic backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55 pointer-events-none"
        style={{ backgroundImage: "url('/assets/ghibli/bg-plants.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-radial from-cream-bg/40 via-cream-bg/70 to-cream-bg/90 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 px-6 py-5"><Logo /></div>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-sage-border bg-cream-surface/90 backdrop-blur-md shadow-[0_12px_40px_rgba(26,40,31,0.08)]">
          <div className="flex bg-sand-deep border border-sage-border/80 rounded-full p-1 mb-8">
            {(["signin", "signup"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${tab === t ? "bg-cream-elevated text-forest-dark shadow-warm-sm border border-sage-border/40" : "text-forest-muted hover:text-forest-dark"}`}>
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === "signup" && (
              <Field label="Full name" error={errors.name}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-warm" placeholder="Riya Kapoor" />
              </Field>
            )}
            <Field label="Email address" error={errors.email}>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-warm" placeholder="you@example.com" />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-warm pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-muted hover:text-forest-dark transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                </button>
              </div>
            </Field>

            {tab === "signin" && <a className="text-xs text-terracotta hover:underline font-medium cursor-pointer">Forgot password?</a>}

            {tab === "signup" && (
              <div>
                <p className="text-sm font-medium text-forest-dark mb-2">I am a...</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {([
                    { v: "gardener", l: "Gardener", icon: Sprout },
                    { v: "nursery", l: "Nursery", icon: Store },
                    { v: "expert", l: "Expert", icon: MessageCircle },
                  ] as const).map(({ v, l, icon: Icon }) => (
                    <button type="button" key={v} onClick={() => setForm({ ...form, role: v })}
                      className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1.5 ${form.role === v ? "border-terracotta bg-terracotta/10 text-terracotta font-semibold" : "border-sage-border bg-cream-elevated text-forest-muted hover:border-forest-dark/30 hover:text-forest-dark"}`}>
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                      <span className="text-xs font-medium">{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "signup" && (
              <label className="flex items-start gap-2 text-xs text-forest-muted cursor-pointer">
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 accent-terracotta rounded" />
                <span>I agree to the Terms and Privacy Policy.</span>
              </label>
            )}
            {errors.terms && <p className="text-xs text-destructive font-medium">{errors.terms}</p>}

            <button type="submit" disabled={loading} className="btn-rust w-full py-3 text-base font-semibold mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {tab === "signin" ? "Sign in" : "Create account"}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sage-border" /></div>
              <span className="relative bg-cream-surface px-3 text-xs text-forest-muted uppercase tracking-wider font-medium">or</span>
            </div>

            <button type="button" onClick={handleGoogleLogin} className="w-full py-2.5 px-4 rounded-xl border border-sage-border bg-cream-elevated hover:bg-sand-deep text-forest-dark text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-warm-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-xs text-forest-muted mt-6">
            <Link to="/" className="hover:text-forest-dark transition-colors font-medium">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-forest-dark mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
    </div>
  );
}
