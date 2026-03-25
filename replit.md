# KiboJobs — React + Vite App

## Overview
A job board web application built with React, Vite, and Supabase. Originally developed on Vercel, now running on Replit.

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
- Port changed from 3000 → 5000 (Replit webview requirement)
- `server.allowedHosts: true` added to vite.config.ts for Replit proxy compatibility
- Supabase warnings updated to reference Replit Secrets panel
