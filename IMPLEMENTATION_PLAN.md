# Al Insaf General Hospital — Full Master Implementation & Architecture Plan

**Project Name:** Al Insaf General Hospital Web Platform & CMS  
**Framework:** Next.js 14 (App Router) with TypeScript  
**Repository:** `https://github.com/aponanwar/al-insaf-general-hospital.git`  
**License:** Private / Proprietary  

---

## 1. Project Overview & Architectural Vision

The Al Insaf General Hospital web platform is a modern, enterprise-grade healthcare management system and patient portal. It bridges the gap between public hospital transparency (doctor visiting schedules, bed tariffs, pathology rates, online serial booking) and a secure Administrative CMS (Content Management System) for hospital operations.

### Architectural Philosophy:
1. **Zero Cold-Start Lag:** Public pages render with immediate static fallback data (`seed-data.ts`) while asynchronously hydrating from MongoDB.
2. **Serverless Resilience:** Database connections utilize connection pooling with cached promises (`global._mongoClientPromise`) to thrive in serverless environments like Vercel.
3. **Defense in Depth:** Multiple independent security layers (sliding-window rate limiting, deep NoSQL sanitization, honeypot bot trap, CSRF headers, HTTP-only JWT cookies).
4. **Developer Experience & Maintainability:** Modular folder structure where API routes, administrative screens, and public views share strongly-typed TypeScript interfaces.

---

## 2. Technology Stack & JSON Packages Breakdown

Every package in [`package.json`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/package.json) was chosen with deliberate intent:

| Package | Version | Why It Was Chosen | How It Works & Role |
|---|---|---|---|
| **`next`** | `^14.2.20` | Core Fullstack Framework | Provides React Server Components, App Router (`src/app`), API route handlers (`route.ts`), file-system routing, and production build optimization. |
| **`react` & `react-dom`** | `^18.3.1` | UI Library | Handles component state, rendering cycle (`useState`, `useEffect`), and interactive client-side interfaces. |
| **`mongodb`** | `^6.12.0` | Official Native MongoDB Driver | Chosen over Mongoose to eliminate heavy ODM overhead, reduce memory usage, and provide direct, fast connection pooling in serverless environments. |
| **`jose`** | `^5.9.6` | Modern Edge/Node JWT Library | Zero-dependency, lightweight, Edge-runtime compatible library for signing (`SignJWT`) and verifying (`jwtVerify`) HS256 tokens. Far lighter and faster than legacy `jsonwebtoken`. |
| **`bcryptjs`** | `^2.4.3` | Password Hashing | Pure JavaScript implementation of bcrypt. Hashes administrative passwords with 12 salt rounds (`hashPassword`), immune to rainbow table attacks. |
| **`cloudinary`** | `^2.5.1` | Media Storage & Optimization | Cloud CDN storage for doctor photos and hospital notices, removing media bandwidth burden from the Next.js server. |
| **`lucide-react`** | `^0.468.0` | Iconography | Clean, consistent, tree-shakeable SVG icon set representing medical, administrative, and status symbols. |
| **`tailwindcss`** | `^3.4.16` | Utility-First CSS | Generates minimal utility classes at build time with custom hospital green and navy slate design tokens. |
| **`clsx` & `tailwind-merge`** | `^2.1.1` / `^2.5.5` | Dynamic Class Merging | Safely concatenates conditional CSS classes without specificity conflicts. |
| **`zod`** | `^3.24.1` | Schema Validation | Runtime type validation for appointment bookings and incoming JSON payloads. |
| **`typescript`** | `^5.7.2` | Static Type Safety | Eliminates runtime bugs across data models, API payloads, and component props. |

---

## 3. Database Architecture, Connection & Pooling

### Why Native MongoDB Driver instead of Mongoose?
- **Serverless Friendly:** Mongoose creates heavy internal schema caches and models that can leak memory or recompile across Vercel function instances.
- **Connection Speed:** The raw `mongodb` driver connects directly with lightweight BSON serialization.
- **Custom Generics:** We implemented `getCollection<T>(name)` which gives full TypeScript compile-time safety without Mongoose runtime overhead.

### Connection Pooling Architecture ([`src/lib/mongodb.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/mongodb.ts))
In Node.js serverless environments, global scope persists across warm lambda invocations. We leverage this using a global connection promise cache:

```typescript
// src/lib/mongodb.ts
let client: MongoClient;

const options = {
  maxPoolSize: 10,              // Up to 10 concurrent connections per container
  minPoolSize: 1,               // Keeps 1 warm connection ready
  serverSelectionTimeoutMS: 4000, // Fails fast within 4 seconds if DB is unreachable
  socketTimeoutMS: 30000,       // 30-second socket timeout for long queries
};

export async function getConnectedClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  try {
    return await global._mongoClientPromise;
  } catch (err) {
    global._mongoClientPromise = undefined; // Reset on failure for automatic reconnection
    throw err;
  }
}
```

