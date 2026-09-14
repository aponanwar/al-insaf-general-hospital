# আল ইনসাফ জেনারেল হাসপাতাল — পূর্ণাঙ্গ মাস্টার ইমপ্লিমেন্টেশন ও আর্কিটেকচার গাইড

**প্রজেক্টের নাম:** আল ইনসাফ জেনারেল হাসপাতাল ওয়েব প্ল্যাটফর্ম ও সিএমএস  
**ফ্রেমওয়ার্ক:** Next.js 14 (App Router) + TypeScript  
**গিটহাব রিপোজিটরি:** `https://github.com/aponanwar/al-insaf-general-hospital.git`  
**লাইসেন্স:** প্রাইভেট / প্রোপ্রাইটরি  

---

## ১. প্রজেক্টের সামগ্রিক পরিচিতি ও লক্ষ্য (Project Overview & Vision)

আল ইনসাফ জেনারেল হাসপাতাল ওয়েব প্ল্যাটফর্মটি একটি আধুনিক, দ্রুতগতির এবং আন্তর্জাতিক মানের হাসপাতাল ম্যানেজমেন্ট সিস্টেম। এটি সাধারণ রোগীদের জন্য স্বচ্ছ স্বাস্থ্যসেবার তথ্য (ডাক্তারদের ওপিডি সময়সূচি, কেবিনের ভাড়া, আইসিইউ ও ডায়াগনস্টিক পরীক্ষার ফি চার্ট এবং অনলাইন সিরিয়াল বুকিং) প্রদানের পাশাপাশি হাসপাতাল প্রশাসনের জন্য একটি সুরক্ষিত ও শক্তিশালী **Administrative CMS (Content Management System)** পরিচালনা করে।

### প্রধান আর্কিটেকচারাল বৈশিষ্ট্য:
1. **জিরো কোল্ড-স্টার্ট ফ্লিকার (Instant Fallback):** ডাটাবেজ অফলাইন থাকলেও পাবলিক পেজগুলো সিড ডাটা দিয়ে তাৎক্ষণিকভাবে লোড হয়, ফলে রোগী কখনো খালি পেজ বা ক্র্যাশ দেখতে পান না।
2. **সার্ভারলেস কানেকশন পুলিং (Serverless Pooling):** Vercel বা নোডজেএস ক্লাউডে বারবার নতুন কানেকশন তৈরি রোধ করতে `global._mongoClientPromise` দিয়ে কানেকশন ক্যাশ ও পুলিং করা হয়েছে।
3. **বহুস্তরী নিরাপত্তা (Defense in Depth):** রেট লিমিটিং, নো-এসকিউএল ইনজেকশন ডিপ ক্লিনার, বট ট্র্যাপ হানিপট এবং সুরক্ষিত HTTP-Only কুকি।
4. **সহজ মেইনটেন্যান্স (Developer Friendly):** সম্পূর্ণ প্রজেক্টে স্ট্রংলি-টাইপড TypeScript ইন্টারফেস ব্যবহার করা হয়েছে।

---

## ২. প্রযুক্তি এবং প্যাকেজসমূহ কেন ব্যবহার করা হয়েছে? (Packages & Dependencies)

[`package.json`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/package.json) ফাইলে থাকা প্রতিটি প্যাকেজের প্রয়োজনীয়তা ও কাজের ভূমিকা নিচে ব্যাখ্যা করা হলো:

