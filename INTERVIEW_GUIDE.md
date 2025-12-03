# 🚀 Multi-Tenant Headless CMS: Interview Guide

Use this guide to explain your project confidently. It covers the **Architecture**, **Key Decisions**, and **"Gotcha" Answers**.

---

## 1. The "Elevator Pitch" (30 Seconds)
> "I built a **Multi-Tenant Headless CMS** designed for high performance and scalability. It consists of a central **Admin Dashboard** that manages content for multiple companies, and a **Client Site Template** that can be deployed infinitely. It uses **Next.js** for the frontend, **Supabase (PostgreSQL)** for the database, and **On-Demand ISR** to ensure pages are both static-fast and instantly updated."

---

## 2. Core Architecture

### A. The "Hub and Spoke" Model
*   **The Hub (Admin Dashboard)**: One single application where administrators log in. They can switch between companies (Tenants) and manage content.
*   **The Spokes (Client Sites)**: Separate deployments for each company.
    *   *Code Reusability*: We use the **same codebase** for every client.
    *   *Configuration*: We inject a `NEXT_PUBLIC_COMPANY_ID` environment variable at build time. This tells the site "Who am I?" and "Which posts should I fetch?".

### B. Database Design (Multi-Tenancy)
*   **Shared Database**: We use a single Supabase instance.
*   **Logical Isolation**: Every table (`post`, `companies`) has a `company_id` column.
*   **Why?**: This is cost-effective and easy to maintain for a startup/MVP. If a tenant becomes massive, we can migrate them to a dedicated database later.

### C. The "Push" Mechanism (ISR)
*   **Problem**: Static Site Generation (SSG) is fast but stale. Server-Side Rendering (SSR) is fresh but slow.
*   **Solution**: We use **Incremental Static Regeneration (ISR)**.
*   **Flow**:
    1.  Admin clicks "Publish".
    2.  Server Action saves to DB.
    3.  Server Action finds the company's domain.
    4.  It sends a **Webhook** to `https://client-site.com/api/revalidate`.
    5.  The Client Site rebuilds *only that specific page* in the background.
    6.  **Result**: The user gets a static HTML file (0ms load time) that is always up to date.

---

## 3. Key Technical Features

### 🔒 Security
*   **Authentication**: Custom implementation using **Next.js Middleware** and **HTTP-Only Cookies**.
*   **Route Protection**: Middleware intercepts requests to `/` and redirects unauthenticated users to `/login`.
*   **API Security**: The revalidation endpoint is protected by a secret token (`MY_SECRET_TOKEN`) to prevent DDoS attacks.

### 🎨 UI/UX
*   **Modern Design**: Clean, professional interface using Tailwind CSS.
*   **Feedback Loops**: Loading states, success messages, and error handling (e.g., "Invalid Password").

---

## 4. Potential Interview Questions & Answers

**Q: Why didn't you use a separate database for each tenant?**
> **A:** "For this scale, a shared database reduces infrastructure complexity and cost. Managing 100 separate DB connections is harder than managing one with proper indexing. I'd consider sharding or separate DBs only when we hit millions of rows."

**Q: How does this scale to 10,000 companies?**
> **A:** "The **Client Sites** scale infinitely because they are static (Vercel Edge Network). The **Database** is the bottleneck. To scale, I would add database indexing on `company_id`, implement read replicas, and eventually shard the database by Tenant."

**Q: Why Next.js Server Actions?**
> **A:** "They allow us to write backend logic directly alongside our components without setting up a separate Express/Node server. It simplifies the codebase and provides type safety end-to-end."

**Q: How do you handle SEO?**
> **A:** "Because we use ISR, every page is pre-rendered HTML. Search engines love this. We also allow custom `slugs` for every post to ensure clean, readable URLs."

---

## 5. Code Highlights (Show these off!)
1.  **`src/middleware.ts`**: Show how you protect routes.
2.  **`src/app/actions.ts`**: Show the `createPost` function and how it triggers the revalidation webhook.
3.  **`client-site/.../page.tsx`**: Show how you filter by `COMPANY_ID`.
