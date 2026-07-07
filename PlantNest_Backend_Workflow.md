# PlantNest Backend Development Workflow (Detailed Guide)

**Version:** 1.1 (Detailed Expansion)
**Target Audience:** Developer A & Developer B
**Reference:** `PlantNest_TRD.md` (July 2026)

This document provides a highly granular, step-by-step workflow for simultaneously building the PlantNest FastAPI backend. It breaks down exactly which files to create, which database tables to define, and which API endpoints each developer is responsible for.

---

## 1. Collaboration Strategy & Git Workflow

### Git Branching Rules
- **Main Branch:** `main` (Always deployable to Render).
- **Feature Branches:** Use prefixes `feat-a/` (Developer A) and `feat-b/` (Developer B). Example: `feat-a/setup-auth` or `feat-b/marketplace-crud`.
- **Pull Requests:** Require at least one approval from the other developer before merging into `main`.

### Handling Database Migrations (Alembic)
1. **Rule of Thumb:** Communicate in your team chat before running `alembic revision --autogenerate -m "description"`.
2. **Conflict Resolution:** If you both merge a migration and Alembic complains about multiple heads:
   ```bash
   alembic merge heads -m "merge conflicting migrations"
   alembic upgrade head
   ```

---

## 2. Phase 1: Shared Foundation (Do This Together)

*Estimated Time: 2-3 Days*

Before splitting up, pair-program the core infrastructure so you both have identical local setups.

### Step 2.1: FastAPI & Core Configuration
1. **`backend/app/core/settings.py`**: Create a Pydantic `BaseSettings` class. Include:
   - `DATABASE_URL`
   - `SUPABASE_URL`, `SUPABASE_JWKS_URL`
   - `GEMINI_API_KEY`, `EXA_API_KEY`, `FIRECRAWL_API_KEY`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `FRONTEND_URL`
2. **`backend/app/core/database.py`**: Configure SQLAlchemy 2.0 `AsyncSession` and declarative base.
3. **`backend/app/main.py`**: Initialize FastAPI, add CORS middleware (allowing `FRONTEND_URL`), and set up the `/api/v1/health` endpoint.

### Step 2.2: Alembic Setup & Base Table
1. Run `alembic init alembic`.
2. Modify `alembic/env.py` to support asynchronous SQLAlchemy connections.
3. **`backend/app/auth/models.py`**: Create the `User` model.
   - *Columns:* `id` (String, primary key, matches Supabase UUID), `role` (String), `email` (String), `created_at` (DateTime).
4. Run the first migration: `alembic revision --autogenerate -m "create users table"` -> `alembic upgrade head`.

---

## 3. The 6-Step Module Implementation Rule

When working on your assigned modules in Phase 2, ALWAYS follow this strict order for every module to ensure API contracts are ready for the frontend:

1. **`schemas.py`**: Define Pydantic models for Requests (e.g., `PlantCreate`) and Responses (e.g., `PlantResponse`).
2. **`router.py`**: Define FastAPI routes returning dummy data using the Pydantic response schemas. *At this point, the frontend developer can start building the UI!*
3. **`models.py`**: Define the SQLAlchemy database tables.
4. **Database Migration**: Run `alembic revision --autogenerate` to create the table in PostgreSQL.
5. **`repository.py`**: Write the SQLAlchemy queries (CRUD operations).
6. **`service.py`**: Write the business logic, tying the router request to the repository query. Update `router.py` to use the real service.

---

## 4. Phase 2: Parallel Module Development

*Estimated Time: 4-6 Weeks*

You will now work in entirely different directories under `backend/app/`.

### Developer A — Core, AI, and Plants

You own the ML integration, third-party AI orchestration, and core user/plant logic.

#### Module 1: Auth (`auth/`)
- **Dependencies:** `get_current_user` (Validates Supabase JWT using JWKS).
- **Service Logic:** On successful token validation, check if the `user_id` exists in the `users` table. If not, auto-create it.

#### Module 2: Plants (`plants/`)
- **Tables:** `plant_profiles` (`id`, `user_id`, `species`, `nickname`, `location_type`).
- **Endpoints:**
  - `POST /api/v1/plants`
  - `GET /api/v1/plants` (Filter by `user_id` from JWT)
  - `PATCH /api/v1/plants/{id}`

#### Module 3: Detections & CNN Pipeline (`detections/`)
- **Tables:** `detections` (`id`, `plant_id`, `image_url`, `disease_name`, `confidence`, `treatment_text`, `weather_snapshot`, `created_at`).
- **Endpoints:**
  - `POST /api/v1/detections` (Accepts image upload, triggers AI)
  - `GET /api/v1/detections?plant_id={id}`
- **Processing:**
  1. Validate image (MIME type, size < 8MB).
  2. Issue signed URL for Supabase Storage -> Frontend uploads image.
  3. Preprocess image (224x224 resize).
  4. Run in-process Kaggle CNN inference. Check if confidence >= `DETECTION_CONFIDENCE_THRESHOLD`.

