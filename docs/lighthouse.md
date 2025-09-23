# Lighthouse in CI and locally

This project runs Lighthouse against the built Next.js app using a cached Chrome and sensible waits.

## Local quickstart
- Build and start the app in prod mode:
  - `npm run build && npm start` (port 3000)
- Install a cached Chrome once:
  - `npm run lighthouse:install`
- Run the audit and print the score:
  - `npm run lighthouse:run && npm run lighthouse:score`
- If the page stalls on third‑party hosts:
  - `npm run lighthouse:blocked`

Reports are written to `.artifacts/lhr.report.json`.

## GitHub Actions
- Workflow: `.github/workflows/lighthouse.yml`
- Steps:
  - Install deps (`npm ci`)
  - Cache Chrome (`@puppeteer/browsers install chrome`)
  - Build (`next build`) and start (`next start -p 3000`)
  - Run Lighthouse with performance category only
  - Upload `.artifacts` as an artifact

## Notes
- Avoid `npx lighthouse` cold downloads each run by installing Chrome once.
- Use `--throttling-method=provided` and a single `--output-path` to prevent errors.
- Consider blocking Google Fonts/CDNs in CI for faster network idle.