| প্যাকেজের নাম | ভার্সন | কেন এটি ব্যবহার করা হয়েছে? | কীভাবে কাজ করে এবং ভূমিকা কী? |
|---|---|---|---|
| **`next`** | `^14.2.20` | মূল ফুলস্ট্যাক ফ্রেমওয়ার্ক | সার্ভার কম্পোনেন্ট, ফোল্ডার-বেসড রাউটিং (`src/app`), সার্ভারলেস API রাউটস (`route.ts`) এবং বিল্ট-ইন বিল্ড অপ্টিমাইজেশন পরিচালনা করে। |
| **`react` & `react-dom`** | `^18.3.1` | ইউজার ইন্টারফেস (UI) লাইব্রেরি | ইন্টারঅ্যাক্টিভ ক্লায়েন্ট পেজ, কম্পোনেন্ট স্টেট (`useState`), সাইড-ইফেক্ট ও ডাটা ফেচিং (`useEffect`) পরিচালনা করে। |
| **`mongodb`** | `^6.12.0` | অফিশিয়াল নেটিভ মঙ্গোডিবি ড্রাইভার | Mongoose-এর মতো ভারী ওআরএম পরিহার করে মেমোরি খরচ কমাতে এবং সার্ভারলেস ক্লাউডে দ্রুততম কানেকশন পুলিং নিশ্চিত করতে এটি ব্যবহৃত হয়েছে। |
| **`jose`** | `^5.9.6` | আধুনিক ও হালকা JWT লাইব্রেরি | পুরানো `jsonwebtoken` প্যাকেজের বদলে এটি এজ-কম্প্যাটিবল ও অনেক দ্রুত। এটি অ্যাডমিন সেশনের জন্য HS256 টোকেন সাইন ও ভেরিফাই করে। |
| **`bcryptjs`** | `^2.4.3` | ক্রিপ্টোগ্রাফিক পাসওয়ার্ড হ্যাশিং | অ্যাডমিনদের পাসওয়ার্ড ১২ রাউন্ড সল্ট দিয়ে একমুখী এনক্রিপশন (Hash) করে, ফলে ডেটাবেজ লিক হলেও পাসওয়ার্ড জানা অসম্ভব। |
| **`cloudinary`** | `^2.5.1` | ক্লাউড ইমেজ স্টোরেজ ও সিডিএন | ডাক্তারদের ছবি ও হাসপাতালের প্রেসক্রিপশন/নোটিশ ক্লাউডে প্রসেস ও কম্প্রেস করে দ্রুত সরবরাহ করে। |
| **`lucide-react`** | `^0.468.0` | ভেক্টর আইকন সেট | হালকা ও পরিচ্ছন্ন এসভিজি আইকন লাইব্রেরি (ডাক্তার, স্টেথোস্কোপ, রেট চার্ট, ক্যালেন্ডার ইত্যাদি)। |
| **`tailwindcss`** | `^3.4.16` | ইউটিলিটি-ফার্স্ট সিএসএস | দ্রুত ও সুন্দর রেসপন্সিভ ডিজাইন তৈরি করতে এবং প্রোডাকশনে অতি ক্ষুদ্র সাইজের সিএসএস ফাইল জেনারেট করতে ব্যবহৃত। |
| **`clsx` & `tailwind-merge`** | `^2.1.1` / `^2.5.5` | ডাইনামিক ক্লাস মার্জার | শর্তসাপেক্ষ (Conditional) সিএসএস ক্লাস সংঘাত ছাড়া নিরাপদে যুক্ত করে। |
| **`zod`** | `^3.24.1` | স্কিমা ভ্যালিডেশন | বুকিং ফর্ম এবং এপিআই-তে আসা ডাটার টাইপ ও সঠিকতা রানটাইমে যাচাই করে। |
| **`typescript`** | `^5.7.2` | স্ট্যাটিক টাইপ চেকিং | কোড লেখার সময় ভুল টাইপ ধরা এবং রানটাইম ক্র্যাশ সম্পূর্ণ প্রতিরোধ করে। |

---

## ৩. ডাটাবেজ আর্কিটেকচার, কানেকশন ও পুলিং (Database & Connection Pooling)

