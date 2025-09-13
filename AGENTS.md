# Repository Guidelines

## Project Structure & Module Organization
- `pages/`: Next.js Pages Router (e.g., `pages/index.js`, `pages/_app.js`, `pages/creator/[id].js`).
- `components/`: Reusable UI (e.g., `components/layout/Header.jsx`, `components/public/Hero.jsx`).
- `styles/`: Global styles and Tailwind entry (`styles/globals.css`).
- `public/`: Static assets served from `/` (e.g., `/favicon.ico`, `/manifest.json`).
- `src/`: Legacy CRA/Vite artifacts (`src/App.js`, tests). Not used by Next.js runtime; avoid changes unless migrating.
- Root config: `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `vite.config.js` (legacy), `index.html` (legacy).
 - `legacy/`: Archived CRA/Vite files moved out of the runtime (e.g., `legacy/src/*`, `legacy/index.html`, `legacy/vite.config.js`).

## Build, Test, and Development Commands
- Install deps: `npm install` (Node 18+).
- Dev server: `npm run dev` → runs `next dev` at http://localhost:3000.
- Build: `npm run build` → runs `next build`.
- Start prod: `npm start` → runs `next start` (after build).
- Lint: `npm run lint` → Next.js ESLint rules (`eslint-config-next`).

## Coding Style & Naming Conventions
- Language: JavaScript/JSX. Use 2‑space indentation.
- Components: `PascalCase.jsx` (e.g., `CreatorProfile.jsx`). Utilities/hooks: `camelCase.js`.
- Imports: Use clear relative paths (no path aliases configured).
- Quality: Fix ESLint issues before commit; keep components small and composable.

## Testing Guidelines
- Current state: No configured test runner. Legacy Jest files exist under `src/` but are not wired.
- If adding tests: Use Jest + React Testing Library; name files `*.test.js` colocated or under `__tests__/`.
- Keep tests deterministic and offline; target critical UI and utils first.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat(dashboard): add analytics card`).
- PRs: Include a concise description, linked issues, screenshots for UI changes, and verification steps.
- Gate: Lint must pass; ensure build succeeds locally before requesting review.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local`; see `.env.example` for required vars.
- Rotate exposed keys immediately and redeploy.

## Migration Checklist (Legacy CRA/Vite)
- Move any remaining UI from `src/` into `pages/` and `components/`.
- Replace Vite/CRA-specific imports with Next-compatible ones; serve assets from `public/`.
- Legacy files have been relocated to `legacy/` for reference; delete once migration is complete.
- Update imports to correct relative paths; verify with `npm run lint`.
- Validate pages with `npm run dev`, then `npm run build`.

## Agent-Specific Notes
- Prefer surgical changes aligned to the Pages Router structure. Avoid editing `src/` or Vite artifacts unless migrating.
- When explaining changes, reference exact paths and npm scripts for reproducibility.
