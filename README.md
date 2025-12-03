# 🚀 Multi-Tenant Headless CMS

A high-performance, scalable Content Management System built with **Next.js 15**, **Supabase**, and **On-Demand ISR**.

This project demonstrates a "Hub and Spoke" architecture where a single **Admin Dashboard** manages content for multiple, isolated **Client Sites**.

---

## 🌟 Key Features

### 🏢 Multi-Tenancy
-   **Single Database**: All data lives in one Supabase instance, logically separated by `company_id`.
-   **Isolated Frontends**: Each client site is a separate deployment that only fetches its own data.
-   **Scalable**: Add new tenants instantly without changing the database schema.

### ⚡ Performance (ISR)
-   **Static Speed**: All blog pages are pre-rendered as static HTML (0ms TTFB).
-   **Dynamic Updates**: When you publish a post, the Admin Dashboard triggers a webhook to rebuild *only* that specific page instantly.
-   **No Stale Content**: Users always see the latest version without waiting for a full site rebuild.

### 🛡️ Security
-   **Admin Authentication**: Password-protected dashboard with HTTP-Only cookies.
-   **Secure Webhooks**: Revalidation endpoints are protected by a shared secret token.
-   **Middleware**: Route protection ensures unauthorized users cannot access the admin panel.

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS
-   **Backend**: Next.js Server Actions
-   **Database**: Supabase (PostgreSQL)
-   **Deployment**: Vercel (Edge Network)

---

## 📂 Project Structure

This monorepo contains two main applications:

1.  **`cms-task` (Root)**: The Admin Dashboard.
    *   `src/app`: Dashboard pages and Server Actions.
    *   `src/components`: UI components (Company Registration, Post Editor).
2.  **`client-site` (Folder)**: The Template for Client Websites.
    *   `src/app/blog/[slug]`: Dynamic blog post pages.
    *   `src/app/api/revalidate`: The ISR webhook endpoint.

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js 18+
-   A Supabase account

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=admin123
REVALIDATION_SECRET=super_secure_token_123
```

### 3. Run the Admin Dashboard
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. Run a Client Site
Open a new terminal:
```bash
cd client-site
npm install
# Create .env.local here too with the same variables + NEXT_PUBLIC_COMPANY_ID
npm run dev
# Runs on http://localhost:3001
```

---

## 🤝 Contributing

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