### কেন Mongoose-এর বদলে Raw MongoDB Driver ব্যবহার করা হলো?
- **সার্ভারলেস সুবিধা:** Mongoose ক্লাউড ল্যাম্বডা ফাংশনে বারবার মডেল রিকম্পাইল করে মেমোরি লিক ঘটাতে পারে। নেটিভ ড্রাইভার সরাসরি ও দ্রুত কাজ করে।
- **কানেকশন স্পিড:** সরাসরি BSON সিরিয়ালাইজেশনের কারণে কুয়েরি অনেক ফাস্ট হয়।
- **কাস্টম জেনেরিক টাইপিং:** আমরা `getCollection<T>(name)` হেল্পার তৈরি করেছি যা কোনো বাড়তি লোড ছাড়াই TypeScript টাইপ সেফটি দেয়।

### কানেকশন পুলিংয়ের কার্যপ্রণালী ([`src/lib/mongodb.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/mongodb.ts))
Node.js সার্ভারলেস পরিবেশে একাধিক রিকোয়েস্টে একই কানেকশন ব্যবহারের জন্য গ্লোবাল প্রমিজ ক্যাশ করা হয়েছে:

```typescript
// src/lib/mongodb.ts
let client: MongoClient;

const options = {
  maxPoolSize: 10,              // এক সাথে সর্বোচ্চ ১০টি কানেকশন পুলিং
  minPoolSize: 1,               // অন্তত ১টি কানেকশন সর্বদা সচল থাকে
  serverSelectionTimeoutMS: 4000, // ৪ সেকেন্ডের মধ্যে কানেক্ট না হলে এরর দিয়ে হ্যান্ডেল করবে
  socketTimeoutMS: 30000,       // বড় কুয়েরির জন্য ৩০ সেকেন্ড সকেট টাইমআউট
};

export async function getConnectedClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  try {
    return await global._mongoClientPromise;
  } catch (err) {
    global._mongoClientPromise = undefined; // ফেইল করলে ক্যাশ ক্লিয়ার করে যাতে পুনরায় কানেক্ট হতে পারে
    throw err;
  }
}
```

### ডাটাবেজ কালেকশনসমূহ ও তাদের স্কিমা:
1. **`users`**: অ্যাডমিন ও স্টাফদের অ্যাকাউন্ট (`name`, `email`, `passwordHash`, `role`, `createdAt`)।
2. **`rates`**: হাসপাতালের টেস্ট ফি, কেবিনের ভাড়া, আইসিইউ ও ওটি চার্জ (`category`, `code`, `name`, `fee`, `unit`, `description`)।
3. **`doctors`**: বিশেষজ্ঞ ডাক্তারদের প্রোফাইল ও ওপিডি ভিজিটিং শিডিউল (`name`, `slug`, `department`, `designation`, `qualifications`, `roomNumber`, `visitingHours`, `visitingDays`, `consultationFee`, `imageUrl`, `isActive`)।
4. **`departments`**: হাসপাতালের চিকিৎসা বিভাগসমূহ (`name`, `slug`, `iconName`, `shortDescription`, `fullDescription`, `facilities`, `headOfDepartment`, `imageUrl`, `isActive`)।
5. **`appointments`**: রোগীদের অনলাইন সিরিয়াল ও বুকিং ডাটা (`trackingId`, `patientName`, `patientPhone`, `doctorName`, `appointmentDate`, `status`, `adminNotes`)।
6. **`inquiries`**: রোগীর সাধারণ মেসেজ ও প্রশ্ন (`name`, `email`, `phone`, `subject`, `message`, `status`, `createdAt`)।
7. **`news`**: হাসপাতালের নোটিশ, হেলথ টিপস ও ইভেন্ট (`title`, `slug`, `category`, `summary`, `content`, `imageUrl`, `publishDate`)।
8. **`testimonials`**: ভেরিফাইড রোগীদের রিভিউ (`patientName`, `department`, `rating`, `comment`, `date`, `verified`)।

---

## ৪. সিকিউরিটি লেয়ার ও মিডলওয়্যার (Security & Protection)

