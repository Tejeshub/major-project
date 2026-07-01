// Seed data for PlantNest — Indian context
export const PLANT_OPTIONS = [
  "Monstera", "Tulsi", "Money Plant", "Aloe Vera", "Tomato", "Rose",
  "Jasmine", "Marigold", "Snake Plant", "Pothos", "Peace Lily",
  "Fiddle Leaf Fig", "Chilli", "Mint", "Coriander", "Hibiscus",
  "Bougainvillea", "Bamboo", "Fern", "Succulent",
];

export const PLANT_EMOJI: Record<string, string> = {
  Monstera: "🌿", Tulsi: "🌱", "Money Plant": "🪴", "Aloe Vera": "🌵",
  Tomato: "🍅", Rose: "🌹", Jasmine: "🌼", Marigold: "🌻",
  "Snake Plant": "🐍", Pothos: "🌿", "Peace Lily: ": "🌸",
  "Fiddle Leaf Fig": "🌳", Chilli: "🌶️", Mint: "🌿",
  Coriander: "🌿", Hibiscus: "🌺", Bougainvillea: "🌸",
  Bamboo: "🎋", Fern: "🌿", Succulent: "🪴",
};

const plantImg = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const PLANT_PHOTOS: Record<string, string> = {
  Monstera: plantImg("photo-1614594975525-e45190c55d0b"),
  Tulsi: plantImg("photo-1591958911259-bee2173bdccc"),
  "Money Plant": plantImg("photo-1604762524889-3e2fcc145683"),
  "Aloe Vera": plantImg("photo-1509423350716-97f9360b4e09"),
  Tomato: plantImg("photo-1592841200221-a6898f307baa"),
  Rose: plantImg("photo-1496062031456-07b8f162a322"),
  Jasmine: plantImg("photo-1591389703635-e15a07b842d7"),
  Marigold: plantImg("photo-1597848212624-a19eb35e2651"),
  "Snake Plant": plantImg("photo-1599598425947-5b3afa9d8e0a"),
  Pothos: plantImg("photo-1632207691143-643e2a9a9361"),
  "Peace Lily": plantImg("photo-1593482892290-f54927ae1bb6"),
  "Fiddle Leaf Fig": plantImg("photo-1597055181449-b34a48f4e94c"),
  Chilli: plantImg("photo-1583119022894-919a68a3d0e3"),
  Mint: plantImg("photo-1628557044797-f21a177c37ec"),
  Coriander: plantImg("photo-1599909533730-1f7c7c54f4a9"),
  Hibiscus: plantImg("photo-1597954635129-92ae1e60c5fa"),
  Bougainvillea: plantImg("photo-1599022542942-7d139d7d1cb6"),
  Bamboo: plantImg("photo-1545241047-6083a3684587"),
  Fern: plantImg("photo-1545239351-cefa43af60f3"),
  Succulent: plantImg("photo-1459411552884-841db9b3cc2a"),
};

export type Product = {
  id: string;
  name: string;
  category: "Plants" | "Seeds" | "Fertilizers" | "Pots" | "Tools";
  price: number;
  gstRate: number;
  seller: string;
  verified: boolean;
  stock: number;
  rating: number;
  image: string;
  description: string;
};

