# Kite — Smart Utility Toolkit

A clean, offline-first mobile utility app built with React Native and Expo. Kite brings together five everyday tools in a single, beautifully designed experience.

## Features

**Unit Converter**
Convert between length, weight, temperature, and speed units instantly. Real-time conversion as you type with a smooth category picker and swappable unit selector.

**Hydration Tracker**
Set a personalised daily water goal based on your weight and activity level. Log intake throughout the day, track progress with an animated water bottle visualisation, and review your 7-day history.

**Bill Splitter**
Enter a bill amount, choose a tip percentage, and split the total across any number of people. Generates a clean receipt-style breakdown instantly.

**Analytics**
A 7-day hydration history chart built with animated bars. Colour-coded by goal achievement — green for strong days, amber for partial, red for low intake.

**Task Manager**
Create, edit, complete, and delete tasks. Persisted locally with SQLite so your list survives app restarts and works fully offline.

---

## Tech Stack

| Technology                   | Purpose                        |
| ---------------------------- | ------------------------------ |
| React Native + Expo SDK 54   | Core framework                 |
| Expo Router v4               | File-based navigation          |
| NativeWind v4                | Tailwind CSS utility classes   |
| expo-sqlite                  | Local task persistence         |
| AsyncStorage                 | Hydration logs and preferences |
| React Native Reanimated      | Fluid animations               |
| React Native Gesture Handler | Swipe gestures                 |
| Plus Jakarta Sans            | Typography                     |
| TypeScript                   | Strict typing, no `any`        |

---

## Architecture

```
kite/
├── app/
│   ├── _layout.tsx              Root layout — providers, fonts, navigation
│   ├── onboarding.tsx           3-slide gesture-driven onboarding
│   ├── tasks.tsx                Full task manager screen
│   └── (tabs)/
│       ├── _layout.tsx          Custom tab bar
│       ├── index.tsx            Home screen
│       ├── converter.tsx        Unit Converter
│       ├── hydration.tsx        Hydration Tracker
│       ├── splitter.tsx         Bill Splitter
│       └── analytics.tsx        7-day Analytics
│
├── components/
│   ├── shared/                  SafeArea, InputField, PrimaryButton, etc.
│   ├── converter/               CategoryPicker, UnitSelector, UnitPickerSheet
│   ├── hydration/               WaterBottle, IntakeLog
│   ├── splitter/                TipSelector, PeopleCounter, SplitResult
│   ├── analytics/               BarChart
│   ├── tasks/                   TaskItem, TaskInput
│   └── tabs/                    CustomTabBar
│
├── context/
│   └── ThemeContext.tsx          Light/dark mode + navigation bar sync
│
├── hooks/
│   ├── useTheme.ts
│   ├── useUnitConverter.ts
│   ├── useHydration.ts
│   ├── useSplitter.ts
│   ├── useAnalytics.ts
│   └── useTasks.ts
│
├── utils/
│   ├── conversionFormulas.ts
│   ├── hydrationFormulas.ts
│   ├── splitFormulas.ts
│   ├── analyticsFormulas.ts
│   └── taskDatabase.ts          expo-sqlite setup and queries
│
├── types/                        All TypeScript interfaces
└── constants/                    Colors, theme tokens, unit definitions
```

**Separation of concerns:**

- `app/` — screens only, no business logic
- `components/` — UI only, no raw calculations
- `hooks/` — all React state, calls utils
- `utils/` — pure functions, no React
- `types/` — single source of truth for all interfaces
- `constants/` — no magic numbers anywhere in the codebase

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your Android or iOS device
- Or Android Studio / Xcode for emulator

### Installation

```bash
git clone https://github.com/developerdavid2/kite.git
cd kite
npm install
```

### Run Locally

```bash
npx expo start --clear
```

Scan the QR code with Expo Go on your phone.

---

## Design System

Kite uses a monochromatic blue scale with full light and dark mode support.

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| Background     | `#F5F9FE` | `#040F1E` |
| Surface        | `#FFFFFF` | `#081E3A` |
| Primary        | `#2185D5` | `#4A9FE0` |
| Text Primary   | `#040F1E` | `#E8F4FD` |
| Text Secondary | `#1A6BB5` | `#7BB8EA` |
| Border         | `#BAD9F5` | `#144F8A` |

Semantic colors for feedback states:

| State   | Color     |
| ------- | --------- |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger  | `#EF4444` |
| Info    | `#3B82F6` |

---

## Key Implementation Details

### Offline Persistence

Tasks are stored in a local SQLite database via `expo-sqlite`. The database is initialised on first app launch and persists across sessions with no network required.

```
utils/taskDatabase.ts  → all SQL queries
hooks/useTasks.ts      → React state synced with SQLite
```

Hydration logs are stored per day in AsyncStorage under date-keyed entries (`kite_hydration_logs_YYYY-MM-DD`), preserving 7-day history for analytics.

### Theme System

Light and dark mode respond to system preference on first launch, with a manual toggle that persists via AsyncStorage. The Android navigation bar colour syncs automatically with the active theme via `expo-navigation-bar`.

### Navigation

Expo Router file-based routing with a custom tab bar. The onboarding flow runs once on first launch — completion is tracked in AsyncStorage (`kite_onboarded`). Subsequent launches go directly to the home tab.

### Data Freshness

`useFocusEffect` from Expo Router is used on the Home and Analytics screens to reload data whenever the screen comes into focus — ensuring the task list and hydration chart always reflect the latest state without requiring manual refresh.

---

## Building

### Preview APK (for testing and submission)

```bash
eas build --platform android --profile preview
```

### Production AAB (for Play Store)

```bash
eas build --platform android --profile production
```

---

## License

MIT