### স্তর ১: রেট লিমিটিং স্লাইডিং উইন্ডো ([`src/lib/rate-limit.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/rate-limit.ts))
- প্রতিটি আইপির রিকোয়েস্ট মেমোরিতে ট্র্যাক করা হয়।
- প্রক্সি বা ক্লাউডফ্লেয়ারের পেছনেও আসল আইপি ট্র্যাক করতে `x-forwarded-for`, `x-real-ip` এবং `cf-connecting-ip` পড়া হয়।
- প্রতি ৫ মিনিট পর পর পুরানো আইপি রেকর্ড স্বয়ংক্রিয়ভাবে মেমোরি থেকে মুছে ফেলা হয়।
- লিমিট অতিক্রম করলে HTTP 429 স্ট্যাটাস এবং কতক্ষণ পর পুনরায় চেষ্টা করতে হবে (`Retry-After`) তা জানিয়ে দেওয়া হয়।

### স্তর ২: NoSQL ইনজেকশন ক্লিনার ([`src/lib/security.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/security.ts))
- হ্যাকাররা যদি JSON পেলোডের মাধ্যমে অপারেটর পাঠায় (যেমন: `{"$ne": ""}` বা `{"$where": ...}`), তবে `sanitizeObject()` ফাংশন পুরো অবজেক্ট স্ক্যান করে কোনো কি-তে `$` বা `.` পেলেই তাৎক্ষণিক রিকোয়েস্ট ব্লক করে দেয়।

### স্তর ৩: অ্যান্টি-বট হানিপট ফাঁদ (Anti-Bot Honeypot)
- বুকিং ফর্মে লুকায়িত ফিল্ড (`website_url` বা `hp_field`) থাকে যা সাধারণ মানুষের চোখে পড়ে না। কিন্তু স্বয়ংক্রিয় স্প্যাম-বটগুলো সব ফিল্ড পূরণ করে। তাই এই ফিল্ডে কোনো ডাটা থাকলে স্বয়ংক্রিয়ভাবে রিকোয়েস্ট বাতিল করা হয়।

### স্তর ৪: সুরক্ষিত HTTP-Only JWT সেশন ([`src/lib/auth.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/auth.ts))
- অ্যাডমিন টোকেন ব্রাউজারের সাধারণ লোকালস্টোরেজে রাখা হয় না।
- এটি `httpOnly`, `sameSite: 'lax'`, `secure: true` কুকিতে সংরক্ষিত থাকে, যা জাভাস্ক্রিপ্ট দিয়ে রিড করা অসম্ভব। ফলে XSS অ্যাটাক হলেও টোকেন চুরি করা যায় না।

---

## ৫. Next.js, ওয়েবপ্যাক ও সার্ভার কনফিগারেশন ([`next.config.mjs`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/next.config.mjs))

- **`poweredByHeader: false`**: `X-Powered-By: Next.js` হেডারটি বন্ধ রাখা হয়েছে যাতে কোনো আক্রমণকারী সহজে বুঝতে না পারে কোন ফ্রেমওয়ার্ক চলছে।
- **নিরাপত্তা রেসপন্স হেডারসমূহ:**
  - `Strict-Transport-Security`: ২ বছরের জন্য শুধুমাত্র নিরাপদ HTTPS কানেকশন বাধ্যতামূলক করে।
  - `X-Frame-Options: DENY`: ক্লিকজ্যাকিং (Clickjacking) আক্রমণ প্রতিরোধে সাইটটিকে কোনো iframes-এ এম্বেড করা নিষিদ্ধ করে।
  - `X-Content-Type-Options: nosniff`: ব্রাউজার যাতে ফাইলের আসল MIME টাইপ পরিবর্তন না করে।
  - `Referrer-Policy: strict-origin-when-cross-origin`: প্রাইভেসি ও রেফারার ডাটা ফাঁস হওয়া রোধ করে।
  - `Permissions-Policy`: ক্যামেরা, মাইক্রোফোন ও লোকেশনের অননুমোদিত অ্যাক্সেস ব্লক করে।
