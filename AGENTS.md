# AGENTS.md — gqz.app (personal hub)

What's true here. Backlog: `roadmap.md` at root (Frank's async task queue —
re-read at session start, patch never rewrite). History: `git log`.

## Stack & deploy
- Vite + React 19 + TypeScript + Tailwind 4. Personal hub site, lives at
  `gqz.app`.
- DEPLOY CONTRACT: pushing `frankgqz/gqz` main auto-deploys via Vercel —
  outward-facing. Confirm with Frank before pushing. (Sibling:
  `frankgqz/pickleball` → pickleball.gqz.app.)

## Theme system (@gqz/theme)
- Dependency: `@gqz/theme` = `github:frankgqz/theme#main`, **lockfile-pinned**
  to a SHA in package-lock.json. To change theme versions: `npm update
  @gqz/theme` on the host (or copy package files into
  `node_modules/@gqz/theme` + bump the lock SHA by hand — both work).
- Theme keys: `wood 🍂 · night 🌙 · bubble 🫧 · matcha 🍵` (2026-10-07 rename:
  dark→night, sky→bubble — legacy cookie values mapped in index.html script
  AND in the package's storage.ts).
- index.html inline script = no-flash pre-paint from cookie `gqz-theme`
  (sets --theme-bg/text/subtext/accent). Keep its palette map in sync with
  theme.ts when palette values change.
- Components style via JS `useTheme().themeColors` (bg/text/subtext/glow,
  buttonStart/End/Shadow/ShadowPressed, particleHues) — gqz does NOT use the
  --theme-* CSS-var / tailwind token layer yet (pickleball does).

## Build / node_modules gotchas
- node_modules is COMMITTED here (figma-make tooling convention, ~1000 files)
  and win32-installed. Do NOT run npm install from the Linux container — it
  prunes the Windows natives (esbuild) Frank's dev needs. TypeScript checks
  work fine cross-platform:
  `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`
  (build is `npm run build` = vite; run on host or let Vercel do it).
