# 🚀 Deployment Guide: Multi-Tenant CMS

This guide explains how to deploy your system to production using **Vercel**.

---

## 1. Deploying the Admin Dashboard (`cms-task`)

The Admin Dashboard is the control center. You only need to deploy this **once**.

### Steps:
1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com) -> **Add New Project**.
3.  Import the `cms-task` repository.
4.  **Environment Variables**: Add the following in the Vercel dashboard:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
    *   `ADMIN_PASSWORD`: (Set a strong password, e.g., `SuperSecretPass123!`)
5.  Click **Deploy**.

**Result**: You now have a live URL (e.g., `https://my-cms-admin.vercel.app`).

---

## 2. Deploying Client Sites (`client-site`)

This is the "Multi-Tenant" magic. You will deploy the **same codebase** multiple times, once for each company.

### Example: Deploying "TechCorp"
1.  Go to Vercel -> **Add New Project**.
2.  Import the **same** repository (`cms-task`).
3.  **[CRITICAL STEP]**: In the "Configure Project" screen, click **Edit** next to **Root Directory** and select `client-site`.
    > ⚠️ **If you skip this, you will deploy the Admin Dashboard by mistake!**
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Same as Admin)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Same as Admin)
    *   `NEXT_PUBLIC_COMPANY_ID`: **[CRITICAL]** Paste the UUID for "TechCorp" from your database.
    *   `REVALIDATION_SECRET`: `super_secure_token_123` (Must match what the Admin sends).
5.  Click **Deploy**.
5.  **Domain**: Assign a custom domain (e.g., `techcorp.com`) in Vercel settings.

### Example: Deploying "FoodBlog"
1.  Repeat the steps above.
2.  **Change `NEXT_PUBLIC_COMPANY_ID`** to the UUID for "FoodBlog".
3.  Assign a different domain (e.g., `foodblog.com`).

---

## 3. Connecting the Pieces (The "Push" Flow)

For the "Push" (ISR) to work, the Admin Dashboard needs to know where to send the signal.

1.  **In the Database**:
    *   Go to your `companies` table.
    *   Update the `domain` column for TechCorp to match its real Vercel URL (e.g., `techcorp-site.vercel.app`).
2.  **In the Code (`src/app/actions.ts`)**:
    *   Currently, the code uses a hardcoded secret: `MY_SECRET_TOKEN`.
    *   **Production Tip**: In a real app, you should use `process.env.REVALIDATION_SECRET` instead of hardcoding it.

### How it works in Production:
1.  You log into **Admin Dashboard**.
2.  You write a post for **TechCorp**.
3.  You click **Publish**.
4.  The Admin App looks up TechCorp's domain (`techcorp-site.vercel.app`).
5.  It sends a request: `GET https://techcorp-site.vercel.app/api/revalidate?slug=my-new-post&secret=MY_SECRET_TOKEN`.
6.  The **TechCorp Site** receives it, verifies the token, and rebuilds the page instantly.

---

## 4. Summary Checklist
- [ ] Admin Dashboard deployed.
- [ ] `ADMIN_PASSWORD` set.
- [ ] Client Site 1 (TechCorp) deployed with correct `COMPANY_ID`.
- [ ] Client Site 2 (FoodBlog) deployed with correct `COMPANY_ID`.
- [ ] Database `companies` table updated with real Vercel domains.
