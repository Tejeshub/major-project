import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_POSTS,
  SEED_PRODUCTS,
  type CommunityPost,
  type Product,
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

export type Reminder = {
  id: string;
  plantId: string;
  task: "Water" | "Fertilize" | "Prune";
  dueAt: string; // ISO
  repeat: "none" | "daily" | "2day" | "weekly";
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
export type Order = {
  id: string;
  items: { product: Product; qty: number }[];
  total: number;
  subtotal: number;
  gst: number;
  delivery: number;
  fee: number;
  status: "Placed" | "Confirmed" | "Shipped" | "Delivered";
  createdAt: string;
  address: { name: string; phone: string; line1: string; line2: string; city: string; pincode: string };
  payment: "UPI" | "Card" | "COD";
};

export type Consultation = {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  specialisation: string;
  slot: string; // e.g. "Mon 10am"
  mode: "Chat" | "Video";
  status: "Pending" | "Confirmed" | "Completed";
  price: number;
  bookedAt: string;
  messages: { id: string; from: "user" | "expert"; text: string; ts: string }[];
  review?: { rating: number; text: string };
};

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
  reminders: Reminder[];
  detections: Detection[];

  // shop
  cart: CartItem[];
  orders: Order[];
  sellerProducts: Product[]; // editable

  // community
  posts: CommunityPost[];

  // consultations
  consultations: Consultation[];

  // settings
  settings: Settings;

  // detection counters
  scanCount: number; // per "month" - reset later
  detectionCycle: number;

  // ui flags
  hideMapPrivacyBanner: boolean;

  // actions
  login: (name: string, email: string, role?: Role) => void;
  logout: () => void;
  setOnboarding: (gardenType: string, plants: string[]) => void;
  addPlant: (p: Omit<UserPlant, "id" | "addedAt">) => void;
  updatePlant: (id: string, patch: Partial<UserPlant>) => void;
  deletePlant: (id: string) => void;
  addReminder: (r: Omit<Reminder, "id">) => void;
  markReminderDone: (id: string) => void;
  addDetection: (d: Omit<Detection, "id" | "ts">) => string;
  // cart
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  // community
  toggleLike: (postId: string) => void;
  addPost: (p: Omit<CommunityPost, "id" | "ts" | "likes" | "comments">) => void;
  addComment: (postId: string, text: string) => void;
  // consultations
  bookConsultation: (c: Omit<Consultation, "id" | "bookedAt" | "status" | "messages">) => void;
  cancelConsultation: (id: string) => void;
  completeConsultation: (id: string) => void;
  sendMessage: (id: string, text: string) => void;
  reviewExpert: (id: string, rating: number, text: string) => void;
  // seller
  addSellerProduct: (p: Omit<Product, "id">) => void;
  updateSellerProduct: (id: string, patch: Partial<Product>) => void;
  deleteSellerProduct: (id: string) => void;
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

// seed initial orders + consultations
const seedOrders = (): Order[] => {
  const now = Date.now();
  return [
    {
      id: "ord-1001",
      items: [{ product: SEED_PRODUCTS[0], qty: 1 }, { product: SEED_PRODUCTS[3], qty: 1 }],
      subtotal: 948, gst: 142, delivery: 49, fee: 20, total: 1159,
      status: "Delivered",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(),
      address: { name: "Demo User", phone: "98xxxx", line1: "12 Sea Breeze", line2: "Bandra", city: "Mumbai", pincode: "400050" },
      payment: "UPI",
    },
    {
      id: "ord-1002",
      items: [{ product: SEED_PRODUCTS[2], qty: 2 }],
      subtotal: 398, gst: 72, delivery: 49, fee: 20, total: 539,
      status: "Shipped",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      address: { name: "Demo User", phone: "98xxxx", line1: "12 Sea Breeze", line2: "Bandra", city: "Mumbai", pincode: "400050" },
      payment: "COD",
    },
    {
      id: "ord-1003",
      items: [{ product: SEED_PRODUCTS[5], qty: 1 }],
      subtotal: 249, gst: 12, delivery: 49, fee: 20, total: 330,
      status: "Placed",
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      address: { name: "Demo User", phone: "98xxxx", line1: "12 Sea Breeze", line2: "Bandra", city: "Mumbai", pincode: "400050" },
      payment: "Card",
    },
  ];
};

const seedConsultations = (): Consultation[] => [
  {
    id: "cn-1", expertId: "e1", expertName: "Anjali Mehta",
    expertAvatar: avatarFor("Anjali"), specialisation: "Ornamental Plants",
    slot: "Thu 4pm", mode: "Chat", status: "Confirmed", price: 299,
    bookedAt: new Date().toISOString(),
    messages: [
      { id: id(), from: "expert", text: "Hi! Looking forward to our session. Could you share photos of your balcony setup?", ts: "2h" },
      { id: id(), from: "user", text: "Sure! Here's my Monstera that's been struggling.", ts: "1h" },
      { id: id(), from: "expert", text: "I can see slight yellowing — let me ask: how often are you watering?", ts: "1h" },
    ],
  },
  {
    id: "cn-2", expertId: "e3", expertName: "Dr. Priya Sharma",
    expertAvatar: avatarFor("Priya"), specialisation: "Vegetables & Herbs",
    slot: "Mon 11am", mode: "Chat", status: "Completed", price: 399,
    bookedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    messages: [],
    review: { rating: 5, text: "Practical, kind, and very knowledgeable. My tomatoes are thriving now." },
  },
];

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      role: "gardener",
      plan: "free",
      gardenType: "",
      selectedPlants: [],
      plants: [],
      reminders: [],
      detections: [],
      cart: [],
      orders: seedOrders(),
      sellerProducts: SEED_PRODUCTS.slice(0, 8).map(p => ({ ...p })),
      posts: SEED_POSTS,
      consultations: seedConsultations(),
      settings: defaultSettings,
      scanCount: 0,
      detectionCycle: 0,
      hideMapPrivacyBanner: false,

      login: (name, email, role = "gardener") =>
        set({ user: { name, email, avatar: avatarFor(name) }, role }),
      logout: () => set({ user: null, plants: [], reminders: [], detections: [], cart: [], selectedPlants: [], gardenType: "", scanCount: 0, plan: "free" }),

      setOnboarding: (gardenType, plants) => {
        const initialPlants: UserPlant[] = plants.map((sp) => ({
          id: id(), species: sp, nickname: sp, gardenType, addedAt: new Date().toISOString(),
        }));
        set({ gardenType, selectedPlants: plants, plants: initialPlants });
      },

      addPlant: (p) => {
        const plant: UserPlant = { ...p, id: id(), addedAt: new Date().toISOString() };
        set({ plants: [...get().plants, plant] });
      },
      updatePlant: (id, patch) => set({ plants: get().plants.map(p => p.id === id ? { ...p, ...patch } : p) }),
      deletePlant: (pid) => set({ plants: get().plants.filter(p => p.id !== pid), reminders: get().reminders.filter(r => r.plantId !== pid) }),

      addReminder: (r) => set({ reminders: [...get().reminders, { ...r, id: id() }] }),
      markReminderDone: (rid) => {
        const r = get().reminders.find(x => x.id === rid);
        if (!r) return;
        const next = new Date();
        const days = r.repeat === "daily" ? 1 : r.repeat === "2day" ? 2 : r.repeat === "weekly" ? 7 : 3;
        next.setDate(next.getDate() + days);
        const updated: Reminder = { ...r, dueAt: next.toISOString() };
        set({ reminders: get().reminders.map(x => x.id === rid ? updated : x) });
      },

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
      placeOrder: (o) => {
        const order: Order = { ...o, id: `ord-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), status: "Placed" };
        set({ orders: [order, ...get().orders], cart: [] });
        return order;
      },
      updateOrderStatus: (oid, status) => set({ orders: get().orders.map(o => o.id === oid ? { ...o, status } : o) }),

      toggleLike: (postId) => set({
        posts: get().posts.map(p => p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p),
      }),
      addPost: (p) => set({ posts: [{ ...p, id: id(), ts: "Just now", likes: 0, comments: [] }, ...get().posts] }),
      addComment: (postId, text) => {
        const u = get().user;
        if (!u) return;
        set({
          posts: get().posts.map(p => p.id === postId
            ? { ...p, comments: [...p.comments, { id: id(), user: u.name, avatar: u.avatar, text, ts: "Just now" }] }
            : p),
        });
      },

      bookConsultation: (c) => set({
        consultations: [{ ...c, id: `cn-${id()}`, bookedAt: new Date().toISOString(), status: "Confirmed", messages: [] }, ...get().consultations],
      }),
      cancelConsultation: (cid) => set({ consultations: get().consultations.filter(c => c.id !== cid) }),
      completeConsultation: (cid) => set({ consultations: get().consultations.map(c => c.id === cid ? { ...c, status: "Completed" } : c) }),
      sendMessage: (cid, text) => set({
        consultations: get().consultations.map(c => c.id === cid
          ? { ...c, messages: [...c.messages, { id: id(), from: "user", text, ts: "Just now" }] }
          : c),
      }),
      reviewExpert: (cid, rating, text) => set({
        consultations: get().consultations.map(c => c.id === cid ? { ...c, status: "Completed", review: { rating, text } } : c),
      }),

      addSellerProduct: (p) => set({ sellerProducts: [...get().sellerProducts, { ...p, id: `sp-${id()}` }] }),
      updateSellerProduct: (pid, patch) => set({ sellerProducts: get().sellerProducts.map(p => p.id === pid ? { ...p, ...patch } : p) }),
      deleteSellerProduct: (pid) => set({ sellerProducts: get().sellerProducts.filter(p => p.id !== pid) }),

      setPlan: (p) => set({ plan: p }),
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      dismissMapPrivacyBanner: () => set({ hideMapPrivacyBanner: true }),
      incrementScanCount: () => set({ scanCount: get().scanCount + 1, detectionCycle: get().detectionCycle + 1 }),
    }),
    { name: "plantnest-app-v1" },
  ),
);

// Aggregate marketplace = seed + seller products (deduped by id)
export const useAllProducts = () => {
  const seller = useApp(s => s.sellerProducts);
  const sellerIds = new Set(seller.map(s => s.id));
  return [...SEED_PRODUCTS.filter(p => !sellerIds.has(p.id)), ...seller];
};

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
