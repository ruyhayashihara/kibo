# KiboJobs — React + Vite App

## Overview
A job board web application built with React, Vite, and Supabase. Connecting international professionals with job opportunities in Japan.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Routing**: React Router DOM v7
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Build tool**: Vite 6

## Environment Variables (Secrets)
Set these in the Replit Secrets panel:
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Your Supabase anonymous key
- `GEMINI_API_KEY` — (optional) Google Gemini API key

The app includes mock data fallbacks and will run in demo mode if Supabase is not configured.

## Development
- Dev server runs on port **5000** at `0.0.0.0`
- Start: `npm run dev`
- Build: `npm run build`

## Project Structure
- `src/pages/` — Page components (Home, Jobs, JobDetail, Register, Login, Dashboard, etc.)
- `src/components/` — Shared UI components and auth guards
- `src/context/` — React context providers (Auth, Theme)
- `src/lib/` — Supabase client, admin service, utilities

## Replit Migration Notes
- Port set to 5000 (Replit webview requirement)
- `server.allowedHosts: true` in vite.config.ts for Replit proxy compatibility
- Supabase client now uses a safe stub when credentials are absent (no crash on startup)
- Secrets stored in Replit Secrets panel: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Roles
- **Candidate**: Search jobs, apply, manage profile
- **Company**: Post jobs, manage listings
- **Admin**: Full dashboard (login: admin@kibojobs.com / admin123 for demo)