- **অনুমোদিত ইমেজ ডোমেইন:** ক্লাউডিনারি (`res.cloudinary.com`) এবং আনস্প্ল্যাশ (`images.unsplash.com`)।

---

## ৬. টেইলউইন্ড সিএসএস ও ডিজাইন সিস্টেম ([`tailwind.config.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/tailwind.config.ts))

- **প্রাইমারি কালার (মেডিকেল গ্রিন):**
  - `#0b9e53` (500) — হাসপাতালের সিগনেচার এমারেল্ড গ্রিন যা বাটন, হাইলাইট এবং ইতিবাচক স্ট্যাটাসে ব্যবহৃত।
  - হালকা শেডস (`50`, `100`) ব্যাজ ও ফিল্টারের ব্যাকগ্রাউন্ডের জন্য।
- **নেভি স্লেট (টপ বার ও ডার্ক এলিমেন্টস):**
  - `#384349` — প্রিমিয়াম পেশাদার লুক দেওয়ার জন্য হেডার টপ বারে ব্যবহৃত।
  - `#1e2428` (900) — অ্যাডমিন ড্যাশবোর্ডের ব্যাকগ্রাউন্ড ও হেডার।
- **টাইপোগ্রাফি:** পরিষ্কার ও সহজে পাঠযোগ্য `Roboto` ও `system-ui` ফ্রন্ট ফ্যামিলি।

---

## ৭. প্রজেক্টের বিভিন্ন ফিচার ও তাদের ওয়ার্কফ্লো

### ১. হসপিটাল রেট চার্ট ও ট্যারিফ ম্যানেজমেন্ট (CRUD)
- **কালেকশন:** `rates`
- **ব্যাকএন্ড API:** [`src/app/api/rates/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/rates/route.ts)
  - `GET`: ক্যাটাগরি ও কীওয়ার্ড ফিল্টারিং করে রেট রিটার্ন করে। ডেটাবেজ বন্ধ থাকলে সিড ডাটা প্রদান করে।
  - `POST`: অ্যাডমিন প্যানেল থেকে নতুন টেস্ট বা কেবিনের ফি যুক্ত করা।
  - `PUT`: বিদ্যমান কোনো টেস্টের ফি বা নাম এডিট করা।
  - `DELETE`: কোনো টেস্ট বা সেবা বাতিল/ডিলিট করা।
- **ড্যাশবোর্ড UI:** [`src/app/admin/rates/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/rates/page.tsx) — সার্চ, ক্যাটাগরি পিলস, অ্যাড ও এডিট মডাল এবং ডিলিট কনফার্মেশন।
- **পাবলিক পেজ:** [`src/app/patient-guide/rates/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/patient-guide/rates/page.tsx) — ডায়নামিক ফেচিং ও প্রিন্ট ফ্রেন্ডলি টেবিল ভিউ।

### ২. অ্যাডমিন ও স্টাফ অ্যাকাউন্ট ম্যানেজমেন্ট
- **কালেকশন:** `users`
- **ব্যাকএন্ড API:** [`src/app/api/admin/users/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/admin/users/route.ts)
  - `GET`: সব অ্যাডমিনের তালিকা দেয় (পাসওয়ার্ড হ্যাশ গোপন রেখে)।
  - `POST`: নতুন অ্যাডমিন যোগ করে (পাসওয়ার্ড bcrypt দিয়ে হ্যাশ হয়)।
  - `DELETE`: অ্যাডমিন মুছে ফেলা (লগইন থাকা অ্যাডমিন বা একমাত্র অ্যাডমিনকে ডিলিট হওয়া থেকে রক্ষা করে)।