### Database Collections & Schema Design:
1. **`users`**: Administrative and staff credentials (`name`, `email`, `passwordHash`, `role`, `createdAt`).
2. **`rates`**: Hospital tariffs, cabin fees, ICU charges, diagnostic investigations (`category`, `code`, `name`, `fee`, `unit`, `description`).
3. **`doctors`**: Physician profiles, OPD visiting hours, consultation fees, image URLs (`name`, `slug`, `department`, `designation`, `qualifications`, `roomNumber`, `visitingHours`, `visitingDays`, `consultationFee`, `imageUrl`, `isActive`).
4. **`departments`**: Medical units (`name`, `slug`, `iconName`, `shortDescription`, `fullDescription`, `facilities`, `headOfDepartment`, `imageUrl`, `isActive`).
5. **`appointments`**: Patient booking records (`trackingId`, `patientName`, `patientPhone`, `patientEmail`, `patientAge`, `patientGender`, `doctorId`, `doctorName`, `department`, `appointmentDate`, `preferredTimeSlot`, `status`, `adminNotes`).
6. **`inquiries`**: Public contact form messages (`name`, `email`, `phone`, `subject`, `message`, `status`, `createdAt`).
7. **`news`**: Hospital announcements, health tips, notices (`title`, `slug`, `category`, `summary`, `content`, `imageUrl`, `publishDate`).
8. **`testimonials`**: Verified patient feedback (`patientName`, `department`, `rating`, `comment`, `date`, `verified`).

---

## 4. Middleware, Security & Protection Layers

### Layer 1: Sliding Window Rate Limiter ([`src/lib/rate-limit.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/rate-limit.ts))
- **Mechanism:** In-memory sliding time window mapped per client IP.
- **Header Inspection:** Accurately extracts client IP behind proxies using `x-forwarded-for`, `x-real-ip`, and Cloudflare's `cf-connecting-ip`.
- **Automatic Garbage Collection:** Stale IP records are swept every 5 minutes to eliminate memory leaks.
- **Enforcement:** Login endpoint throttles to 15 attempts/minute; appointment submissions throttle to 30 requests/minute. Returns HTTP 429 with `Retry-After` header.

### Layer 2: NoSQL Injection Deep Sanitizer ([`src/lib/security.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/security.ts))
- **Problem:** MongoDB query selectors can be exploited if an attacker submits JSON like `{"email": {"$ne": ""}}`.
- **Solution:** `sanitizeObject<T>()` recursively traverses all keys in incoming payloads and immediately throws an error if any key begins with `$` or contains `.`.

### Layer 3: Anti-Bot Honeypot Protection
- Forms include hidden fields (`website_url`, `hp_field`). Automated spambots fill all form inputs; humans do not. If filled, the request is immediately rejected.

### Layer 4: HTTP-Only JWT Session Security ([`src/lib/auth.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/auth.ts))
- JWT tokens are signed using HS256 with an environment secret (`JWT_SECRET`).
- Tokens are stored in an `httpOnly`, `sameSite: 'lax'`, `secure: true` (in production) cookie (`hospital_admin_token`), inaccessible to JavaScript, protecting against XSS token theft.

---

## 5. Next.js, Webpack & Server Configuration

### Configuration File: [`next.config.mjs`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/next.config.mjs)
- **`poweredByHeader: false`**: Hides `X-Powered-By: Next.js` response header to prevent technology fingerprinting.
- **Security Headers:**
  - `Strict-Transport-Security`: Enforces HTTPS for 2 years (`max-age=63072000`).
  - `X-Frame-Options: DENY`: Prevents Clickjacking attacks by forbidding iframe embeds.
  - `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin`: Controls referral information leakage.
  - `Permissions-Policy`: Restricts unauthorized hardware access (camera, mic, geolocation).
- **Image Optimization Domains:**
  - `res.cloudinary.com`
  - `images.unsplash.com`
  - `popular-hospital.com`

---

## 6. Tailwind CSS & Design System

### Configuration File: [`tailwind.config.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/tailwind.config.ts)
- **Primary Color (Medical Green):**
  - `#0b9e53` (500) — Signature hospital emerald green for CTAs, success states, and primary actions.
  - Light variants (`50`, `100`) for subtle background badges.
- **Navy Slate (Header & Dark Mode elements):**
  - `#384349` (DEFAULT) — Top bar slate for high-contrast executive appearance.
  - `#1e2428` (900) — Deep slate for admin sidebar and navigation headers.
