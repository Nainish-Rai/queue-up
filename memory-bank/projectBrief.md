Here's a `productPlan.md` file you can use in Cursor for your no-code waitlist maker:

---

````markdown
# 🚀 Product Plan: No-Code Waitlist Maker

## 🎯 Vision

Empower anyone (founders, marketers, product teams) to launch viral waitlists without writing code—similar to GetWaitlist.com but more flexible and developer-friendly.

---

## 🔑 Core Features (MVP)

### ✅ Waitlist Creation

- Create new waitlist with:
  - Name
  - Description
  - Custom slug (`yourbrand.getwaitlist.app`)
  - Logo upload

### ✅ Public Waitlist Page

- Form fields: Name, Email (add custom fields later)
- Unique referral link generation
- Show position in line
- Thank-you screen + social sharing

### ✅ Dashboard (for creators)

- Create/manage waitlists
- View all signups + referral counts
- Export CSV
- Basic analytics (total signups, referrals)

### ✅ Embed Option

- Provide script to embed the form into other sites (iframe or JS snippet)

---

## 🛠 Tech Stack

| Layer    | Stack                                          |
| -------- | ---------------------------------------------- |
| Frontend | Next.js (App Router), Tailwind CSS, TypeScript |
| Backend  | API Routes / Server Actions                    |
| Auth     | Clerk / Auth.js                                |
| Database | PostgreSQL                                     |
| ORM      | Prisma                                         |
| Email    | Resend / Postmark                              |
| Hosting  | Vercel                                         |

---

## 🧱 Database Models (Prisma)

```ts
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  waitlists Waitlist[]
}

model Waitlist {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  ownerId   String
  owner     User      @relation(fields: [ownerId], references: [id])
  signups   Signup[]
  createdAt DateTime  @default(now())
}

model Signup {
  id         String    @id @default(cuid())
  email      String
  name       String?
  waitlistId String
  waitlist   Waitlist  @relation(fields: [waitlistId], references: [id])
  referredBy String?   // referralId of referrer
  referralId String    @unique
  createdAt  DateTime  @default(now())
}
```
````

---

## 📆 Timeline & Phases

### 🔹 Week 1: Setup & Auth

- Initialize Next.js + Tailwind + Prisma
- Setup PostgreSQL (Railway/Supabase)
- Implement user auth (Clerk/Auth.js)
- Create DB schema for User, Waitlist

### 🔹 Week 2: Waitlist Builder

- Creator dashboard UI
- Form to create waitlist (slug, logo, etc.)
- Save to DB

### 🔹 Week 3: Public Signup Page

- Dynamic route `/w/[slug]`
- Signup form → store in DB
- Generate referral ID and link
- Thank-you screen + referral sharing

### 🔹 Week 4: Admin Dashboard

- View signups and referrals
- Export to CSV
- Charts for signups/referrals

### 🔹 Week 5: Embeds & Polish

- Embed snippet generator
- Add spam protection
- Polish UI, error handling, loading states

---

## 🔐 Security

- Rate limit public API routes
- Add reCAPTCHA/hCaptcha
- Sanitize inputs

---

## 🧪 Testing

- Manual testing in staging
- Unit tests (API logic)
- Optional: Playwright for E2E

---

## 🚀 Stretch Goals (Post-MVP)

- Custom domains (via CNAME + Vercel rewrites)
- Email integrations (Zapier, Mailchimp)
- Public leaderboard
- Stripe monetization (\$5–\$10/mo)

---

## 📊 Metrics to Track

- # Waitlists created
- # Total signups
- Avg referrals per user
- Top referrers
- Conversion from views → signups

---

## ✨ Long-Term Vision

- Plugin marketplace for integrations
- Drag-and-drop form builder
- Public API + Webhooks

```

---

Let me know if you'd like this exported as a `.md` file or auto-added to a GitHub repo.
```
