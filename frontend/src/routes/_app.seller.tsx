import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { Counter } from "@/components/ui-brand/primitives";

export const Route = createFileRoute("/_app/seller")({
  component: SellerLayout,
});

function SellerLayout() {
  const role = useApp(s => s.role);
  const pathname = useRouterState({ select: s => s.location.pathname });
  if (role !== "nursery") {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-5xl mb-3">🏪</div>
        <h2 className="font-display text-2xl">Switch to a seller account</h2>
        <p className="text-muted-foreground mt-2 text-sm">The Seller dashboard is for verified nurseries. Sign up as a Nursery Owner to list products.</p>
        <Link to="/subscription" className="btn-rust mt-5 inline-flex">Become a seller →</Link>
      </div>
    );
  }
  const tabs = [
    { to: "/seller", label: "Overview", exact: true },
    { to: "/seller/products", label: "Products" },
    { to: "/seller/orders", label: "Orders" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Seller</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Dashboard</h1>
      </div>
      <nav className="flex gap-2 border-b border-border">
        {tabs.map(t => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <Link key={t.to} to={t.to} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-rust text-rust" : "border-transparent text-muted-foreground"}`}>{t.label}</Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}

export const indexComponent = () => null;
