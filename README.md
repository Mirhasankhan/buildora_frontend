# Buildora Frontend

Buildora is a role-based construction workforce management platform built with Next.js 15. The app serves three primary user types: administrators, site managers, and workers. After authentication, the home page switches to the correct dashboard based on the role stored in the JWT cookie.

## What the app does

Buildora focuses on the day-to-day operations around construction teams and projects:

- authentication and account recovery
- invite-based registration and OTP verification
- role-aware dashboards for admins, site managers, and workers
- project creation, assignment, and detail views
- worker discovery and management
- earnings and withdrawal tracking
- profile management
- live messaging with WebSocket support

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Redux Toolkit + RTK Query
- redux-persist for persisted auth state
- Tailwind CSS
- Radix UI components
- NextAuth for social login
- sonner for notifications
- WebSocket-based messaging

## Project Structure

- `src/app` contains the App Router pages, including auth screens, dashboards, project pages, earnings, withdraws, workers, profile, and messages.
- `src/components` contains the feature UI for admin, manager, worker, shared layout pieces, auth flows, and reusable UI components.
- `src/redux` contains the store, auth slice, RTK Query base API, and feature endpoints for auth, projects, payments, and withdrawals.
- `src/utils` contains helpers for JWT decoding, sidebar generation, overlap checks, and NextAuth configuration.

## Main Routes

- `/` role-based dashboard landing page
- `/auth/login`
- `/auth/register`
- `/auth/verify-email`
- `/auth/reset-password`
- `/auth/set-profile`
- `/projects`
- `/projects/[project]`
- `/create-project`
- `/workers`
- `/earnings`
- `/withdraws`
- `/profile`
- `/messages`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the app with Turbopack.
- `npm run build` creates a production build.
- `npm run start` starts the production server on port `7012`.
- `npm run lint` runs the Next.js lint command.

## Environment Setup

The app currently uses a few external services and expects these values to be available in the environment when relevant:

```bash
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
NEXTAUTH_SECRET=
NEXT_PUBLIC_SOCKET_URL=
```

Notes:

- Social login is configured in `src/utils/authOptions.ts`.
- Live messaging uses `NEXT_PUBLIC_SOCKET_URL` when it is available.
- The REST API base URL is configured in `src/redux/api/baseApi.ts`.

## UI and State

The app shell is wrapped with theme, Redux, and toast providers. Auth state is persisted in local storage through `redux-persist`, while most server data is handled through RTK Query endpoints.

## Branding

The app metadata, favicon, and Open Graph values are already configured in `src/app/layout.tsx` for the Buildora brand.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [NextAuth Documentation](https://next-auth.js.org/)

## Deployment

The app is ready for standard Next.js deployment targets such as Vercel or any Node.js host that can run `next build` and `next start`.
