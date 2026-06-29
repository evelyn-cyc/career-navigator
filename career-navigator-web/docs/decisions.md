# Decisions Log

## Use Zustand for shared state from Step 1

**Decision:** Adopted Zustand immediately, rather than only `useState`/prop-drilling.
**Why:** The resume analysis result needs to be read by multiple components (the analysis view, and to gate whether the JD input is enabled) — passing it down through props would get messy fast. Zustand gives a shared store any component can read/write without manual prop threading.

## Mock data is fully hardcoded, not generated

**Decision:** `mockResumeAnalysis` and `mockJobMatchResult` are fixed constants — the actual uploaded file/pasted text is ignored in Step 1.
**Why:** Step 1's goal is proving the UI flow (upload → analysis → JD → match), not simulating realistic AI output. Real parsing/LLM calls come in Step 2.

## Step 1 scope trimmed to the core loop only

**Decision:** Built upload → mock analysis → JD input → mock match, with no Application Tracker or Dashboard yet.
**Why:** Wanted to validate the riskiest, most central part of the UX before investing time in tracking/visualization that depends on the core loop already feeling right.

## Prettier scoped to career-navigator-web, not repo root

**Decision:** Installed and configured Prettier inside `career-navigator-web/` only, rather than setting up npm workspaces with shared root-level tooling.
**Why:** `career-navigator-web` is currently the only real package in this repo. Setting up a monorepo structure (root `package.json` with `workspaces`, shared root configs) before the backend package exists would be premature scaffolding for a folder shape we don't know yet.
**Follow-up (do this in Step 2):** When the backend (Lambda + TypeScript) folder is created, migrate `.prettierrc`/`.prettierignore` (and likely `eslint.config.js`) to the repo root, add a root `package.json` with a `workspaces` field listing both packages, so formatting/linting config is shared instead of duplicated.

## Light/dark theme toggle deferred to Step 3

**Decision:** Not building a working light/dark theme switch now, even though the mockup shows a theme toggle icon in the sidebar footer.
**Why:** We just converted every component from dark to light theme this session. A real toggle means going back through all ~10 component/page files again to add Tailwind `dark:` variants for every background/text/border color — comparable in size to the redesign just finished, and not worth doing twice in one session.
**Follow-up (do in Step 3 — Portfolio Polish):** Add Tailwind's class-based dark mode, a small theme-preference hook (state + `localStorage`, similar pattern to `useApplications`) to toggle a `dark` class on the root element, and `dark:` variants across all components.
