import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { TopNav, MobileTabs } from "@/components/layout/Nav";
import { useApp } from "@/stores/app";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("access_token")) return;
    const raw = localStorage.getItem("plantnest-app-v1");
    if (!raw) throw redirect({ to: "/login" });
    try {
      const parsed = JSON.parse(raw);
      if (!parsed?.state?.user) throw redirect({ to: "/login" });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useApp((s) => s.user);
  
  // If we are waiting for OAuth to resolve, show a loading state instead of a blank screen
  if (!user && window.location.hash.includes("access_token")) {
    return <div className="min-h-screen flex items-center justify-center">Loading your profile...</div>;
  }
  
  if (!user) return null;
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <TopNav />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <MobileTabs />
    </div>
  );
}
