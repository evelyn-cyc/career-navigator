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
