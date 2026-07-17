import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  type CommunityPost,
} from "@/data/seed";

export type Plan = "free" | "premium" | "pro" | "seller";
export type Role = "gardener" | "nursery" | "expert";

export type UserPlant = {
  id: string;
  species: string;
  nickname: string;
  gardenType: string;
  addedAt: string;
  photo?: string;
};



export type Detection = {
  id: string;
  plantId?: string;
  plantName?: string;
  photo: string;
  diseaseName: string;
  confidence: number;
  symptoms: string;
  treatment: string[];
  crossSellId?: string;
  ts: string;
  lowConfidence?: boolean;
};

export type CartItem = { productId: string; qty: number };

export type Settings = {
  notifications: {
    watering: boolean;
    disease: boolean;
    community: boolean;
    expertAvailability: boolean;
    orders: boolean;
    weather: boolean;
  };
  privacy: {
    locationSharing: boolean;
    profileVisibility: "public" | "friends" | "private";
    activityVisibility: boolean;
  };
  map: {
    showAvatar: boolean;
    showPlantCount: boolean;
  };
};

type AppState = {
  // auth
  user: { name: string; email: string; avatar: string } | null;
  role: Role;
  plan: Plan;

  // onboarding
  gardenType: string;
  selectedPlants: string[]; // species list

  // data
  plants: UserPlant[];

  detections: Detection[];

  // shop
  cart: CartItem[];


  // settings
  settings: Settings;

  // detection counters
  scanCount: number; // per "month" - reset later
  detectionCycle: number;

  // ui flags
  hideMapPrivacyBanner: boolean;

  // actions
  login: (name: string, email: string, role?: Role) => void;
  syncUserWithBackend: () => Promise<void>;
  fetchPlants: () => Promise<void>;
  logout: () => void;
  setOnboarding: (gardenType: string, plants: string[]) => void;
  addPlant: (p: Omit<UserPlant, "id" | "addedAt">) => Promise<void>;
  updatePlant: (id: string, patch: Partial<UserPlant>) => Promise<void>;
  deletePlant: (id: string) => void;

  addDetection: (d: Omit<Detection, "id" | "ts">) => string;
  // cart
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // subscription
  setPlan: (p: Plan) => void;
  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  dismissMapPrivacyBanner: () => void;
  incrementScanCount: () => void;
};

