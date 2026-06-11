# 📺 Byte Tutorials

> A curated YouTube learning platform — track your progress, take notes, and learn smarter.

Byte Tutorials is a full-stack web app that transforms YouTube content into a structured learning experience. Browse curated playlists, track your watch progress, take timestamped notes, and manage your personal watch list — all in one place.

---

## 🎬 Demo

https://github.com/user-attachments/assets/3b61d3b4-aea5-4490-92ca-7a09f6746cd1

---

## ✨ Features

- 🔐 **OAuth Authentication** — Sign in with Google or GitHub via Arctic
- 📚 **Curated Playlists** — Organized course playlists sourced from YouTube
- ▶️ **Video Progress Tracking** — Automatically saves your last watched position and completion status (`not started`, `in progress`, `completed`)
- 📝 **Timestamped Notes** — Add notes tied to specific moments in a video
- ❤️ **Watch List** — Save videos to revisit later
- 📊 **Analytics** — Track learning activity and course engagement

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [LibSQL / Turso](https://turso.tech/) + [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Auth** | [Arctic](https://arcticjs.dev/) (Google & GitHub OAuth) + [@oslojs](https://oslojs.dev/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) + [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) |
| **Error Monitoring** | [Sentry](https://sentry.io/) |
| **Testing** | [Playwright](https://playwright.dev/) |
| **Linting / Formatting** | [Biome](https://biomejs.dev/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 11

### Installation

```bash
# Clone the repository
git clone https://github.com/RohithReddy-45/byte-tutorials.git
cd byte-tutorials

# Install dependencies
pnpm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Key variables to configure:

```env
# Database (Turso / LibSQL)
DATABASE_URL=
DATABASE_AUTH_TOKEN=

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth — GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database

```bash
# Push schema to database
pnpm drizzle-kit push

# Seed with sample data
pnpm tsx src/db/seed.ts
```

---

## 🧪 Testing

```bash
# Run end-to-end tests
pnpm e2e

# Run with Playwright UI
pnpm e2e:ui
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login / signup routes
│   ├── (dashboard)/     # Courses, watch list, analytics
│   ├── (marketing)/     # Landing page, terms, privacy
│   └── admin/           # Admin dashboard
├── components/          # Shared UI components
├── db/                  # Drizzle schema, migrations, seed
├── helpers/             # Server utilities
├── hooks/               # Custom React hooks
├── lib/                 # Auth, session, OAuth logic
└── providers/           # Theme and toast providers
```
