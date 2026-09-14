# Al Insaf General Hospital Ltd. (AIGH) - Web Application

An enterprise-grade hospital web application & administrative platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **raw MongoDB driver**, and **Cloudinary**.

---

## 🚀 One-Click Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Al Insaf General Hospital Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository.
3. Framework Preset: **Next.js** (Auto-detected).

### 3. Add Environment Variables in Vercel Project Settings:

| Environment Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster0.mongodb.net/al_insaf_hospital?retryWrites=true&w=majority` |
| `MONGODB_DB` | Database Name | `al_insaf_hospital` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret | `your_api_secret` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public Cloud Name | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`| Cloudinary Upload Preset | `hospital_uploads` |
| `JWT_SECRET` | 32+ character secret string | `super_secure_hospital_jwt_secret_key_change_in_production_2026_xyz!@#` |
| `ADMIN_DEFAULT_EMAIL` | Admin Login Email | `admin@hospital.com` |
| `ADMIN_DEFAULT_PASSWORD` | Admin Login Password | `AdminHospital@2026#Secure` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate Limit Requests/Min | `30` |
| `RATE_LIMIT_WINDOW_MS` | Rate Limit Window (ms) | `60000` |
| `NEXT_PUBLIC_HOSPITAL_NAME` | Hospital Name | `Al Insaf General Hospital` |
| `NEXT_PUBLIC_HOSPITAL_PHONE` | Hospital Hotline | `09666 787800` |
| `NEXT_PUBLIC_HOSPITAL_EMAIL` | Contact Email | `info@alinsafhospital.com` |
| `NEXT_PUBLIC_HOSPITAL_ADDRESS` | Address | `House 08, Road 02, Dhanmondi, Dhaka-1205, Bangladesh` |
| `NEXT_PUBLIC_APP_URL` | Vercel Domain / Custom Domain | `https://your-domain.vercel.app` |

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Initializing MongoDB Data
Once deployed (or locally):
1. Navigate to `/admin/login`.
2. Login with:
   - **Email:** `admin@hospital.com`
   - **Password:** `AdminHospital@2026#Secure`
3. Click the **"Seed Initial Data"** button on the dashboard to populate all 24+ medical departments, doctors, tariffs, and news.

---

## 🔐 Security Features
- **Strict Content Security Policy (CSP)** & HTTP security headers (`HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
- **Sliding-window IP Rate Limiting** on appointment booking, contact inquiries, and admin authentication.
- **Anti-Bot Honeypots** on public booking and inquiry forms.
- **NoSQL Injection prevention** & input sanitization via `zod`.
- **HTTP-Only JWT cookies** protecting admin routes.
# al-insaf-general-hospital
