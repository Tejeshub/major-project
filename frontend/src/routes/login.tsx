import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/stores/app";
import { Logo } from "@/components/ui-brand/Logo";
import { Eye, EyeOff, Sprout, Store, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — PlantNest" }, { name: "description", content: "Sign in to grow with PlantNest." }] }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "gardener" as "gardener" | "nursery" | "expert", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const login = useApp((s) => s.login);
  const plants = useApp((s) => s.plants);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (tab === "signup" && !form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = "Enter a valid email";
    if (!form.password) err.password = "Password is required";
    if (tab === "signup" && !form.terms) err.terms = "Please accept the terms";
    setErrors(err);
    if (Object.keys(err).length) return;

    const name = tab === "signup" ? form.name : form.email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase());
    login(name, form.email, form.role);
    toast.success(tab === "signup" ? "Account created 🌿" : "Welcome back");
    navigate({ to: tab === "signup" || plants.length === 0 ? "/onboarding" : "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-5"><Logo /></div>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="card-warm w-full max-w-md p-8">
          <div className="flex bg-secondary rounded-full p-1 mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${tab === t ? "bg-card text-ink shadow-warm" : "text-ink/60"}`}>
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
            <Field label="Email" error={errors.email}>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-warm" placeholder="you@example.com" />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-warm pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {tab === "signin" && <a className="text-xs text-rust hover:underline">Forgot password?</a>}

            {tab === "signup" && (
              <div>
                <p className="text-sm font-medium text-ink mb-2">I'm a...</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: "gardener", l: "Gardener", icon: Sprout },
                    { v: "nursery", l: "Nursery", icon: Store },
                    { v: "expert", l: "Expert", icon: MessageCircle },
                  ] as const).map(({ v, l, icon: Icon }) => (
                    <button type="button" key={v} onClick={() => setForm({ ...form, role: v })}
                      className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-1.5 ${form.role === v ? "border-rust bg-rust-soft/20" : "border-border bg-card"}`}>
                      <Icon className="w-5 h-5 text-rust" />
                      <span className="text-xs font-medium">{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "signup" && (
              <label className="flex items-start gap-2 text-xs text-ink/70">
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 accent-rust" />
                <span>I agree to the Terms and Privacy Policy.</span>
              </label>
            )}
            {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

            <button type="submit" className="btn-rust w-full">{tab === "signin" ? "Sign in" : "Create account"}</button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button type="button" onClick={() => { login("Demo User", "demo@plantnest.in"); toast.success("Signed in with Google"); navigate({ to: plants.length ? "/dashboard" : "/onboarding" }); }} className="w-full py-2.5 rounded-full border border-border bg-card flex items-center justify-center gap-2 text-sm font-medium hover:bg-secondary transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-ink">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
