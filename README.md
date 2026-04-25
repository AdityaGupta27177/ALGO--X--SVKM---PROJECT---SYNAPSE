<p align="center">
  <img src="https://img.shields.io/badge/ALGO--X-SYNAPSE-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTUtMTAtNXoiLz48cGF0aCBkPSJNMiAxN2wxMCA1IDEwLTUiLz48cGF0aCBkPSJNMiAxMmwxMCA1IDEwLTUiLz48L3N2Zz4=&logoColor=white" alt="ALGO-X Synapse" height="40"/>
</p>

<h1 align="center">🧠 ALGO-X — Project Synapse</h1>

<p align="center">
  <strong>An immersive, gamified learning platform for mastering C++ programming</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-team">Team</a>
</p>

---

## 📖 About

**ALGO-X Synapse** is a next-generation, gamified educational platform designed to teach C++ programming through interactive lessons, hands-on code labs, quizzes, game-based learning, and a certification system. Built with a futuristic dark UI featuring 3D Spline backgrounds, glassmorphism effects, and smooth animations — it delivers a premium learning experience.

> 🎓 **SVKM Project** — Built as part of academic coursework to demonstrate full-stack web development, interactive UI/UX design, and gamification principles in education.

---

## ✨ Features

### 🗺️ Interactive Course Roadmap
- Visual node-based roadmap with animated progress tracking
- Module unlocking system — complete one to unlock the next
- Real-time XP earned & day streak counters
- 3D Spline background with glowing neon path trails

### 📚 Structured Lessons
- **3-step learning flow**: Learn → Practice → Quiz
- Theory with clean typography and explanations
- Code Lab with syntax-highlighted C++ snippets and pro tips
- Per-lesson quiz with instant feedback and retry mechanism
- Dynamic progress sidebar with course completion percentage

### 🏆 Final Assessment & Certification
- 10-question timed final exam (10 min countdown)
- 70% pass threshold with confetti celebration on success
- **PDF Certificate Generation** — formal certificate with:
  - Navy blue ornamental borders & gold accents
  - Student name, course title, and score
  - Official seal, date, signature, and unique certificate ID
  - Direct PDF download via jsPDF

### 🎮 Game-Based Learning
- **Pong** — Learn game loops, SFML rendering, collision detection, delta time
- **Snake** — Grid movement, `std::deque`, food spawning, self-collision
- Tutorial mode (guided) + Test mode (blank editor challenge)
- Step-by-step code explanations with line-by-line annotations

### 🔐 Authentication System
- Supabase-powered auth (email/password)
- Sign up, sign in, forgot/reset password flows
- Protected routes with automatic redirect
- User profile with display name, XP, streaks, and stats

### 🎨 Premium UI/UX
- Futuristic dark theme with glassmorphism cards
- 3D Spline interactive backgrounds
- Framer Motion animations throughout
- Animated splash screen (book loader)
- Responsive design for all screen sizes
- Custom neon glow effects and micro-animations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5.8 |
| **Build Tool** | Vite 5.4 |
| **Styling** | Tailwind CSS 3.4, CSS Variables |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Animations** | Framer Motion 12 |
| **3D Graphics** | Spline (react-spline) |
| **Auth & Database** | Supabase (Auth + PostgreSQL) |
| **State Management** | React Query (TanStack), localStorage |
| **Code Editor** | Monaco Editor |
| **PDF Generation** | jsPDF |
| **Celebrations** | canvas-confetti 🎉 |
| **Routing** | React Router DOM v6 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or bun)
- A Supabase project with auth enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/AdityaGupta27177/ALGO--X--SVKM---PROJECT---SYNAPSE.git

# Navigate to the project
cd ALGO--X--SVKM---PROJECT---SYNAPSE/ALGO-X-L-SYANPSE-

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
ALGO-X-L-SYANPSE-/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (Button, Card, etc.)
│   │   ├── course/
│   │   │   └── CertificateGenerator.tsx   # PDF certificate via jsPDF
│   │   ├── Navbar.tsx         # Global navigation with breadcrumbs
│   │   ├── BookLoader.tsx     # Animated splash screen
│   │   ├── MonacoEditor.tsx   # Code editor wrapper
│   │   ├── ErrorPanel.tsx     # Compiler error simulation
│   │   └── Logo.tsx           # Brand logo component
│   ├── data/
│   │   └── cppCourse.ts       # Course content (lessons + final assessment)
│   ├── hooks/
│   │   └── use-toast.ts       # Toast notification hook
│   ├── integrations/
│   │   └── supabase/          # Supabase client & types
│   ├── lib/
│   │   ├── auth.tsx           # Auth context provider (Supabase)
│   │   ├── useCourseProgress.ts  # XP, streaks, lesson tracking (localStorage)
│   │   ├── tutorial-data.ts   # Pong tutorial step data
│   │   └── snake-tutorial-data.ts
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard with stats & game library
│   │   ├── SignIn.tsx         # Auth page (sign in/up with 3D background)
│   │   ├── course/
│   │   │   ├── Roadmap.tsx    # Visual course roadmap with node progression
│   │   │   ├── Lesson.tsx     # 3-step lesson (learn → practice → quiz)
│   │   │   └── Assessment.tsx # Timed final exam + certificate award
│   │   ├── PongLanding.tsx    # Pong game overview
│   │   ├── PongTutorial.tsx   # Guided Pong code tutorial
│   │   ├── PongTest.tsx       # Pong coding challenge
│   │   └── SnakeLanding.tsx   # Snake game overview
│   ├── App.tsx                # Route definitions & auth guards
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles & design tokens
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 Core User Flow

```
Sign In / Sign Up
       │
       ▼
   Dashboard ──────────────┐
       │                   │
       ▼                   ▼
  C++ Roadmap         Game Library
       │              (Pong / Snake)
       ▼                   │
  Lesson 1 ◀──────┐       ▼
  (Learn→Code→Quiz)│   Tutorial Mode
       │           │       │
       ▼           │       ▼
  Lesson 2         │   Test Mode
       │           │
       ▼           │
  Lesson 3         │
       │           │
       ▼           │
  Final Exam ──────┘
       │
       ▼
  📜 Certificate
   (PDF Download)
```

---

## 🧩 Key Components

| Component | Description |
|-----------|-------------|
| `Roadmap.tsx` | Node-based visual roadmap with animated progress path, module cards, and final exam gate |
| `Lesson.tsx` | 3-step lesson viewer: theory → code lab → quiz with dynamic completion tracking |
| `Assessment.tsx` | Timed 10-question final exam with scoring, pass/fail, and certificate unlock |
| `CertificateGenerator.tsx` | Pure jsPDF certificate with ornamental borders, seal, and formal layout |
| `useCourseProgress.ts` | Custom hook managing XP, streaks, completed lessons, and certificate state via localStorage |
| `BookLoader.tsx` | Animated 3D book-opening splash screen with code rain background |
| `Navbar.tsx` | Sticky nav with breadcrumbs, user avatar, and sign-out |

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/public key |

---

## 👥 Team

**SVKM — Project Synapse**

Built with ❤️ as an academic project demonstrating modern web development, gamification in education, and interactive UI design.

---

## 📄 License

This project is for educational purposes as part of SVKM coursework.

---

<p align="center">
  <sub>Built with React + TypeScript + Vite + Supabase + Framer Motion + Spline</sub>
</p>
