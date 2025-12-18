# 🔥 FastLandz - Enter the Wasteland

> **A gamified intermittent fasting app that transforms your fasting journey into an epic 7-day survival adventure.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🎮 What is FastLandz?

FastLandz is **not** a diet app. It's an introduction to intermittent fasting presented as a gamified survival challenge. Built for beginners who (like the creator) found it difficult to just get started—and even harder to continue day-to-day without support or accountability.

The app guides you through a **7-day progressive fasting protocol**, starting with a manageable 12-hour fast and building up to a challenging 24-hour fast by Day 7. Each day features unique challenges, educational content, and a post-apocalyptic wasteland theme to keep you engaged.

---

## ✨ Features

### Core Features
- 🕐 **Smart Fasting Timer** — Accurate countdown with pause/resume functionality
- 📅 **7-Day Challenge System** — Progressive difficulty from 12 to 24 hours
- 📓 **Daily Journal** — Track mood, symptoms, and pre-fast meals
- 🗺️ **Mission Map** — Visual calendar showing your progress
- 📚 **Daily Lessons** — Learn the science behind fasting

### Advanced Features
- 📊 **Analytics Dashboard** — Success rates, streaks, and achievements
- 🔔 **Browser Notifications** — Milestone alerts and completion reminders
- ☁️ **Cloud Sync** — Access your progress from any device (with Supabase)
- 📴 **Offline Mode** — Works without internet, syncs when back online
- 🔐 **Authentication** — Email/password and Google OAuth support
- 📤 **Data Export** — Download your progress as JSON

### Day-Specific Features
- 💧 **Day 3: Water Warrior** — Interactive water tracking
- 🍫 **Day 4: Snack Assassin** — Snack-free zone checkboxes
- 🍞 **Day 5: Carb Reckoning** — Protocol selection (Scout vs Warrior)
- ⚔️ **Day 7: Boss Fight** — Battle log for your final challenge

---

## 🚀 Quick Start

### Option A: With Supabase (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/fastlandz.git
cd fastlandz

# 2. Install dependencies
npm install

# 3. Set up Supabase (see SUPABASE_SETUP.md)
# 4. Create .env.local with your credentials
cp .env.local.example .env.local

# 5. Start the development server
npm run dev
```

### Option B: Without Supabase (LocalStorage Mode)

```bash
# Just run the app - no setup needed!
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start your journey!

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Build Tool** | Vite |
| **Testing** | Vitest |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
fastlandz/
├── components/           # React components
│   ├── day-features/     # Day-specific interactive features
│   ├── layout/           # App layout components
│   └── routes/           # Route components
├── contexts/             # React contexts (Auth)
├── lib/                  # Utilities and hooks
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
├── tests/                # Test files
├── utils/                # Helper utilities
└── *.md                  # Documentation files
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Quick Start Guide](./QUICK_START.md) | 5-minute setup instructions |
| [Deployment Guide](./DEPLOYMENT_GUIDE.md) | Production deployment steps |
| [Supabase Setup](./SUPABASE_SETUP.md) | Database configuration |
| [Implementation Details](./IMPLEMENTATION_COMPLETE.md) | Full feature documentation |
| [MVP Flow](./MVP_FLOW_UPDATE.md) | User journey documentation |
| [Documentation Plan](./DOCUMENTATION_IMPROVEMENT_PLAN.md) | Documentation roadmap |

---

## 🎯 The 7-Day Protocol

| Day | Challenge | Fast Duration | Focus |
|-----|-----------|---------------|-------|
| 1 | The Awakening | 12 hours | Introduction to fasting |
| 2 | The Hunger Games | 14 hours | Managing hunger |
| 3 | Water Warrior | 14 hours | Hydration tracking |
| 4 | Snack Assassin | 16 hours | Eliminating snacks |
| 5 | Carb Reckoning | 16 hours | Understanding carbs |
| 6 | The 20-Hour Trial | 20 hours | Extended fasting |
| 7 | Boss Fight | 24 hours | The final challenge |

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3000

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (optional - enables cloud features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> **Note:** The app works without Supabase using localStorage for data persistence.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

FastLandz is **not** a medical application. It is designed for educational and motivational purposes only. Intermittent fasting may not be suitable for everyone. Please consult with a healthcare professional before starting any fasting regimen, especially if you have:

- Diabetes or blood sugar issues
- Eating disorders (past or present)
- Pregnancy or breastfeeding
- Any chronic health conditions
- Are taking medications that require food

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

<p align="center">
  <strong>Ready to enter the wasteland?</strong><br>
  <a href="./QUICK_START.md">Get Started →</a>
</p>