- **Typography:**
  - Clean sans-serif hierarchy based on `Roboto`, `system-ui`, and `-apple-system`.

---

## 7. Feature Architecture & Workflows

### 1. Hospital Rate Charts & Tariffs (CRUD)
- **Database Collection:** `rates`
- **Backend API:** [`src/app/api/rates/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/rates/route.ts)
  - `GET`: Supports category filter (`?category=...`) and instant search (`?search=...`). Fallback to `INITIAL_RATES` if DB is offline.
  - `POST`: Adds new tariff with positive number validation (Admin only).
  - `PUT`: Updates existing tariff fees, units, or names by `_id` (Admin only).
  - `DELETE`: Removes tariff by `_id` or `code` (Admin only).
- **Admin Dashboard:** [`src/app/admin/rates/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/rates/page.tsx) with search, category pills, add/edit modal, and delete confirmation.
- **Public Page:** [`src/app/patient-guide/rates/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/patient-guide/rates/page.tsx) with dynamic live fetching, instant filtering, and print-ready rate chart styling.

### 2. Multi-Admin & Staff Management
- **Database Collection:** `users`
- **Backend API:** [`src/app/api/admin/users/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/admin/users/route.ts)
  - `GET`: Returns list of administrators without exposing password hashes.
  - `POST`: Creates new admin account with bcrypt hashing and email uniqueness validation.
  - `DELETE`: Deletes admin account (prevents deleting currently logged-in admin or the last remaining admin).
- **Admin Page:** [`src/app/admin/users/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/users/page.tsx) for authorizing, creating, and removing admin users.

### 3. Doctors & OPD Visiting Schedule
- **Database Collection:** `doctors`
- **Backend API:** [`src/app/api/doctors/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/doctors/route.ts)
- **Admin Management:** [`src/app/admin/doctors/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/doctors/page.tsx) to add doctors, upload photos, and configure room numbers and OPD hours.
- **Public Page:** [`src/app/doctors/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/doctors/page.tsx) with department filters and visiting days tabs.

### 4. Online Appointment Booking & Serial Tracking
- **Database Collection:** `appointments`
- **Backend API:** [`src/app/api/appointments/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/appointments/route.ts)
- **Client Booking:** Generates unique tracking ID (e.g. `APT-2026-9214`).
- **Admin Workflow:** [`src/app/admin/appointments/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/appointments/page.tsx) to filter by status (Pending, Confirmed, Cancelled, Completed) and update bookings.

### 5. Database Seeding System
- **File:** [`src/app/api/seed/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/seed/route.ts)
- **Trigger:** Click "Seed Initial Data" on the Admin Dashboard or `POST /api/seed`.
- **Idempotency:** Uses `countDocuments() === 0` before inserting to guarantee existing data is never wiped out.

---

## 8. Where to Modify & How to Modify (Developer Guide)

| To Do This... | Modify This File | How to Do It |
|---|---|---|
| **Add a new test fee or cabin rate** | Dashboard UI (`/admin/rates`) OR [`src/lib/seed-data.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/seed-data.ts) | Add to the `INITIAL_RATES` array or use the Admin Dashboard Add Tariff modal. |
| **Add a new Doctor** | Dashboard UI (`/admin/doctors`) OR [`src/lib/seed-data.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/seed-data.ts) | Use the Doctor form in admin or add an object conforming to the `Doctor` interface. |
| **Change Brand Colors** | [`tailwind.config.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/tailwind.config.ts) | Update `theme.extend.colors.primary` or `navy` hex codes. |
| **Change Allowed Image Domains** | [`next.config.mjs`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/next.config.mjs) | Add a new entry to `images.remotePatterns`. |
| **Adjust Rate Limiting Limits** | [`.env.local`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/.env.local) | Change `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`. |
| **Add a New Data Collection** | [`src/lib/types.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/types.ts) & [`src/app/api/`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/) | Define interface in `types.ts`, create `src/app/api/<name>/route.ts` using `getCollection('<name>')`. |

---

## 9. Multi-Device Git Collaboration (PC & Mac)

### Daily Cycle:
1. **On your PC after work:**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin main
   ```
2. **On your Mac before work:**
   ```bash
   git pull origin main
   ```
3. **On your Mac after work:**
   ```bash
   git add .
   git commit -m "Mac updates"
   git push origin main
   ```
4. **Back on your PC before work:**
   ```bash
   git pull origin main
   ```

*Note: Environment variables (`.env.local`) are never committed to GitHub for security. Maintain a local copy of `.env.local` on both machines.*