const avatarFor = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f6dba0,e7b9a3`;

const id = () => Math.random().toString(36).slice(2, 10);

const defaultSettings: Settings = {
  notifications: { watering: true, disease: true, community: true, expertAvailability: false, orders: true, weather: true },
  privacy: { locationSharing: false, profileVisibility: "public", activityVisibility: true },
  map: { showAvatar: true, showPlantCount: true },
};



export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      role: "gardener",
      plan: "free",
      gardenType: "",
      selectedPlants: [],
      plants: [],

      detections: [],
      cart: [],


      settings: defaultSettings,
      scanCount: 0,
      detectionCycle: 0,
      hideMapPrivacyBanner: false,

      login: (name, email, role = "gardener") =>
        set({ user: { name, email, avatar: avatarFor(name) }, role }),
      syncUserWithBackend: async () => {
        try {
          const { fetchWithAuth } = await import("@/lib/apiClient");
          const userData = await fetchWithAuth("/auth/me");
          if (userData) {
            const name = userData.email.split("@")[0];
            set({ 
              user: { name, email: userData.email, avatar: avatarFor(name) }, 
              role: userData.role 
            });
            await get().fetchPlants();
          }
        } catch (e: any) {
          console.error("Failed to sync user with backend", e);
          toast.error(`Backend Error: ${e.message || "Could not connect to API"}`);
        }
      },
      fetchPlants: async () => {
        try {
          const { fetchWithAuth } = await import("@/lib/apiClient");
          const response = await fetchWithAuth("/plants");
          if (response && response.items) {
            const mappedPlants = response.items.map((p: any) => ({
              id: String(p.id),
              species: p.species,
              nickname: p.nickname || p.species,
              gardenType: p.location_type,
              addedAt: p.created_at
            }));
            set({ plants: mappedPlants });
          }
        } catch (e) {
          console.error("Failed to fetch plants", e);
        }
      },
      logout: () => {
        import("@/lib/supabase").then(({ supabase }) => supabase.auth.signOut());
        set({ user: null, plants: [], detections: [], cart: [], selectedPlants: [], gardenType: "", scanCount: 0, plan: "free" });
      },

      setOnboarding: (gardenType, plants) => {
        const initialPlants: UserPlant[] = plants.map((sp) => ({
          id: id(), species: sp, nickname: sp, gardenType, addedAt: new Date().toISOString(),
        }));
        set({ gardenType, selectedPlants: plants, plants: initialPlants });
      },

      addPlant: async (p) => {
        try {
          const { fetchWithAuth } = await import("@/lib/apiClient");
          const created = await fetchWithAuth("/plants", {
            method: "POST",
            body: JSON.stringify({ species: p.species, nickname: p.nickname, location_type: p.gardenType })
          });
          const newPlant = {
            id: String(created.id),
            species: created.species,
            nickname: created.nickname || created.species,
            gardenType: created.location_type,
            addedAt: created.created_at
          };
          set({ plants: [...get().plants, newPlant] });
        } catch (e) {
          console.error("Failed to add plant", e);
          throw e;
        }
      },
      updatePlant: async (id, patch) => {
        try {
          const { fetchWithAuth } = await import("@/lib/apiClient");
          const payload: any = {};
          if (patch.species !== undefined) payload.species = patch.species;
          if (patch.nickname !== undefined) payload.nickname = patch.nickname;
          if (patch.gardenType !== undefined) payload.location_type = patch.gardenType;
          
          const updated = await fetchWithAuth(`/plants/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
          const mappedUpdate = {
            species: updated.species,
            nickname: updated.nickname || updated.species,
            gardenType: updated.location_type,
          };
          set({ plants: get().plants.map(p => String(p.id) === String(id) ? { ...p, ...mappedUpdate } : p) });
        } catch (e) {
          console.error("Failed to update plant", e);
          throw e;
        }
      },
      deletePlant: (pid) => set({ plants: get().plants.filter(p => p.id !== pid) }),



      addDetection: (d) => {
        const det: Detection = { ...d, id: id(), ts: new Date().toISOString() };
        set({ detections: [det, ...get().detections] });
        return det.id;
      },

      addToCart: (productId, qty = 1) => {
        const existing = get().cart.find(c => c.productId === productId);
        if (existing) {
          set({ cart: get().cart.map(c => c.productId === productId ? { ...c, qty: c.qty + qty } : c) });
        } else {
          set({ cart: [...get().cart, { productId, qty }] });
        }
      },
      setCartQty: (productId, qty) => {
        if (qty <= 0) { get().removeFromCart(productId); return; }
        set({ cart: get().cart.map(c => c.productId === productId ? { ...c, qty } : c) });
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter(c => c.productId !== productId) }),
      clearCart: () => set({ cart: [] }),

      setPlan: (p) => set({ plan: p }),
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      dismissMapPrivacyBanner: () => set({ hideMapPrivacyBanner: true }),
      incrementScanCount: () => set({ scanCount: get().scanCount + 1, detectionCycle: get().detectionCycle + 1 }),
    }),
    { name: "plantnest-app-v1" },
  ),
);

// Feature gates
export const useGates = () => {
  const plan = useApp(s => s.plan);
  const plants = useApp(s => s.plants);
  const scanCount = useApp(s => s.scanCount);
  return {
    canScan: plan !== "free" || scanCount < 5,
    canAddPlant: plan !== "free" || plants.length < 3,
    canBookExpert: plan !== "free",
    scanRemaining: plan === "free" ? Math.max(0, 5 - scanCount) : Infinity,
  };
};