- **ড্যাশবোর্ড পেজ:** [`src/app/admin/users/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/users/page.tsx)।

### ৩. ডাক্তারদের প্রোফাইল ও ওপিডি শিডিউল
- **কালেকশন:** `doctors`
- **ব্যাকএন্ড API:** [`src/app/api/doctors/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/doctors/route.ts)
- **অ্যাডমিন পেজ:** [`src/app/admin/doctors/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/admin/doctors/page.tsx) — নতুন ডাক্তার যুক্ত করা, ক্লাউডিনারিতে ছবি আপলোড করা এবং ভিজিটিং সময় পরিবর্তন করা।
- **পাবলিক পেজ:** [`src/app/doctors/page.tsx`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/doctors/page.tsx)।

### ৪. ডাটাবেজ সিডিং সিস্টেম
- **ফাইল:** [`src/app/api/seed/route.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/seed/route.ts)
- **ট্রিগার:** ড্যাশবোর্ডে "Seed Initial Data" বাটন অথবা `POST /api/seed` কল করে।
- **নিরাপত্তা:** প্রতিটি কালেকশনে `countDocuments() === 0` যাচাই করে নেয়, ফলে কোনো বিদ্যমান ডাটা কখনো মুছে যায় না।

---

## ৮. কোথায় এবং কীভাবে পরিবর্তন করবেন? (Developer Modification Guide)

| আপনি যা পরিবর্তন করতে চান | কোন ফাইলে যাবেন? | কীভাবে করবেন? |
|---|---|---|
| **কোনো টেস্টের ফি পরিবর্তন বা নতুন টেস্ট যোগ** | ড্যাশবোর্ডের `/admin/rates` পেজ অথবা [`src/lib/seed-data.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/seed-data.ts) | ড্যাশবোর্ডে Edit বাটনে ক্লিক করে সরাসরি নতুন ফি লিখে দিন অথবা `seed-data.ts`-এ এন্ট্রি যোগ করুন। |
| **নতুন ডাক্তারের প্রোফাইল যোগ** | ড্যাশবোর্ডের `/admin/doctors` পেজ | ফর্ম পূরণ করে ডাক্তারের ছবি আপলোড করে সাবমিট করুন। |
| **হাসপাতালের নাম, ফোন বা ঠিকানা বদল** | [`.env.local`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/.env.local) | `NEXT_PUBLIC_HOSPITAL_NAME`, `NEXT_PUBLIC_HOSPITAL_PHONE` ভেরিয়েবলগুলো পরিবর্তন করুন। |
| **ওয়েবসাইটের থিম বা ব্র্যান্ড কালার বদল** | [`tailwind.config.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/tailwind.config.ts) | `theme.extend.colors.primary` বা `navy` এর হেক্স কোড পরিবর্তন করুন। |
| **নতুন ডাটাবেজ কালেকশন তৈরি করা** | [`src/lib/types.ts`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/lib/types.ts) ও [`src/app/api/`](file:///c:/Users/anwar/OneDrive/Desktop/AlInsafHospital/al-insaf-general-hospital/src/app/api/) | `types.ts`-এ ইন্টারফেস লিখুন, এবং `getCollection('নাম')` ব্যবহার করে নতুন রাউট তৈরি করুন। |

---

## ৯. দুটি কম্পিউটার (PC এবং Mac) থেকে গিট-এ কাজ করার প্রসেস

1. **পিসিতে কাজ শেষে গিটহাবে পাঠানো:**
   ```bash
   git add .
   git commit -m "আপনার কাজের বিবরণ"
   git push origin main
   ```
2. **ম্যাকে কাজ শুরুর আগে সর্বশেষ কোড নামানো:**
   ```bash
   git pull origin main
   ```
3. **ম্যাকে কাজ শেষ করে আবার গিটহাবে পাঠানো:**
   ```bash
   git add .
   git commit -m "ম্যাক থেকে আপডেটের বিবরণ"
   git push origin main
   ```
4. **আবার পিসিতে ফিরে এসে কাজ শুরুর আগে:**
   ```bash
   git pull origin main
   ```

*(মনে রাখবেন: `.env.local` ফাইলটি কখনো গিটহাবে পুশ হয় না। দুটি ডিভাইসেই আলাদাভাবে `.env.local` ফাইল থাকবে।)*
