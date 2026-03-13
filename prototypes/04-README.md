# Prototype 4: Unified Intelligent Monitor Lifecycle

## Overview

This prototype combines three prior explorations into one unified flow that tells the full lifecycle story of an Intelligent Monitor — from creation through iterative confidence-building over multiple user visits.

**File:** `04-unified-im.html` (single self-contained HTML/CSS/JS file)

## The Problem

Three separate prototypes each explored different aspects of the Intelligent Monitor UX:
- **P1** (`01-create-intelligent-monitor.html`): Create → Train → What-if preview (risk tolerance slider, "what changed" card)
- **P2** (`02-create-im-go-live-first.html`): Safe defaults → Auto go-live → Feedback-driven trust (guided review, feedback drawer)
- **P3** (`03-create-im-side-by-side.html`): Side-by-side edit + backtesting (persistent right panel, strongest what-if)

Users need a single unified flow that connects the dots across visits.

## Key Design Decisions

1. **Safe defaults** — Sev3, outage off, comms off. Users start low-risk and upgrade as confidence grows.
2. **View → Edit transition** — Screens 6/7 start in view mode. "Edit" transforms to side-by-side layout.
3. **What-if = live edit integration** — Left panel IS the real editor; right panel reads settings from it for backtesting.
4. **Tolerance is the primary what-if parameter** — Binary toggles are predictable; what-if is for parameters where impact is hard to predict (like risk tolerance).
5. **Historical data drives the experience** — 6a (no data) vs 6b (has data) are the same product responding to whether the service has historical SLI/IcM data.
6. **Feedback as training data** — The guided review flow is framed as giving Brain training feedback, not just user approval.

## Screen-by-Screen Walkthrough

### Visit 1: Create the Monitor

| Screen | What Happens |
|--------|-------------|
| **1** | Empty state CTA — "Create Intelligent Monitor" |
| **2** | Create form: name, description, IcM team, Service Tree |
| **3** | Signal selection with quality indicators (dots) |
| **4** | Actions & Enrichments: severity (Sev3 default), outage toggle (off), comms toggle (off), TSG, **Risk Tolerance slider** (Conservative / Balanced / Aggressive) |
| **5** | Training in progress with animated progress bar, per-signal status, collapsible monitor details |

### Visit 2: First Review (Screen 6)

Two scenario variants controlled by buttons:

**Screen 6b — Historical data available (happy path)**
- Full comparison summary: "Of your 8 outages in the last 7 days, Brain would have caught 5..."
- Dual-track timeline showing existing monitors vs Brain detections
- Collapsible outages table with source filtering (All / Brain / Geneva)
- "Review Detections" → opens guided review drawer
- "Enable Outage Declaration" → go-live modal with safe defaults confirmation

**Screen 6a — No historical data (edge case)**
- Limited forward-looking data (3 events over 3 days since training)
- Shorter timeline, smaller table (not collapsed since only 3 rows)
- "Enable Outage Declaration" disabled — needs more data
- Amber guidance: "Brain needs more time..."

### Edit Mode (from any screen)

Clicking "Edit" transforms the layout:
- **Left panel:** Full edit form (basic info, signals, actions & enrichments with risk tolerance slider)
- **Right panel:** What-If backtesting — select time range, region, incidents, then "Run Backtest"
- **Backtest results:** "What Changed" card (parameter delta + impact), stats row (detected/false positives/missed/avg faster), detailed results table with verdict badges
- Clicking "Cancel" returns to the previous view mode screen

### Visit 3: Return After 2 Weeks

Three "welcome back" transition experiences (Screen 6.5, selectable via scenario buttons):

| Variant | Experience |
|---------|-----------|
| **6.5a — Banner** | Lightweight notification banner: "Brain has detected 4 new events since your last visit" with "Review Now" button |
| **6.5b — Highlights** | Same layout with "NEW" badges on items, delta summary showing what changed since last visit |
| **6.5c — Activity Feed** | Dedicated chronological feed of what happened while away (detections, confirmations, false positives, confidence updates) |

**Screen 7 — Full Review & Tuning**
- 14-day performance summary (12/15 outages caught, 4 extras, ~11min faster, 4 unreviewed)
- Rich 2-week timeline with 🆕 badges on new events
- Collapsible 19-event results table
- Guidance: "Ready to fine-tune? Try Aggressive tolerance..."
- Edit mode → adjust risk tolerance, run backtest to see impact

## Scenarios

| Button | What it does |
|--------|-------------|
| Happy Path (6b) | Default. Historical data available, full backtest results from training |
| No Historical Data (6a) | Limited forward-looking data only |
| Return: Banner (6.5a) | Lightweight notification banner return experience |
| Return: Highlights (6.5b) | "What's new" badges and delta summary |
| Return: Activity Feed (6.5c) | Chronological feed of activity while away |

## Source Files

| Source | What was used |
|--------|--------------|
| P2 (`02-create-im-go-live-first.html`) | CSS design system, Screens 1-5, Screen 6 view mode (comparison box, timeline, table), feedback drawer, go-live modal |
| P3 (`03-create-im-side-by-side.html`) | Side-by-side layout (content-wrapper + right-panel), backtesting form/progress/results, view/edit mode toggle |
| P1 (`01-create-intelligent-monitor.html`) | Risk tolerance slider concept, "what changed" card pattern, what-if stats layout |

## Future Prototypes to Build

- **Mixed SLI quality scenario** — Some signals are noisy/unreliable. How does this affect Brain's confidence and the user's trust journey?
- **Critical signal deletion** — User tries to remove a signal Brain depends on. What warnings/guardrails should exist?