export const SEED_PRODUCTS: Product[] = [
  { id: "p1", name: "Monstera Deliciosa (medium)", category: "Plants", price: 349, gstRate: 5, seller: "Prabhat Nursery", verified: true, stock: 12, rating: 4.6, image: PLANT_PHOTOS.Monstera, description: "Lush split-leaf monstera, perfect for bright indoor spots. Grown in our Dadar greenhouse." },
  { id: "p2", name: "Tulsi (Holy Basil) Sapling", category: "Plants", price: 89, gstRate: 0, seller: "Green Roots", verified: true, stock: 40, rating: 4.8, image: PLANT_PHOTOS.Tulsi, description: "Sacred Tulsi plant — easy to care for, thrives in Indian sun." },
  { id: "p3", name: "Neem Oil Spray 250ml", category: "Fertilizers", price: 199, gstRate: 18, seller: "OrganicCo", verified: true, stock: 80, rating: 4.5, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=70", description: "Cold-pressed neem oil — natural pest control for balcony plants." },
  { id: "p4", name: "Terracotta Pot Set (3 pcs)", category: "Pots", price: 599, gstRate: 12, seller: "Mitti Crafts", verified: true, stock: 25, rating: 4.7, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=70", description: "Hand-thrown earthenware pots with drainage. 6/8/10 inch set." },
  { id: "p5", name: "Tomato Seeds — Hybrid F1", category: "Seeds", price: 79, gstRate: 5, seller: "Seedhouse India", verified: true, stock: 200, rating: 4.4, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=70", description: "High-yield tomato seeds, suited for balcony growbags." },
  { id: "p6", name: "Vermicompost 5kg", category: "Fertilizers", price: 249, gstRate: 5, seller: "Earthy Co", verified: true, stock: 60, rating: 4.6, image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=70", description: "Rich, dark vermicompost — boost any potted plant." },
  { id: "p7", name: "Pruning Shears Pro", category: "Tools", price: 449, gstRate: 18, seller: "BalconyTools", verified: false, stock: 30, rating: 4.3, image: "https://images.unsplash.com/photo-1599598425947-5b3afa9d8e0a?auto=format&fit=crop&w=900&q=70", description: "Sharp, ergonomic shears for clean cuts on woody stems." },
  { id: "p8", name: "Snake Plant (Sansevieria)", category: "Plants", price: 299, gstRate: 5, seller: "Prabhat Nursery", verified: true, stock: 18, rating: 4.9, image: PLANT_PHOTOS["Snake Plant"], description: "Near-indestructible air-purifying plant. Low light tolerant." },
  { id: "p9", name: "Coco Peat Block 5kg", category: "Fertilizers", price: 329, gstRate: 5, seller: "Earthy Co", verified: true, stock: 50, rating: 4.5, image: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=900&q=70", description: "Expands to 75L — perfect potting medium." },
  { id: "p10", name: "Coriander Seeds (Organic)", category: "Seeds", price: 49, gstRate: 0, seller: "Seedhouse India", verified: true, stock: 300, rating: 4.6, image: "https://images.unsplash.com/photo-1599909533730-1f7c7c54f4a9?auto=format&fit=crop&w=900&q=70", description: "Organic dhaniya seeds — sprouts in 7 days." },
  { id: "p11", name: "Hanging Macrame Planter", category: "Pots", price: 399, gstRate: 12, seller: "BalconyTools", verified: false, stock: 0, rating: 4.2, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=70", description: "Handwoven cotton macrame, fits 6 inch pot." },
  { id: "p12", name: "Money Plant (Golden Pothos)", category: "Plants", price: 179, gstRate: 5, seller: "Green Roots", verified: true, stock: 35, rating: 4.7, image: PLANT_PHOTOS["Money Plant"], description: "Trailing pothos — brings good luck and clean air." },
  { id: "p13", name: "Copper Fungicide Spray", category: "Fertilizers", price: 349, gstRate: 18, seller: "OrganicCo", verified: true, stock: 22, rating: 4.4, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=70", description: "Controls leaf spot, blight, mildew. Safe for edibles." },
  { id: "p14", name: "Self-Watering Pot 8\"", category: "Pots", price: 549, gstRate: 18, seller: "Mitti Crafts", verified: true, stock: 14, rating: 4.5, image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=900&q=70", description: "Reservoir base keeps plants hydrated for 7+ days." },
  { id: "p15", name: "Chilli Seeds — Bhut Jolokia", category: "Seeds", price: 99, gstRate: 5, seller: "Seedhouse India", verified: true, stock: 150, rating: 4.7, image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=900&q=70", description: "Ghost pepper seeds — for the brave gardener." },
  { id: "p16", name: "Drip Irrigation Kit (10 pots)", category: "Tools", price: 899, gstRate: 18, seller: "BalconyTools", verified: false, stock: 8, rating: 4.6, image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=70", description: "Automate watering for your whole balcony." },
  { id: "p17", name: "Peace Lily (Spathiphyllum)", category: "Plants", price: 399, gstRate: 5, seller: "Prabhat Nursery", verified: true, stock: 11, rating: 4.8, image: PLANT_PHOTOS["Peace Lily"], description: "Elegant white blooms, removes indoor toxins." },
  { id: "p18", name: "Mustard Cake Powder 1kg", category: "Fertilizers", price: 149, gstRate: 5, seller: "Earthy Co", verified: true, stock: 70, rating: 4.5, image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=70", description: "Slow-release organic nitrogen feed." },
  { id: "p19", name: "Garden Gloves (Pair)", category: "Tools", price: 199, gstRate: 12, seller: "BalconyTools", verified: false, stock: 100, rating: 4.3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=70", description: "Breathable nitrile-coated gloves." },
  { id: "p20", name: "Succulent Mix Pack (5 pcs)", category: "Plants", price: 499, gstRate: 5, seller: "Green Roots", verified: true, stock: 20, rating: 4.9, image: PLANT_PHOTOS.Succulent, description: "Five assorted succulents, ready to display." },
];

const avatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f6dba0,e7b9a3,f0e8da`;

export type Expert = {
  id: string;
  name: string;
  avatar: string;
  specialisation: string;
  rating: number;
  consultations: number;
  price: number;
  bio: string;
  tags: string[];
  city: string;
};

export const SEED_EXPERTS: Expert[] = [
  { id: "e1", name: "Anjali Mehta", avatar: avatar("Anjali"), specialisation: "Ornamental Plants", rating: 4.9, consultations: 412, price: 299, bio: "Horticulturist with 12 years guiding urban balconies across Mumbai. I help you turn small spaces into lush green corners.\n\nI specialize in tropical foliage, indoor air-purifiers, and balcony composting setups.", tags: ["Indoor plants", "Air purifiers", "Balcony design"], city: "Mumbai" },
  { id: "e2", name: "Ravi Iyer", avatar: avatar("Ravi"), specialisation: "Pest Control", rating: 4.8, consultations: 318, price: 199, bio: "Organic pest control consultant. I keep your harvest safe without harsh chemicals.\n\nNeem-based regimens, integrated pest management for balconies.", tags: ["Pest control", "Organic", "Disease diagnosis"], city: "Bengaluru" },
  { id: "e3", name: "Dr. Priya Sharma", avatar: avatar("Priya"), specialisation: "Vegetables & Herbs", rating: 4.9, consultations: 521, price: 399, bio: "PhD in plant pathology. I help home growers maximize yield from small spaces.\n\nGrowing your own food shouldn't be hard — let me design a plan for your balcony.", tags: ["Vegetables", "Herbs", "Hydroponics"], city: "Pune" },
  { id: "e4", name: "Karthik Reddy", avatar: avatar("Karthik"), specialisation: "Soil & Composting", rating: 4.7, consultations: 287, price: 249, bio: "Composting evangelist. Helping urban Indians close the loop on kitchen waste.\n\nVermicomposting setups, soil rejuvenation, and balcony bin design.", tags: ["Composting", "Soil health", "Sustainability"], city: "Hyderabad" },
  { id: "e5", name: "Meera Nair", avatar: avatar("Meera"), specialisation: "Landscape Design", rating: 4.8, consultations: 196, price: 599, bio: "Landscape architect turned balcony designer. I bring resort vibes to 80 sqft.\n\nFrom layout to plant palette — full design service.", tags: ["Design", "Layout", "Aesthetics"], city: "Kochi" },
  { id: "e6", name: "Amitabh Choudhury", avatar: avatar("Amitabh"), specialisation: "Ornamental Plants", rating: 4.6, consultations: 224, price: 199, bio: "Specialist in flowering plants, bonsai, and traditional Indian garden plants.\n\n20 years of bonsai practice.", tags: ["Bonsai", "Flowering plants"], city: "Kolkata" },
  { id: "e7", name: "Sunita Patel", avatar: avatar("Sunita"), specialisation: "Vegetables & Herbs", rating: 4.7, consultations: 308, price: 249, bio: "Kitchen-garden coach. Growing methi, palak, dhaniya all year on your balcony.\n\nSeasonal planting calendars for Indian metros.", tags: ["Kitchen garden", "Seasonal"], city: "Ahmedabad" },
  { id: "e8", name: "Vikram Singh", avatar: avatar("Vikram"), specialisation: "Pest Control", rating: 4.5, consultations: 142, price: 179, bio: "Quick diagnosis, practical fixes. Send me a photo, I'll tell you what's wrong.\n\nUrban gardening troubleshooter.", tags: ["Diagnosis", "Quick fixes"], city: "Delhi" },
];

export type Guide = { slug: string; title: string; excerpt: string; category: string; readTime: string; cover: string; body: string };

export const SEED_GUIDES: Guide[] = [
  { slug: "tomatoes-mumbai-balcony", title: "How to grow tomatoes on a Mumbai balcony", excerpt: "From seed to first red fruit — a 90-day plan tuned for coastal humidity.", category: "Care Guides", readTime: "6 min", cover: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=70", body: "Tomatoes love sun and hate soggy roots. In Mumbai, you'll get the best results from October through February — the dry, mild months." },
  { slug: "aphid-control-organic", title: "Aphid control without chemicals", excerpt: "A 3-step organic protocol using neem, soap and ladybugs.", category: "Pest & Disease", readTime: "4 min", cover: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=70", body: "Aphids are the most common balcony pest. The good news: they're easy to control if you act early." },
  { slug: "monsoon-plant-care", title: "Monsoon plant care tips for Indian balconies", excerpt: "What to move under cover, what to let drink deep, and when to feed.", category: "Seasonal Tips", readTime: "5 min", cover: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?auto=format&fit=crop&w=1200&q=70", body: "Monsoon is a double-edged season for balcony gardeners." },
  { slug: "drip-irrigation-pots", title: "Setting up a drip system in pots", excerpt: "DIY automation for under ₹900 — never miss a watering again.", category: "Care Guides", readTime: "8 min", cover: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=70", body: "A simple drip system can keep your plants happy through travel and the worst of summer." },
  { slug: "composting-small-spaces", title: "Composting in small spaces", excerpt: "A vermicompost setup that fits under your kitchen sink.", category: "Organic Farming", readTime: "7 min", cover: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=70", body: "Composting at home is the single biggest thing you can do for your plants." },
  { slug: "hydroponics-balcony-starter", title: "A beginner hydroponics kit for ₹2,000", excerpt: "Grow lettuce, basil and mint with zero soil — full parts list.", category: "Hydroponics", readTime: "9 min", cover: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=70", body: "Hydroponics isn't just for commercial farms anymore." },
  { slug: "powdery-mildew-fix", title: "Powdery mildew: identify and treat", excerpt: "That white dust on your leaves? Here's how to stop it spreading.", category: "Pest & Disease", readTime: "4 min", cover: "https://images.unsplash.com/photo-1597055181449-b34a48f4e94c?auto=format&fit=crop&w=1200&q=70", body: "Powdery mildew is a fungus that shows up as white patches on leaves and stems." },
  { slug: "winter-care-roses", title: "Winter care for roses in North India", excerpt: "Pruning, mulching and feeding for record blooms in February.", category: "Seasonal Tips", readTime: "6 min", cover: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1200&q=70", body: "Roses do best when the days are warm and the nights are cool." },
  { slug: "soil-mix-recipe", title: "The perfect Indian potting mix", excerpt: "Cocopeat, compost, perlite — exact ratios for different plants.", category: "Organic Farming", readTime: "5 min", cover: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=1200&q=70", body: "Most potting failures trace back to the wrong mix." },
  { slug: "indoor-low-light-plants", title: "12 plants that thrive in low light", excerpt: "Bathroom, corner, and north-facing window picks.", category: "Care Guides", readTime: "5 min", cover: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=70", body: "Not every home gets direct sun — and that's okay." },
  { slug: "nft-lettuce-grow", title: "NFT hydroponic lettuce — 30 day cycle", excerpt: "From transplant to harvest, my complete log.", category: "Hydroponics", readTime: "10 min", cover: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=1200&q=70", body: "NFT (nutrient film technique) is one of the cleanest ways to grow leafy greens." },
  { slug: "tulsi-care-guide", title: "Caring for your Tulsi plant — a full year", excerpt: "Watering, pruning, repotting and the right spot.", category: "Care Guides", readTime: "6 min", cover: PLANT_PHOTOS.Tulsi, body: "Tulsi has a special place in Indian homes." },
];

export type CommunityPost = {
  id: string;
  user: string;
  avatar: string;
  city: string;
  image: string;
  caption: string;
  likes: number;
  liked?: boolean;
  comments: { id: string; user: string; avatar: string; text: string; ts: string }[];
  ts: string;
};

export const SEED_POSTS: CommunityPost[] = [
  { id: "c1", user: "Riya Kapoor", avatar: avatar("Riya"), city: "Mumbai", image: PLANT_PHOTOS.Tulsi, caption: "My tulsi is finally thriving after the repot 🌿 Took me 3 tries to get the soil mix right.", likes: 42, comments: [{ id: "cm1", user: "Anand", avatar: avatar("Anand"), text: "Looks beautiful! What soil mix did you end up with?", ts: "2h" }, { id: "cm2", user: "Meera", avatar: avatar("Meera2"), text: "Where did you buy the pot from?", ts: "1h" }], ts: "3h" },
  { id: "c2", user: "Arjun Verma", avatar: avatar("Arjun"), city: "Pune", image: PLANT_PHOTOS.Tomato, caption: "First tomato harvest from my balcony 🍅 4kg in one go!", likes: 128, comments: [{ id: "cm3", user: "Priya", avatar: avatar("Priya2"), text: "Amazing! Which variety?", ts: "5h" }], ts: "8h" },
  { id: "c3", user: "Sneha Iyer", avatar: avatar("Sneha"), city: "Bengaluru", image: PLANT_PHOTOS.Monstera, caption: "New leaf unfurling on my Monstera 💚 The fenestrations are gorgeous.", likes: 89, comments: [], ts: "12h" },
  { id: "c4", user: "Kabir Singh", avatar: avatar("Kabir"), city: "Delhi", image: PLANT_PHOTOS.Rose, caption: "Roses are finally blooming after the winter prune. Patience paid off!", likes: 67, comments: [{ id: "cm4", user: "Ravi", avatar: avatar("Ravi2"), text: "Which variety is this?", ts: "1d" }], ts: "1d" },
  { id: "c5", user: "Divya Nair", avatar: avatar("Divya"), city: "Kochi", image: PLANT_PHOTOS.Hibiscus, caption: "Red hibiscus — Kerala in a pot 🌺", likes: 54, comments: [], ts: "1d" },
  { id: "c6", user: "Aman Khan", avatar: avatar("Aman"), city: "Hyderabad", image: PLANT_PHOTOS.Chilli, caption: "Chilli harvest! 🌶️ Bhut jolokia from seed to fruit in 90 days.", likes: 92, comments: [{ id: "cm5", user: "Sunita", avatar: avatar("Sunita2"), text: "Spicy! 🔥", ts: "2d" }], ts: "2d" },
  { id: "c7", user: "Pooja Reddy", avatar: avatar("Pooja"), city: "Bengaluru", image: PLANT_PHOTOS.Marigold, caption: "Marigolds for Diwali season 🪔", likes: 76, comments: [], ts: "2d" },
  { id: "c8", user: "Vivek Joshi", avatar: avatar("Vivek"), city: "Mumbai", image: PLANT_PHOTOS["Money Plant"], caption: "Money plant is taking over my window 😅 Time to propagate.", likes: 38, comments: [], ts: "3d" },
  { id: "c9", user: "Tara Bose", avatar: avatar("Tara"), city: "Kolkata", image: PLANT_PHOTOS.Jasmine, caption: "Mogra in full bloom — the whole balcony smells divine.", likes: 102, comments: [], ts: "3d" },
  { id: "c10", user: "Nikhil Rao", avatar: avatar("Nikhil"), city: "Pune", image: PLANT_PHOTOS["Snake Plant"], caption: "Snake plant babies! Free plants for my friends.", likes: 45, comments: [], ts: "3d" },
  { id: "c11", user: "Aditi Mishra", avatar: avatar("Aditi"), city: "Lucknow", image: PLANT_PHOTOS.Mint, caption: "Pudina for the chai ☕", likes: 31, comments: [], ts: "4d" },
  { id: "c12", user: "Rohan Das", avatar: avatar("Rohan"), city: "Mumbai", image: PLANT_PHOTOS["Aloe Vera"], caption: "Aloe vera plot — never buy aloe gel again.", likes: 58, comments: [], ts: "4d" },
  { id: "c13", user: "Neha Gupta", avatar: avatar("Neha"), city: "Delhi", image: PLANT_PHOTOS["Fiddle Leaf Fig"], caption: "FLF is thriving! Bright indirect light + weekly water = happy plant.", likes: 81, comments: [], ts: "5d" },
  { id: "c14", user: "Sameer Pillai", avatar: avatar("Sameer"), city: "Chennai", image: PLANT_PHOTOS.Coriander, caption: "Dhaniya from seed — homemade chutney incoming.", likes: 27, comments: [], ts: "5d" },
  { id: "c15", user: "Lakshmi Sundar", avatar: avatar("Lakshmi"), city: "Bengaluru", image: PLANT_PHOTOS.Bougainvillea, caption: "Bougainvillea cascading over my railing 💕", likes: 113, comments: [], ts: "6d" },
];

export type MapGardener = { id: string; name: string; avatar: string; area: string; plantCount: number; lat: number; lng: number; recentPosts: string[] };
export type MapNursery = { id: string; name: string; address: string; rating: number; openNow: boolean; lat: number; lng: number };

// Mumbai mock coordinates near 18.9784, 72.8318
export const USER_LOCATION = { lat: 18.9784, lng: 72.8318 };

export const SEED_MAP_GARDENERS: MapGardener[] = [
  { id: "g1", name: "Riya Kapoor", avatar: avatar("Riya"), area: "Bandra West", plantCount: 14, lat: 19.0596, lng: 72.8295, recentPosts: [PLANT_PHOTOS.Tulsi, PLANT_PHOTOS.Monstera, PLANT_PHOTOS.Rose] },
  { id: "g2", name: "Arjun Verma", avatar: avatar("Arjun"), area: "Dadar East", plantCount: 22, lat: 19.0176, lng: 72.8562, recentPosts: [PLANT_PHOTOS.Tomato, PLANT_PHOTOS.Chilli, PLANT_PHOTOS.Mint] },
  { id: "g3", name: "Sneha Iyer", avatar: avatar("Sneha"), area: "Powai", plantCount: 9, lat: 19.1176, lng: 72.9060, recentPosts: [PLANT_PHOTOS.Monstera, PLANT_PHOTOS["Peace Lily"]] },
  { id: "g4", name: "Vivek Joshi", avatar: avatar("Vivek"), area: "Worli", plantCount: 7, lat: 19.0176, lng: 72.8147, recentPosts: [PLANT_PHOTOS["Money Plant"]] },
  { id: "g5", name: "Rohan Das", avatar: avatar("Rohan"), area: "Lower Parel", plantCount: 11, lat: 18.9952, lng: 72.8252, recentPosts: [PLANT_PHOTOS["Aloe Vera"], PLANT_PHOTOS.Succulent] },
  { id: "g6", name: "Priya Mehta", avatar: avatar("PriyaM"), area: "Andheri West", plantCount: 18, lat: 19.1364, lng: 72.8296, recentPosts: [PLANT_PHOTOS.Jasmine, PLANT_PHOTOS.Hibiscus] },
  { id: "g7", name: "Karan Shah", avatar: avatar("Karan"), area: "Colaba", plantCount: 6, lat: 18.9067, lng: 72.8147, recentPosts: [PLANT_PHOTOS.Fern] },
  { id: "g8", name: "Anita Rao", avatar: avatar("AnitaR"), area: "Juhu", plantCount: 25, lat: 19.0883, lng: 72.8264, recentPosts: [PLANT_PHOTOS.Bougainvillea, PLANT_PHOTOS.Marigold, PLANT_PHOTOS.Rose] },
];

export const SEED_MAP_NURSERIES: MapNursery[] = [
  { id: "n1", name: "Prabhat Nursery", address: "Dadar West, near Plaza Cinema", rating: 4.6, openNow: true, lat: 19.0203, lng: 72.8420 },
  { id: "n2", name: "Green Roots Nursery", address: "Bandra East, Kalanagar", rating: 4.4, openNow: true, lat: 19.0544, lng: 72.8400 },
  { id: "n3", name: "Mitti Crafts", address: "Lower Parel, Mathuradas Mills", rating: 4.7, openNow: false, lat: 18.9942, lng: 72.8302 },
  { id: "n4", name: "Earthy Co", address: "Andheri East, MIDC", rating: 4.3, openNow: true, lat: 19.1156, lng: 72.8696 },
  { id: "n5", name: "Urban Leaf", address: "Powai Plaza", rating: 4.5, openNow: false, lat: 19.1196, lng: 72.9051 },
];

export const MOCK_DETECTIONS = [
  { name: "Early Blight", confidence: 87, symptoms: "Dark concentric brown spots on lower leaves, yellowing around the spots, and gradual leaf drop. Most common in humid weather.", treatment: ["Remove and discard affected leaves immediately.", "Spray copper-based fungicide every 7 days.", "Improve air circulation between pots.", "Water at the base, not on the leaves."], crossSellId: "p13" },
  { name: "Powdery Mildew", confidence: 73, symptoms: "Powdery white patches on leaves and stems, especially on new growth. Leaves may curl and yellow over time.", treatment: ["Mix 1 tsp baking soda + 1L water + a drop of soap, spray weekly.", "Remove the worst-affected leaves.", "Move pot to a sunnier, drier spot.", "Avoid overhead watering."], crossSellId: "p3" },
  { name: "Root Rot", confidence: 91, symptoms: "Yellow drooping leaves despite moist soil, foul smell from the pot, mushy brown roots when checked.", treatment: ["Unpot the plant and gently wash roots.", "Trim away all soft, dark roots with sterile scissors.", "Repot in fresh, well-draining mix.", "Water sparingly until recovery."], crossSellId: "p9" },
  { name: "Aphid Infestation", confidence: 65, symptoms: "Tiny green/black insects clustered on new shoots, sticky residue on leaves, distorted new growth.", treatment: ["Blast plant with water to dislodge aphids.", "Spray neem oil solution every 3 days for 2 weeks.", "Introduce ladybugs if available.", "Inspect underside of leaves weekly."], crossSellId: "p3" },
  { name: "Leaf Spot Disease", confidence: 45, symptoms: "", treatment: [], crossSellId: "p13" }, // low-confidence
];