#### Module 4: AI & Agno Orchestration (`ai/`)
- **RAG Setup (`ai/rag/`)**: Create `knowledge_chunks` table with `vector(768)` using pgvector.
- **LLM Setup (`ai/gemini_client.py`)**: Thin wrapper for Gemini 2.5 Flash API handling retries and timeouts.
- **Agents (`ai/agents/`)**: 
  - *Diagnosis Agent:* Converts CNN output to plain language.
  - *Research Agent:* Uses `pgvector_search`, `ExaTools`, and `FirecrawlTools`.
  - *Care Agent:* Adapts treatment for `location_type` and weather.
  - *Recommendation Agent:* Generates cross-sell justification.
  - *Expert Support Agent:* Drafts booking briefs for low-confidence detections.

#### Module 5: Weather (`weather/`)
- **Tables:** `weather_cache` (`id`, `lat`, `lng`, `payload`, `fetched_at`).
- **Endpoints:** `GET /api/v1/weather?lat=&lng=` (Check cache first, fetch if expired).

---

### Developer B — Commerce, Community, and Engagement

You own the social, scheduling, payment integration, and background tasks.

#### Module 1: Marketplace & Orders (`marketplace/`)
- **Tables:** 
  - `products` (`id`, `seller_id`, `name`, `category`, `price`, `stock`, `gst_rate`, `image_url`).
  - `orders` (`id`, `buyer_id`, `status`, `total_amount`, `razorpay_order_id`).
  - `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`).
- **Endpoints:**
  - `GET /api/v1/products` (Public browsing)
  - `POST /api/v1/products` (Requires Nursery role)
  - `POST /api/v1/orders` (Calculates GST/Commission, returns `razorpay_order_id`)
  - `POST /api/v1/orders/{id}/verify` (Verifies Razorpay test mode signature)

#### Module 2: Community (`community/`)
- **Tables:** `posts`, `post_likes`, `post_comments`.
- **Endpoints:**
  - `GET /api/v1/posts` (Feed with pagination `limit` & `offset`)
  - `POST /api/v1/posts`

#### Module 3: Experts & Consultations (`experts/`)
- **Tables:** 
  - `expert_profiles` (`id`, `user_id`, `specialisation`, `bio`, `verified`).
  - `consultations` (`id`, `expert_id`, `gardener_id`, `slot_time`, `mode`, `status`).
  - `consultation_messages` (for the text thread).
- **Endpoints:**
  - `GET /api/v1/experts` (Browse experts)
  - `POST /api/v1/consultations` (Book an expert)
  - `GET /api/v1/consultations/{id}/messages` (Poll for chat)

#### Module 4: Reminders (`reminders/`)
- **Tables:** `reminders` (`id`, `plant_id`, `type`, `due_date`, `repeat_rule`, `status`).
- **Endpoints:**
  - `GET /api/v1/reminders`
  - `POST /api/v1/reminders/{id}/complete`

#### Module 5: Notifications & Support (`notifications/`, `support/`)
- **Tables:** `notifications`, `support_tickets`.
- **Endpoints:**
  - `GET /api/v1/notifications`
  - `POST /api/v1/support/tickets`
- **Background Tasks:** Create generic `send_notification()` function in `notifications/service.py` to handle both DB insertion and Web Push API dispatches.

---

## 5. Phase 3: Integration & Cross-Module Communication

*Estimated Time: 1-2 Weeks*

Once individual modules are working, you must connect them. 
**Golden Rule:** Never write SQL to access another module's database table directly from your router. Always import and call the other module's `service.py` function.

### Key Integration Scenarios:
1. **Detections Triggering Notifications (A -> B):** 
   - Developer A's `detections` router uses FastAPI `BackgroundTasks` to call `notifications.service.send_notification(...)` (Developer B's code) once the AI pipeline finishes.
2. **AI Recommendation to Marketplace (A -> B):** 
   - Developer A's AI Recommendation Agent needs to look up real products. It will call `marketplace.service.search_products(keyword)` (Developer B's code) as an Agno tool.
3. **Low Confidence Detections to Experts (A -> B):** 
   - If Developer A's CNN scores below the threshold, the backend calls `experts.service.create_booking_draft(...)` (Developer B's code) to pre-fill the consultation form.

---

## 6. Technical Standards & API Formatting

To ensure the merged codebase acts like a single application:

1. **JSON Formatting:** All JSON requests and responses MUST use `snake_case`.
2. **Money:** All Razorpay and marketplace prices must be handled as integers (paise/cents), never floats, to prevent rounding errors during commission calculation.
3. **Timestamps:** Use ISO-8601 UTC strings everywhere. The frontend will handle local timezone conversions.
4. **Pagination Envelope:** Every GET request returning a list must use this Pydantic schema structure:
   ```json
   {
     "items": [...],
     "total": 100,
     "limit": 20,
     "offset": 0
   }
   ```
5. **Error Responses:** Use a global exception handler in `main.py` so all errors look identical to the frontend:
   ```json
   {
     "error": {
       "code": "validation_error",
       "message": "The provided image is too large."
     }
   }
   ```
