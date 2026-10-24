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

function getPageBackground(pathname: string): { bg: string; title: string } {
  if (pathname.includes("/market")) {
    return { bg: "/assets/ghibli/bg-market.jpg", title: "Botanical Nursery & Market" };
  }
  if (pathname.includes("/community")) {
    return { bg: "/assets/ghibli/bg-community.jpg", title: "Gardener Community & Allotments" };
  }
  if (pathname.includes("/learn")) {
    return { bg: "/assets/ghibli/bg-learn.jpg", title: "Botanical Library & Guides" };
  }
  if (pathname.includes("/experts") || pathname.includes("/consultations")) {
    return { bg: "/assets/ghibli/bg-experts.jpg", title: "Plant Doctor & Horticulturist Workshop" };
  }
  // Default to Balcony Garden backdrop for /dashboard and plants
  return { bg: "/assets/ghibli/bg-plants.jpg", title: "Sunlit Balcony Garden" };
}

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useApp((s) => s.user);
  
  // If we are waiting for OAuth to resolve, show a loading state instead of a blank screen
  if (!user && typeof window !== "undefined" && window.location.hash.includes("access_token")) {
    return <div className="min-h-screen flex items-center justify-center">Loading your profile...</div>;
  }
  
  if (!user) return null;

  const currentTheme = getPageBackground(pathname);

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative overflow-x-hidden bg-cream-bg">
      {/* Dynamic Bright Themed Studio Ghibli Scenic Backdrop */}
      <div
        key={currentTheme.bg}
        className="fixed inset-0 bg-cover bg-center pointer-events-none transition-all duration-700 ease-in-out opacity-45 sm:opacity-55 scale-100"
        style={{ backgroundImage: `url('${currentTheme.bg}')` }}
        aria-hidden="true"
      />

      {/* Warm semi-translucent watercolor wash to ensure high contrast & crisp text legibility */}
      <div 
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-cream-bg/60 via-cream-bg/75 to-cream-bg/90 backdrop-blur-[0.5px]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <MobileTabs />
      </div>
    </div>
  );
}
