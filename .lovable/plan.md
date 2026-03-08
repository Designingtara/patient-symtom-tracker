

## Plan: Catch-up Feature

### Logic

- Compute `daysSinceLastLog` from `entries` array (most recent `timestamp`). If ≥ 3 days and ≥ 5 total entries, show catch-up card.
- Compute top 5 most frequently logged symptoms by counting across all entries' `symptoms[]` arrays.
- Session-dismiss state: a `useState(false)` flag — "Not now" sets it to `true`, hiding the card for this session only.
- After saving from catch-up mode, exit back to normal and hide the card.

### New Component

**`src/components/log/CatchUpCard.tsx`**
- Warm card with message: "Welcome back. No pressure — want to do a quick check-in?"
- Two buttons: "Quick check-in" / "Not now" (min 44px touch targets, accent colors)
- When "Quick check-in" tapped: shows the top 5 symptoms as toggle chips, plus saved Symptom Profiles as one-tap buttons, a severity slider, and Save button — a simplified inline form
- Props: `entries`, `profiles`, `onDismiss`, `onSave` (passes a partial LogEntry back to LogView's save logic)

### Changes to `src/pages/LogView.tsx`

- Add `dismissed` session state and `isCatchUpMode` state
- Before the main form, check: `daysSinceLastLog >= 3 && entries.length >= 5 && !dismissed`
  - If true and not in catch-up mode: render `CatchUpCard` with dismiss/start handlers
  - If in catch-up mode: render the quick check-in UI (symptom chips + profiles + severity + save)
  - Otherwise: render normal form as-is
- On save from catch-up: create entry same as normal `handleSave`, then exit catch-up mode
- Helper function `getTopSymptoms(entries, n)` — count symptom frequencies, return top N

### No changes to

Dashboard, Settings, About, theme, navigation, or existing Log form behavior.

