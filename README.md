# InternGuard

InternGuard is a verified-internship portal that helps students find
legitimate opportunities, practice AI-powered mock interviews, and track every
application in one place.

## Features

- **Verified Internship Listings** with trust scores and AI fraud detection
- **Resume & Application Tracking** with real-time status updates
- **AI Career Assistant** for mock interviews, resume tips, and platform help
- **Sign-in / Sign-up** portal with profile management
- **Student profile** with academic information

## Tech stack

- Vite + React 18 + TypeScript
- React Router for client-side routing
- shadcn/ui + Tailwind CSS for components
- LocalStorage-backed auth & application persistence (no backend needed)

## Getting started

```sh
npm install
npm run dev
```

Then open http://localhost:8080.

### Demo flow

1. Click **Get Started** to create a free account.
2. Visit **Internships** and apply to a listing — your application appears in
   the Dashboard.
3. Open the **AI Assistant** to try a mock interview or ask about red flags.
4. Edit your profile from the avatar menu in the navbar.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
