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

## Resume upload UI accepts PDF, DOCX, and Markdown

**Decision:** `ResumeUpload.tsx` now accepts `.pdf`, `.docx`, and `.md` files (validated by filename extension, not `file.type`, since Markdown files don't have a reliable MIME type across browsers).
**Why:** Better honesty about what the upload box accepts, and Step 1 never actually parses the file content anyway (always returns mock data), so widening accepted formats has no cost now.
**Follow-up (do in Step 2):** ADR005 currently only commits real parsing to PDF via `pdf-parse`. Need to add DOCX parsing (e.g. `mammoth`) and trivial plain-text reading for Markdown when building the real `/resume/analyze` endpoint, or narrow the upload UI back down if we decide not to support all three for real.

## Application Tracker gains full edit, a detail view, and a "Save as Application" shortcut

**Decision:** Clicking anywhere on an application card opens `ApplicationDetailModal`, which handles View, in-modal Edit (Save/Cancel), and Delete (with a `window.confirm` guard) all in one place — `ApplicationForm` stays add-only. `JobMatchResultView` gained a "Save as Application" button that navigates to `/applications`.
**Why:** The tracker only supported create + status-update + delete — company/role/notes were locked in after creation, and the match result had no path into the tracker besides remembering to switch pages and retype things manually. Editing inline on the page-level form (the first iteration of this) was confusing since it looked identical to "Add" — moving Edit/Delete behind a deliberate "open the card" step both fixed that and reduced accidental-click risk on Delete. `matchLevel` already auto-attaches from the shared Zustand store when adding an application, so the new button is mostly a navigation shortcut, not new data-flow logic.

## Job Matcher no longer requires a resume first

**Decision:** Pasting a JD is now always allowed. With no resume uploaded, clicking "Extract Requirements" shows just the JD's required skills (no comparison) via a new `jobRequirements` store field and `mockJobRequirements`. Once a resume exists, the same input becomes "Match" and produces the full `jobMatchResult` (match level + matched/missing skills) as before.
**Why:** The original resume-first gate assumed everyone builds a resume before reading job postings, but plenty of people read postings first to figure out what to build toward. A "match" inherently needs two sides to compare, so full matching still requires a resume — but extracting a JD's requirements alone doesn't, so there's no real reason to block it.
**Superseded by:** the entry below — matching moved off this page entirely.

## Job postings carry structured details, and "Save as Application" now pre-fills them

**Decision:** Added a shared `JobPostingDetails` type (company, role, employment type, location, work arrangement, salary, start/end date, working hours, citizenship/visa requirement, contact email, application link) that both `JobRequirements` and `JobMatchResult` extend. `ApplicationForm` now initializes `company`/`role`/`contactEmail`/`applicationUrl` from the current `jobMatchResult` in the store, so "Save as Application" actually carries that data over instead of requiring it to be retyped. `Application` itself gained `contactEmail`/`applicationUrl` fields, visible and editable via `ApplicationDetailModal`.
**Why:** This directly resolves the limitation noted above — once the JD extraction produces structured company/role/contact data, there's no reason to make the user retype it. Contact email and application link are rendered as clickable `mailto:`/`http(s):` links rather than plain text since they're meant to be acted on, not just read.
**Note:** `ApplicationForm` reads from `jobMatchResult` here, which the entry below later removes from the store in favor of `jobRequirements` — the pre-fill source changed accordingly.

## Resume Analysis becomes a resume library; matching moves to Applications; Job Analysis is extraction-only

**Decision:** Split what used to be one tangled page (Job Matcher: extract a JD _and_ match it against a single global resume) into three clean responsibilities:

- **Resume Analysis** is now a library — `useResumes()` (mirrors `useApplications()`'s localStorage pattern) stores multiple named resumes, not one global slot. `ResumeAnalysis` gained `id`/`name`/`uploadedDate`.
- **Job Analysis** (renamed from "Job Matcher," same `/match` route) is pure extraction now — always "Extract Requirements," no resume involved, no more dual Match/Extract branching. `JobMatchResultView.tsx` was renamed to `JobRequirementsView.tsx` and lost its full-match branch entirely.
- **Applications** is the management page — matching happens per-application, on demand, against a _selected_ saved resume (`ApplicationDetailModal`'s new "Match against a resume" section). `Application` absorbed the rest of `JobPostingDetails` plus `requiredSkills`, `matchedResumeId`, `matchedDate`, `matchedSkills`, `missingSkills`.
- `resumeAnalysis` and `jobMatchResult` were removed from the Zustand store entirely (resumes are persisted list data now, not transient shared state; match results live on the specific `Application`, not globally, since each application can have its own independent match).

**Why:** The user pointed out directly that "paste a JD" and "track an application" had converged on the same shape of data — both produce company/role/skills/contact info. Untangling extraction (a JD property) from matching (a comparison that needs _a_ resume, and now _which_ resume) is more honest about what each page actually does, and multiple resumes is a real need once you're tailoring applications to different kinds of roles.

**Bonus — first real (non-mocked) logic:** matching now compares two concrete skill lists — `application.requiredSkills` (from JD extraction) against a selected resume's `extractedSkills` — instead of always returning the same canned `mockJobMatchResult`. `src/utils/matching.ts`'s `computeMatch()` does a real case-insensitive set-overlap with simple ratio thresholds for `matchLevel`. Dropped `suggestedKeywords` from the result entirely — there was no honest computed equivalent for it without real AI, and it was always decorative mock filler.

**Superseded by:** the entry below — `Application` as a standalone, field-duplicating entity is retired in favor of attempts nested on `Job`.

## Application is retired as a top-level entity; applications become attempts nested on Job

**Decision:** `Application` (with its own duplicated `company`/`role`/`requiredSkills` etc., inherited from `JobPostingDetails`) is removed. In its place, `Job` gains `applications: ApplicationAttempt[]`, parallel to its existing `matches: JobMatchRecord[]`:

```typescript
type ApplicationAttempt = {
  attemptId: string
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'
  appliedDate: string
  matchLevel?: MatchLevel // frozen at attempt time
  notes?: string
}
```

`company`, `role`, and `requiredSkills` now live on `Job` only — never duplicated per attempt. The Applications page becomes a derived view (`jobs.filter(j => j.applications.length > 0)`), not its own CRUD store.

**Why field ownership split the way it did:**

- **Shared, not duplicated — `company` / `role` / `requiredSkills`:** These describe the job posting itself. The user owns and edits their own Job data directly — it isn't pulled live from an external source that could drift underneath them — so editing a Job's fields retroactively applying to all its attempts is the correct behavior, not a data-integrity risk. This retires the "Fat Application" shape from the previous entry, where these fields were copied onto every `Application` at creation time and could silently go stale relative to the `Job` they came from.
- **Still frozen per attempt — `matchLevel`:** This is the one field where the old snapshot reasoning still holds. The same `Job` can be matched against different resume versions over time (`matches: JobMatchRecord[]` already supports this), so a match result has to stay pinned to the attempt it was relevant to — overwriting it with a later, unrelated match would misrepresent what the user actually knew when they applied.
- **Per-attempt, not per-job — `notes`:** Feedback and context from one application round (e.g. interviewer notes, rejection reason) shouldn't bleed into a later reapply to the same job. Each attempt keeps its own notes.

**Also decided:** reapplying to the same job after rejection is a real, supported scenario — hence `applications` is an array (multiple attempts per job), not a single optional object.
