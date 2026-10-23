import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/stores/app";

import appCss from "../styles.css?url";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 text-5xl font-display text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This page doesn't exist — try heading back to your garden.</p>
        <Link to="/" className="btn-rust mt-6 inline-flex">Go home</Link>
      </div>
    </div>
  );
}

function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="btn-rust mt-6">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PlantNest — Grow plants, not stress." },
      { name: "description", content: "A quiet companion for your pots. AI disease checks, weather-aware reminders, a real nursery marketplace, and experts a tap away." },
      { property: "og:title", content: "PlantNest — Grow plants, not stress." },
      { property: "og:description", content: "Built for Indian balconies, not farms." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=", crossOrigin: "" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="relative min-h-screen bg-cream-bg text-forest-dark antialiased selection:bg-terracotta/20 selection:text-terracotta">
        {/* Subtle Japanese watercolor paper texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.14] mix-blend-multiply bg-repeat"
          style={{ backgroundImage: "url('/assets/ghibli/paper-texture.jpg')", backgroundSize: "320px 320px" }}
          aria-hidden="true"
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const syncUserWithBackend = useApp(s => s.syncUserWithBackend);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        await syncUserWithBackend();
        const state = useApp.getState();
        if (state.user) {
          if (state.plants.length === 0) {
            router.navigate({ to: "/onboarding" });
          } else {
            router.navigate({ to: "/dashboard" });
          }
        } else {
          router.navigate({ to: "/login" });
        }
      } else if (event === "SIGNED_OUT") {
        router.navigate({ to: "/login" });
      }
    });
    return () => { subscription.unsubscribe(); };
  }, [syncUserWithBackend, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
