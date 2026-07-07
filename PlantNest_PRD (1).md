# PlantNest — Product Requirements Document

**An urban balcony & home gardening platform** — AI plant care, local nursery commerce, and expert guidance, built for apartment gardeners.

*Prepared as a B.Tech / college capstone project*
*Version 1.0 — June 2026 — Mumbai, India*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision](#3-vision)
4. [Goals and Objectives](#4-goals-and-objectives)
5. [Target Audience](#5-target-audience)
6. [User Personas](#6-user-personas)
7. [User Stories](#7-user-stories)
8. [Market Analysis](#8-market-analysis)
9. [Competitive Analysis](#9-competitive-analysis)
10. [Unique Selling Proposition](#10-unique-selling-proposition)
11. [Feature List](#11-feature-list)
12. [MVP Features](#12-mvp-features-weeks-14-foundation)
13. [AI Features](#13-ai-features)
14. [Future Features](#14-future-features)
15. [Expert Consultation Module](#15-expert-consultation-module)
16. [Nursery Partner Module](#16-nursery-partner-module)
17. [Plant Care Module](#17-plant-care-module)
18. [Plant Disease Detection Module](#18-plant-disease-detection-module)
19. [Community Module](#19-community-module)
20. [Rewards & Gamification Ideas](#20-rewards--gamification-ideas)
21. [Information Architecture](#21-information-architecture)
22. [Functional Requirements](#22-functional-requirements)
23. [Non-Functional Requirements](#23-non-functional-requirements)
24. [Database Design](#24-database-design)
25. [API Structure](#25-api-structure)
26. [System Architecture](#26-system-architecture)
27. [UI/UX Recommendations](#27-uiux-recommendations)
28. [Wireframe Suggestions](#28-wireframe-suggestions)
29. [Tech Stack Recommendations](#29-tech-stack-recommendations)
30. [Security Considerations](#30-security-considerations)
31. [Scalability Considerations](#31-scalability-considerations)
32. [Analytics Requirements](#32-analytics-requirements)
33. [Development Roadmap](#33-development-roadmap)
34. [Risks and Mitigation Strategies](#34-risks-and-mitigation-strategies)
35. [Future Expansion Opportunities](#35-future-expansion-opportunities)
36. [Presentation & Demo Strategy](#36-presentation--demo-strategy-for-college-evaluation)

---

## 1. Executive Summary

PlantNest is a web platform built for urban balcony gardeners, home plant enthusiasts, and the small neighbourhood nurseries that serve them. It combines four things that currently live in separate apps or nowhere at all: an AI-assisted plant disease check, a simple care-reminder system tuned to potted and balcony plants, a local marketplace that lets small nurseries take orders online, and on-demand access to a human gardening expert when the AI is not enough.

This document is intentionally scoped around a realistic build: one developer, working part-time over roughly twelve weeks, using free-tier managed services rather than custom infrastructure. The feature set is therefore split clearly into an MVP that is achievable in that window, a Phase 2/3 set that extends it, and a long-term vision that is described but explicitly not promised for the demo. That separation is itself a deliverable — it is what turns an enthusiastic idea into a credible plan an evaluator can trust.

The original concept (see Section 31, Risks) borrowed heavily from Plantix, a farmer-facing crop app. PlantNest deliberately repositions the same underlying idea — photo-based diagnosis, weather advisory, community, commerce — around a different, underserved user: someone with eight pots on a Mumbai balcony, not eight acres of field.

## 2. Problem Statement

Urban gardening in India has grown quickly — balconies, terraces, and window ledges have become the only “garden” many apartment dwellers have — but the tools available to these gardeners were not built for them. Existing plant-care apps fall into two camps: large-scale farming apps (Plantix, AgroStar) that assume fields and crop yields, or simple plant-identification apps (PictureThis, Vera) that diagnose and stop there, offering no path to treatment, expert help, or a place to actually buy what is recommended.

Five problems recur for this audience:

- Plants get sick or die quietly. By the time a balcony gardener notices browning leaves, the underlying disease or pest issue is often advanced, and there is no quick, trustworthy way to identify it without posting in a Facebook group and waiting.

- Generic advice does not fit potted, balcony, or terrace conditions. Watering and fertilizer guidance written for open-field crops does not translate well to a 12-inch pot that dries out twice as fast.

- Local nurseries are invisible online. Most small nurseries operate on word-of-mouth and a physical shopfront; a gardener cannot search, compare, or order from them the way they can from a large e-commerce site.

- Expert advice is hard to access on-demand. Horticulturists and agronomists exist, but there is no marketplace that lets a home gardener book fifteen minutes of their time the way one might book a tutor.

- Care is easy to forget. Watering, fertilizing, and pruning schedules live in people's heads or a sticky note, and lapse the moment life gets busy — the single biggest cause of plant death this audience reports.

## 3. Vision

To become the first app an Indian apartment gardener opens when a plant looks unwell, and the easiest way for a local nursery to find new customers — making small-scale urban gardening more successful, more social, and more sustainable, one balcony at a time.

In three years, PlantNest succeeds if a meaningful share of balcony gardeners in a few Indian metros use it as a habit (not a one-off download), if a few dozen real nurseries have a working seller account, and if the disease-detection feature has a track record specific enough to be trusted over a generic Google Lens search.

## 4. Goals and Objectives

### Product goals

- Give a balcony/home gardener a trustworthy first response to “what is wrong with my plant” in under 60 seconds.

- Turn one-time plant purchases into a recurring relationship between gardener and nursery.

- Make basic plant care (watering, fertilizing) something the app remembers, not the user.

- Provide a credible, low-cost path to human expertise when AI confidence is low.

### Academic / project goals

- Demonstrate full-stack product thinking: research-backed problem framing, scoped MVP, working prototype, and a defensible business model.

- Ship a working, demoable build within the 1–3 month window using free-tier tools — prioritising depth on 3–4 features over shallow coverage of fifteen.

- Produce a portfolio-quality artifact: clean codebase, deployed URL, and this PRD, usable in interviews after submission.

## 5. Target Audience

### Primary users

- Urban balcony / terrace gardeners (25–45): apartment residents in metros (Mumbai, Bengaluru, Pune, Delhi NCR) growing 5–20 potted plants, ornamentals, or kitchen-garden vegetables.

- Home plant enthusiasts: indoor-plant collectors who treat plants as a hobby and are active in WhatsApp/Facebook plant groups today.

- Small nursery owners: family-run nurseries and plant shops with no website, taking orders by phone or in person only.

- Gardening beginners: recent plant owners (often gifted a plant, or starting during a life change) who need hand-holding more than automation.

### Secondary users

- Horticulturists / agronomists / certified plant doctors offering paid consultations on the side of their main practice.

- Garden product sellers (pots, soil mixes, tools, organic fertilizer brands) looking for a direct channel to engaged gardeners.

### Explicitly out of scope for v1

- Commercial farmers and field-crop growers — different unit economics, different decision (yield/hectare, not plant survival), and already served by Plantix/AgroStar.

- IoT hardware buyers (smart sensors, automated drip systems) — retained as a Future Expansion item, not a v1 persona.

## 6. User Personas

### Persona 1 — Priya Nair, the Overwhelmed Balcony Gardener

| **Attribute** | **Detail** |
| --- | --- |
| Age / role | 29, software engineer, Mumbai (2BHK apartment) |
| Plants | 15 pots: money plant, tomato, tulsi, marigold, a struggling rose |
| Goal | Keep her plants alive without it becoming a second job |
| Frustration | Cannot tell if yellow leaves mean overwatering, a pest, or normal aging; forgets watering for 4–5 days at a stretch during work crunches |
| Where PlantNest helps | Photo diagnosis in under a minute; watering/fertilizing reminders that adapt to weather; one-tap reorder of treatment from a nearby nursery |

### Persona 2 — Suresh Patil, the Offline Nursery Owner

| **Attribute** | **Detail** |
| --- | --- |
| Age / role | 52, runs a 3-person nursery in a Pune suburb, 18 years in business |
| Today | Walk-in customers and one WhatsApp broadcast list; no website, no online payments |
| Goal | Reach younger apartment-dwelling customers who never walk past his shop |
| Frustration | Tried listing on a generic marketplace once; fees were high and customers did not understand plant care, leading to complaints and returns |
| Where PlantNest helps | A seller dashboard scoped to plants/gardening (not generic retail); customers arrive pre-educated by the app's care content, reducing support load |

### Persona 3 — Dr. Anjali Verma, the Independent Horticulture Consultant

| **Attribute** | **Detail** |
| --- | --- |
| Age / role | 38, agricultural university graduate, runs a small landscaping consultancy |
| Today | Consults for a handful of housing societies; income is project-based and inconsistent |
| Goal | A low-effort way to monetise quick advice (15–20 minute sessions) between projects |
| Frustration | No platform exists for “micro-consulting” in this niche; building her own booking site is not worth the effort for the income it would bring |
| Where PlantNest helps | A ready-made expert profile, booking calendar, and payment flow, with PlantNest handling discovery |

## 7. User Stories

Stories are tagged by phase: MVP (Phase 1–2 of the roadmap, Section 30) or Future.

| **#** | **As a…** | **I want to…** | **So that…** | **Phase** |
| --- | --- | --- | --- | --- |
| 1 | balcony gardener | photograph a sick leaf and get a diagnosis | I know what's wrong without guessing | MVP |
| 2 | balcony gardener | see a confidence score with the diagnosis | I know whether to trust it or ask a human | MVP |
| 3 | balcony gardener | get a reminder to water a specific plant | I do not let it dry out during a busy week | MVP |
| 4 | balcony gardener | see today's weather and a spray/watering tip | I time care around heat and rain | MVP |
| 5 | beginner gardener | browse short guides for my specific plants | I learn the basics without searching randomly | MVP |
| 6 | gardener | buy the treatment a diagnosis recommends | I do not have to search elsewhere for it | MVP |
| 7 | gardener | post a photo of my plant to the community | I get feedback and feel part of a group | Phase 2 |
| 8 | nursery owner | list my products with photos and prices | apartment customers can find and buy from me | Phase 2 |
| 9 | gardener | book a paid chat with a real expert | I get a second opinion when the AI is unsure | Phase 3 |
| 10 | gardener | track which plants I've successfully cared for | I feel a sense of progress and earn a badge | Phase 3 |
| 11 | nursery owner | see basic sales analytics for my listings | I know what is actually selling | Future |
| 12 | gardener | see other gardeners near my housing society | I can swap cuttings or advice locally | Future |

## 8. Market Analysis

India's urban gardening interest has grown steadily alongside apartment living, balcony/terrace garden content on social media, and a post-pandemic rise in plant ownership as a hobby. Précised for this PRD rather than cited as hard market-research figures (a real launch would commission or source verified data), the directional trends a college evaluator should accept as reasonable are:

- Plant nurseries and ornamental horticulture remain a large, highly fragmented, offline-first retail category in India — dominated by small, local players rather than chains.

- Smartphone-based plant identification and disease detection has proven demand globally (Plantix, PictureThis, and Vera each report large download bases), but most of that demand is served by single-purpose apps.

- “Expert marketplace” models (book a professional for a short paid session) have already been validated in adjacent categories in India — astrology, legal advice, and tutoring all have successful on-demand consultation apps; gardening does not yet have an equivalent.

The implication for PlantNest is not that the overall plant market is small — it is large and growing — but that it is served by point solutions. The opportunity is integration: one place that recognises a disease, recommends and sells the fix, and connects to a human when needed.

## 9. Competitive Analysis

| **Product** | **Core focus** | **Strength** | **Gap PlantNest fills** |
| --- | --- | --- | --- |
| Plantix | Field-crop disease detection & farmer community | Mature AI model, huge farmer user base, weather advisory | Built for fields/farmers, not potted/balcony plants; no consumer marketplace or expert booking |
| PictureThis / Vera | Plant identification & generic care tips | Polished UX, large plant database | Identification only — no treatment marketplace, no local nursery link, no expert access |
| Planta | Personalised watering schedule app | Strong reminder/scheduling UX | No disease detection, no commerce, no community |
| Local nursery WhatsApp/Instagram | Direct sales via chat | Personal relationship, zero platform fee | No discovery for new customers, no structured catalogue, no payment flow |
| PlantNest (this project) | Diagnosis + care + local commerce + expert access, balcony-first | Single integrated flow for an underserved urban-Indian segment | — |

## 10. Unique Selling Proposition

- **Balcony-first, not field-first:** every care recommendation, crop list, and UI choice assumes pots and limited space, not acreage.

- **Diagnosis that leads somewhere:** a disease result connects directly to a purchasable treatment and, if needed, a bookable human expert — most plant-ID apps stop at the diagnosis.

- **Local nurseries, not a faceless warehouse:** sellers are real neighbourhood nurseries, which is both a trust signal for buyers and a digitisation story for the nursery.

- **Honest about AI confidence:** low-confidence results are flagged and routed to a human rather than presented as certain — a deliberate trust-building design choice, not just a technical limitation.

- **Free-tier, low-cost technology by design:** the architecture (Section 23) is built entirely on free or sandbox tiers, which keeps it realistic for a student to actually ship and demo.

## 11. Feature List

The full feature set across every phase, in one table, so scope decisions are visible at a glance. “P1/P2/P3” map to the 12-week roadmap in Section 30; “Future” means deliberately deferred beyond the college-project timeline.

| **Module** | **Feature** | **Phase** |
| --- | --- | --- |
| Account | Email + Google sign-in, role selection (gardener/nursery/expert) | P1 |
| Account | Onboarding: pick plant interests, balcony/terrace/indoor type | P1 |
| Plant Care | My Plants dashboard, add/edit plant | P1 |
| Plant Care | Care reminders (water/fertilize/prune) with due dates | P1 |
| Plant Care | Weather widget + rule-based spray/watering advisory | P1 |
| Disease Detection | Photo upload → AI diagnosis with confidence score | P1 |
| Disease Detection | Treatment text + “Buy treatment” cross-sell | P1 |
| Disease Detection | Detection history log per plant | P1 |
| Community | Feed: post photo/caption, like, comment | P2 |
| Community | Basic groups / discussion threads | Future |
| Community | Map of nearby gardeners (opt-in location) | Future |
| Marketplace | Browse/search/filter products, product detail page | P2 |
| Marketplace | Cart, checkout (sandbox payment), order confirmation | P2 |
| Marketplace | Seller dashboard: add product, view orders | P2 |
| Marketplace | Seller analytics, multi-store management | Future |
| Education | Guides library (care, pests, seasonal tips), filterable by plant | P2 |
| Education | Video tutorials, quizzes, plant-ID challenges | Future |
| Experts | Expert directory with specialisation & rating | P3 |
| Experts | Booking form (date/time) + confirmation | P3 |
| Experts | Live chat consultation | Future |
| Experts | Video consultation (WebRTC) | Future |
| Gamification | Badges (streaks, first diagnosis, helpful neighbour) | P3 |
| Subscriptions | Free vs Premium gating (detection limit, ad-free, etc.) | P3 |
| Support | Ticket-based complaint system with status tracking | Future |
| IoT | Smart sensor / automated watering integration | Future (Long-term) |

## 12. MVP Features (Weeks 1–4, “Foundation”)

This is deliberately the smallest slice that is still a coherent, demoable product — not a stripped-down marketplace or community, but those modules held back entirely until Phase 2/3. A solo beginner/intermediate developer can realistically build and polish this list in four weeks alongside coursework.

- Authentication and a short onboarding flow (role, balcony/terrace/indoor type, up to 8 plant interests).

- My Plants dashboard — add a plant from a preset species list, see it as a card.

- AI Disease Detection using a free-tier third-party API (Section 13), with confidence score, symptoms, and treatment text.

- Detection history saved against each plant.

- Weather widget (current + short forecast) with a simple rule-based watering/spraying tip.

- Care reminders: manually scheduled, recurring water/fertilize/prune tasks shown as a to-do list.

> 💡 Why this and not more: a working, polished disease-detection-to-reminder loop is a stronger demo than five half-built modules. Everything else builds on top of this core in Phase 2–3.

## 13. AI Features

“AI” is used carefully here — each feature below states plainly whether it calls a real machine-learning model or is a deterministic rule dressed up as a smart assistant. Both are legitimate for a student project as long as the PRD and the demo are honest about which is which.

### 13.1 Disease detection (real ML, via third-party API)

Rather than training a custom CNN — which needs a labelled dataset and GPU time a solo student does not have — PlantNest calls a free-tier plant health API (Kindwise / Plant.id-style) that already provides disease identification with a confidence score from a photo. This is real inference, just not a self-trained model; that distinction is worth stating explicitly in a viva so it is not mistaken for an in-house model.

### 13.2 Weather-based care advisory (rule-based, presented as “smart”)

A small set of if/then rules over temperature, humidity, and rain forecast (e.g. “skip watering today, rain expected within 6 hours”) generates a one-line natural-language tip using a template. This is not a trained model, but it is genuinely useful and cheap to build — a good example of “AI-feeling” UX that does not require AI infrastructure.

### 13.3 Low-confidence escalation

When the disease API returns a confidence score below a set threshold (for example 60%), the UI nudges the user to retake the photo or book an Expert instead of presenting an uncertain result as fact — a small design rule with an outsized effect on user trust.

### 13.4 Future AI directions (not in MVP)

- A lightweight on-device model (TensorFlow.js) for common pest identification, removing dependence on the third-party API's free-tier rate limit.

- Personalised care-schedule suggestions based on a user's own detection and watering history rather than generic rules.

- A retrieval-based chat assistant over the Education Hub content, so users can ask care questions in natural language.

## 14. Future Features

### Phase 2 (Weeks 5–8, “Core Features”)

- Community feed: create post, like, comment.

- Marketplace: browse, product detail, cart, sandbox checkout.

- Seller dashboard for nurseries: add product, view incoming orders.

- Education Hub: a curated library of 10–15 care guides, filterable by plant.

### Phase 3 (Weeks 9–12, “Differentiation & Polish”)

- Expert directory and a booking form (date/time picker, confirmation message).

- Gamification badges for care streaks and community helpfulness.

- Free vs Premium subscription gating.

### Long-term (post-submission, if continued as a real product)

- Live chat and video consultations (WebRTC) replacing the booking-form-only MVP version.

- Seller analytics dashboards and multi-store management for larger nursery chains.

- A nearby-gardeners map and society-level community groups.

- IoT integration: soil-moisture sensors and automated drip watering.

- A native mobile app (React Native) sharing the same backend.

- Augmented-reality “place this plant in my balcony” preview.

## 15. Expert Consultation Module

Scoped down deliberately from the original draft's full video/chat SDK integration, which is a multi-week effort on its own. The MVP-realistic version still demonstrates the full concept end-to-end:

- Expert profile: name, specialisation (e.g. ornamental plants, vegetable gardening, pest control), short bio, and a self-reported qualification (manually verified by an admin for the demo, not an automated KYC flow).

- Availability shown as open time slots; gardener picks a slot and submits a booking request.

- Confirmation is a simple status change (pending → confirmed) plus an email/in-app notification — no live calendar sync needed for the demo.

- Consultation “mode” field exists in the data model (chat / video) from day one, even though only a basic in-app text thread is functional in the MVP — this makes the Future upgrade to real video a config change, not a redesign.

### Pricing

| **Plan** | **Price** | **What it includes** |
| --- | --- | --- |
| Pay-per-session | ₹50–₹200 | Single 15–20 minute consultation, priced per expert |
| Premium subscription add-on | Included: 5 sessions/month | Bundled into the ₹199/month Premium tier (Section 27) |

## 16. Nursery Partner Module

The value proposition to a real nursery owner has to be sharper than “you get a dashboard” — that alone rarely justifies the effort of digitising. PlantNest's pitch to a nursery is narrower and more concrete:

- Pre-qualified demand: buyers arrive already knowing what disease or care issue they are solving, because they came from a diagnosis result — this reduces the back-and-forth and returns that Persona 2 (Section 6) explicitly complained about on a generic marketplace.

- A catalogue scoped to gardening, not a generic storefront fighting for attention against unrelated categories.

- A verification badge once basic details are confirmed, which buyers can see and trust — addressing the cold-start trust problem new online sellers face.

### MVP seller flow

- Apply as a seller (business name, location, simple verification fields).

- Add a product: name, category, price, stock quantity, photo, GST rate.

- View incoming orders and mark them fulfilled.

### Commission structure (unchanged from original concept, retained as realistic)

| **Category** | **Platform commission** |
| --- | --- |
| Plants & seeds | 5–8% |
| Fertilizers & chemicals | 6–10% |
| Tools & accessories | 7–12% |

## 17. Plant Care Module

- My Plants dashboard: each plant is a card showing species, nickname, and next due task.

- Add a plant from a curated species list (balcony/indoor/terrace appropriate — deliberately not the full crop list a farming app would offer).

- Reminders: water / fertilize / prune, each with a due date and a simple repeat rule (e.g. every 3 days); marking a task done schedules the next occurrence.

- Weather-aware nudge: if heavy rain is forecast, a due watering task is flagged “maybe skip today” rather than silently still showing as overdue.

- (Future) shared schedules — a household or housing-society group splitting care duties for a shared terrace garden.

## 18. Plant Disease Detection Module

This is the centrepiece feature and the one most worth polishing for the demo, since it is the single module that differentiates PlantNest from a plain plant-ID app.

![Figure 1. End-to-end disease detection user flow](images/figure-1-disease-detection-flow.png)

*Figure 1. End-to-end disease detection user flow*

### Data captured per detection

- Detection date and time, linked plant

- Uploaded image (stored, not just analysed and discarded — enables a visual history)

- Disease name and confidence score returned by the API

- Treatment text and any cross-sold product

- Weather snapshot at the time of detection (useful context for both the user and, in aggregate, an interesting analytics signal)

### Designing for AI failure, not just AI success

A confidence threshold (Section 13.3) and an explicit “not sure — ask an expert” path are the two design decisions that matter most here. A demo that only shows the happy path (clear photo, high confidence, correct disease) is far less convincing to an evaluator than one that also shows the considered fallback for an ambiguous photo.

## 19. Community Module

- Feed: text + photo posts, like and comment, reverse-chronological for MVP simplicity (no ranking algorithm needed at this scale).

- Create post directly from a plant's detection history (“share your recovery story”) — a natural retention loop connecting the AI feature to the social one.

- (Phase, not MVP) groups/discussions organised by topic (e.g. “terrace vegetable growers”, “Mumbai balcony gardeners”).

- (Future) opt-in map view of nearby gardeners, with location precision deliberately coarsened (society/neighbourhood level, not exact address) for privacy.

> 💡 Privacy note: location sharing is off by default everywhere in the product, consistent with the privacy-first positioning in Section 10.

## 20. Rewards & Gamification Ideas

| **Badge / mechanic** | **Trigger** | **Why it works for this audience** |
| --- | --- | --- |
| First Diagnosis | Complete one disease detection | Early win, encourages trying the core AI feature immediately |
| 7-Day Care Streak | Mark a reminder done on 7 consecutive scheduled days | Directly reinforces the habit that most prevents plant death |
| Green Thumb | Successfully nurse a “sick” plant back to a healthy detection result | Emotionally resonant — a recovery story, not just a checklist |
| Helpful Neighbour | Receive 10 likes/comments combined across community posts | Rewards the social behaviour the Community module depends on |
| Plant Collector | Add 5+ different plant species | Encourages deeper engagement with My Plants |

Deliberately excluded from MVP: leaderboards and streak-loss penalties. Both can tip from motivating into anxiety-inducing for a hobby activity, which runs against the calm, low-pressure tone this product wants for its audience.

## 21. Information Architecture

A flat, four-tab structure was chosen deliberately over the deeper nested menus common in farming apps — balcony gardeners are casual, frequent users who benefit from everything being at most two taps away.

![Figure 2. Site map — four-tab bottom navigation](images/figure-2-site-map.png)

*Figure 2. Site map — four-tab bottom navigation*

## 22. Functional Requirements

### Account & Onboarding

| **ID** | **Requirement** |
| --- | --- |
| FR-1 | Users can register/sign in via email or Google OAuth. |
| FR-2 | Users select a role at signup: gardener, nursery owner, or expert (admin-assigned separately). |
| FR-3 | Onboarding captures up to 8 plant interests and a garden type (balcony / terrace / indoor / pots). |

### Plant Care

| **ID** | **Requirement** |
| --- | --- |
| FR-4 | Users can add a plant from a curated species list with a custom nickname. |
| FR-5 | Users can create a recurring care reminder (water/fertilize/prune) with a due date. |
| FR-6 | The system marks a reminder overdue if not completed by its due date, and schedules the next occurrence on completion. |
| FR-7 | The dashboard displays current weather and a one-line care advisory generated from forecast data. |

### Disease Detection

| **ID** | **Requirement** |
| --- | --- |
| FR-8 | Users can upload or capture a photo and submit it for AI disease detection. |
| FR-9 | The system displays the returned disease name, confidence score, symptoms, and treatment text. |
| FR-10 | If confidence is below the configured threshold, the system offers “retake photo” and “ask an expert” actions instead of a definitive result. |
| FR-11 | Every detection is saved to history against the relevant plant, including image, result, and weather snapshot. |
| FR-12 | The result screen surfaces at least one relevant marketplace product as a cross-sell, where available. |

### Marketplace

| **ID** | **Requirement** |
| --- | --- |
| FR-13 | Buyers can browse, search, and filter products by category. |
| FR-14 | Buyers can add products to a cart and complete checkout via a sandboxed payment flow. |
| FR-15 | Sellers can create a seller profile, add products, and view/update order status. |
| FR-16 | The system calculates GST and platform commission per the rates in Section 16 at checkout. |

### Community & Experts

| **ID** | **Requirement** |
| --- | --- |
| FR-17 | Users can create a post (text + optional photo) and like/comment on others' posts. |
| FR-18 | Users can browse expert profiles and submit a booking request for a time slot. |
| FR-19 | Experts can accept/decline a booking request, changing its status. |

## 23. Non-Functional Requirements

| **Category** | **Requirement** |
| --- | --- |
| Performance | Disease detection result returned within 5 seconds under normal network conditions (bounded by third-party API latency). |
| Availability | Demo build targets 99% uptime during the evaluation window; not engineered for production-grade SLAs. |
| Usability | Core flows (add plant, detect disease, complete a reminder) reachable within 3 taps from the home dashboard. |
| Compatibility | Fully responsive from 360px (mobile) to desktop widths; tested on Chrome, Safari, and Edge. |
| Accessibility | Minimum AA colour contrast on text; all interactive elements reachable via keyboard tab order. |
| Maintainability | Single-developer codebase: consistent component structure and naming so the project remains explainable in a viva and extendable solo. |
| Data integrity | Foreign-key constraints enforced at the database level (Section 25) to prevent orphaned records. |
| Localisation readiness | Text content kept out of component logic (simple i18n-ready structure), even though only English ships in v1. |

## 24. Database Design

PostgreSQL (via Supabase) was chosen over a document store because the data is genuinely relational — orders reference products and buyers, detections reference plants, consultations reference two different user roles — and Postgres's row-level security maps directly onto “users can only see their own data” without bespoke backend logic.

![Figure 3. Simplified entity-relationship diagram](images/figure-3-database-erd.png)

*Figure 3. Simplified entity-relationship diagram*

### Notes on key tables

- users.role determines which dashboard a person sees (gardener / nursery / expert / admin) and drives row-level security policies.

- plants.location_type (balcony/indoor/terrace) is the field that lets care advice differ from a generic farming app's assumptions.

- detections.weather_snapshot is denormalised (copied at write time) rather than joined live, so historical detections remain accurate even as current weather changes.

- orders.status follows a small fixed state machine: placed → shipped → done (with a cancelled branch), kept intentionally simple for the MVP.

- Support tables not diagrammed in detail: support_tickets, badges, weather_cache (to avoid re-calling the weather API on every page load), expert_profiles, and nursery_profiles, each extending the base users table with role-specific fields.

## 25. API Structure

Implemented as Next.js API routes (serverless functions), grouped by resource. All routes except auth and public product browsing require a valid session.

| **Method ****&**** Path** | **Description** |
| --- | --- |
| POST /api/auth/signup | Create account, assign role |
| POST /api/auth/login | Email or OAuth session creation |
| GET /api/plants | List the current user's plants |
| POST /api/plants | Add a new plant |
| PATCH /api/plants/:id | Edit a plant's nickname/details |
| POST /api/detections | Submit a photo for AI disease detection |
| GET /api/detections?plantId= | Get detection history for a plant |
| GET /api/reminders | List due/upcoming care reminders |
| POST /api/reminders/:id/complete | Mark a reminder done, schedule next occurrence |
| GET /api/weather?lat=&lng= | Current conditions + 6-day forecast |
| GET /api/products | Browse/search/filter marketplace products |
| POST /api/orders | Create an order and initiate checkout |
| GET /api/orders/seller | Seller's incoming orders |
| GET /api/posts | Community feed |
| POST /api/posts | Create a post |
| POST /api/posts/:id/like | Like / unlike a post |
| GET /api/experts | Browse expert profiles |
| POST /api/consultations | Submit a booking request |
| POST /api/support/tickets | Raise a support ticket |

## 26. System Architecture

The guiding principle is to spend zero effort on infrastructure a managed service already does well, so the limited development time goes into the product itself rather than DevOps.

![Figure 4. MVP system architecture](images/figure-4-system-architecture.png)

*Figure 4. MVP system architecture*

Notably absent compared to the original draft: a message queue (RabbitMQ), a separate caching layer (Redis), and a custom-trained ML pipeline. None of these are needed at MVP scale, and each would consume development time disproportionate to the value it adds in a 12-week, single-developer project. They are revisited in Section 28, Scalability Considerations, as deliberate later additions rather than oversights.

## 27. UI/UX Recommendations

- Borrow the calm, card-based dashboard language of apps like Planta and Headspace rather than the denser, data-table feel of farming apps — this audience wants gardening to feel relaxing, not like a spreadsheet.

- Keep the bottom navigation to exactly four tabs (Section 21); resist the temptation to add a fifth as features grow — nest new features under existing tabs instead.

- Treat the disease-detection result screen as the most important single screen in the product and give it the most design iteration time; it is the first screen a new user is likely to evaluate the whole app by.

- Use real photography (or at least photo-realistic placeholders) for plant cards and product listings rather than icon illustrations — trust in a marketplace context is heavily visual.

- Default every location-sharing control to off, and make the on-state visually obvious (not a buried settings toggle) — consistent with the privacy-first USP.

- Use skeleton loading states (not blank screens or spinners) for the AI detection wait, since that 2–5 second delay is the single longest wait in the product.

## 28. Wireframe Suggestions

Four screens below cover the core MVP loop end-to-end: dashboard → detect → care → share. These are intentionally low-fidelity — the goal at this stage is validating layout and information hierarchy, not visual polish, which should happen in a dedicated design tool once the flow is agreed.

![Figure 5. Low-fidelity wireframes for the four core MVP screens](images/figure-5-wireframes.png)

*Figure 5. Low-fidelity wireframes for the four core MVP screens*

## 29. Tech Stack Recommendations

Chosen against three criteria specific to this project: free-tier friendly, beginner/intermediate-friendly documentation and community support, and reasonably attractive on a resume.

| **Layer** | **Choice** | **Why** |
| --- | --- | --- |
| Frontend | Next.js (React) + Tailwind CSS | One framework for pages, API routes, and deployment; Tailwind avoids hand-writing CSS under time pressure |
| State management | React Context + hooks (Zustand if needed) | Redux Toolkit is unnecessary complexity at this app's scale for a solo developer |
| Backend / API | Next.js API routes (serverless) | No separate backend service to deploy or pay for |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth and storage, row-level security, real SQL skills (more transferable than a proprietary NoSQL API) |
| Auth | Supabase Auth (email + Google OAuth) | Avoids building auth/session handling from scratch |
| File storage | Supabase Storage | Plant photos, post images, avatars — same project, no extra billing account |
| Disease detection | Kindwise / Plant.id API (free tier) | Real ML inference without training or hosting a model |
| Weather | OpenWeatherMap (free tier) | Reliable, well-documented, generous free quota |
| Payments | Razorpay Test Mode | India-relevant gateway; sandbox avoids real-money/compliance concerns for a student project |
| Maps | OpenStreetMap + Leaflet | Avoids Google Maps billing risk for a free-tier project |
| Hosting | Vercel | Native Next.js support, automatic preview deployments, generous free tier |
| Version control / CI | GitHub + Vercel auto-deploy | Push-to-deploy; no separate CI configuration needed |

## 30. Security Considerations

- Row-level security (RLS) policies in Supabase enforce that users can only read/write their own plants, reminders, and detections at the database layer — not just hidden by the UI.

- All traffic served over HTTPS (default on Vercel); no plaintext credentials or tokens in client-side code.

- Uploaded images validated for file type and size before being sent to the disease-detection API, both to control cost and to reduce abuse surface.

- Disease-detection and weather endpoints rate-limited per user to control free-tier API quota consumption and deter scraping.

- Payments are handled entirely in Razorpay's sandbox; the project explicitly does not take or store real card data, which also avoids any PCI-DSS obligation for the student build.

- Passwords are never handled directly — delegated entirely to Supabase Auth / Google OAuth.

- Data principles (collection limited to what features need, ability to delete one's account and data) are followed in spirit of India's Digital Personal Data Protection Act, even though full compliance tooling is out of scope for a demo build.

## 31. Scalability Considerations

The MVP architecture (Section 26) is intentionally a managed-services monolith. That is the right choice at zero-to-low traffic and should not be over-engineered away for a demo — but it is worth showing awareness of what changes if PlantNest ever needed to scale beyond a free tier:

- Vercel's serverless functions already scale horizontally without configuration, so the API layer is not the first bottleneck.

- Weather and disease-API responses can be cached (a weather_cache table already exists in the schema, Section 24) to cut both latency and third-party API cost as usage grows.

- A CDN in front of Supabase Storage would reduce image load time once the user base is geographically spread.

- If a single Postgres instance becomes a bottleneck, read replicas are a Supabase-supported next step before any move to microservices.

- Disease detection could move from a third-party API to a self-hosted or fine-tuned model only once usage volume justifies the cost of that infrastructure — not before.

## 32. Analytics Requirements

| **Category** | **Events / metrics to track** |
| --- | --- |
| Activation | Signup completed, onboarding completed, first plant added, first detection run |
| Engagement | DAU/MAU, reminders completed vs. missed, posts created, detections per active user |
| Monetisation | Free-to-Premium conversion rate, marketplace orders, GMV, consultation bookings |
| Retention | D1 / D7 / D30 retention, churn from Premium back to Free |
| AI quality (proxy) | Detections marked “helpful” vs. “not helpful” by the user, since true diagnostic accuracy cannot be measured without ground truth |

Recommended tooling: a simple custom events table in Supabase (sufficient for demo purposes, and lets the dashboard itself be shown live as a feature) or Vercel Analytics / PostHog's free tier if a ready-made dashboard is preferred over building one.

## 33. Development Roadmap

![Figure 6. 12-week solo development roadmap](images/figure-6-roadmap.png)

*Figure 6. 12-week solo development roadmap*

The three milestone checkpoints in the diagram are deliberately the dates to share with a project guide or mentor for interim review, since each represents a genuinely demoable state of the product, not just “progress”:

- End of Week 4: the AI detection → reminder loop works start to finish, even with a rough UI.

- End of Week 8: a stranger could sign up, add a plant, diagnose it, browse the marketplace, and post to the community without help.

- End of Week 12: demo-ready — seeded with realistic data, deployed, and rehearsed (Section 36).

## 34. Risks and Mitigation Strategies

| **Risk** | **Impact** | **Mitigation** |
| --- | --- | --- |
| Free-tier API rate limit hit during a live demo (Wi-Fi, multiple test runs) | High — breaks the centrepiece feature live in front of evaluators | Pre-test the exact demo photos beforehand; keep a recorded screen-capture backup video ready to play if live calls fail |
| Scope creep — reverting to the original “everything is MVP” plan | High — risks a shallow, half-working build by submission | Treat Section 12's MVP list as fixed; anything new goes into Phase 2/3/Future, not into the current sprint |
| AI disease detection gives a wrong or low-confidence result on stage | Medium — undermines trust in the core feature | Lean into the confidence-threshold design (Section 13.3) as a feature, not a flaw, during the demo narrative |
| Solo-developer time conflicts with coursework deadlines | Medium — compresses the 12-week timeline | Weekly milestone checkpoints (Section 33) surface slippage early rather than at week 11 |
| Evaluators question real-world traction / authenticity of demo data | Medium — college projects are often judged partly on realism | Seed believable, varied demo data (real-sounding nursery names, varied plant species, a realistic order history) rather than obviously fake placeholder content |
| Payment/commerce flow misunderstood as handling real money | Low — but a legal/ethical question if raised | State explicitly, including in the demo narration, that Razorpay is in Test Mode and no real transactions occur |

## 35. Future Expansion Opportunities

- Native mobile app (React Native), sharing the existing Supabase backend without a rewrite.

- IoT integration — soil-moisture sensors and automated drip irrigation feeding directly into the reminders system.

- A genuinely trained, fine-tuned disease-detection model once enough labelled detection history (with user-confirmed outcomes) has accumulated to be a useful training set.

- Society-level or building-level community groups, turning the map feature (Section 19) into shared terrace-garden coordination.

- B2B research partnerships (e.g. anonymised, aggregated disease-trend data licensed to agricultural research institutions) — explored only as a long-term, consent-based, clearly-disclosed option, and deliberately not built into the core business model given the privacy sensitivities involved (see the note in Section 10 on trust).

- Multi-language support, starting with Hindi and Marathi given the initial Mumbai/Pune target geography.

## 36. Presentation & Demo Strategy for College Evaluation

### Suggested live demo flow (5–7 minutes)

- Open with the problem, concretely: a real (or realistic) photo of a sick balcony plant and the question “what would you do?”

- Sign in and show the onboarding — keep this under 30 seconds, it is not the interesting part.

- Run a live disease detection on a pre-tested photo; narrate the confidence score and what happens if it were low.

- Show the treatment recommendation flowing into a marketplace product, and complete a sandboxed checkout.

- Show a care reminder being completed and the weather-based advisory.

- Quickly show the community feed and an expert's booking page — these can be faster since they are more familiar UI patterns to an evaluator.

- Close on the roadmap and business model slide (Section 33 and Section 16), to show the project was scoped, not just coded.

### Risk management for demo day

- Have a recorded screen-capture video of the full flow ready as a fallback if venue Wi-Fi fails or an API quota is exhausted.

- Seed the database with realistic data beforehand; never demo against an empty database.

- Prepare one slide summarising what was deliberately deferred (Section 14) and why — evaluators tend to respond well to scoping honesty, and it pre-empts the “why doesn't it have X” question.

### Suggested supporting materials

- This PRD, as the written deliverable.

- A one-page architecture + roadmap slide (Sections 26 and 33) for the pitch deck, since both diagrams are already built and reusable.

- A short (under 2 minute) backup demo video, recorded once the build is feature-complete in Week 11.