# Writing Style Guide

Team-level writing conventions for all Brain/AIOps agents. These patterns ensure consistency across specs, research reports, and other deliverables.

Contributors can add personal style overrides in `team-knowledge/writing-styles/[name]-style.md`.

## Voice & Tone

- **Direct, outcome-focused, executive-ready.** Short sentences, action verbs, minimal jargon.
- **Bold key terms at first mention** (e.g., **Intelligent Monitors**, **Noise Tolerance**).
- Prefer "services get X" over "we will build X" — always customer-first framing.
- Avoid hedging language ("might", "could potentially") — be precise about what is and isn't in scope.

## TL;DR Pattern

Use a transformation statement: *from X to Y*.

> Intelligent Monitors unify Brain's fragmented per-SLI/per-model approach into a single, AI-driven monitor — transforming the experience from *"one monitor per SLI × model with manual tuning"* to *"one intelligent monitor that Brain auto-tunes across your signals."*

## "The Ask" Section

Always be specific: name the teams, the timeline, and the pilot scope.

> - Cross-team engineering investment: AI Experiences (UX), AI Monitoring-Pipeline (config), AI Monitoring-Actions (detection), AI Models (OPM integration)
> - Partnership with 3-5 pilot services for V1 validation by end of March 2026
> - Leadership support for IM as the default monitor paradigm by Fall 2026

## Hypothesis Format

Structure as: If we do X for Y, then metric Z will move by P, because data/research showed ABC.

> If we build a unified, extensible Brain detection offering that automatically ingests all service signals and enables scenario-based detection with minimal configuration, then we will reduce missed outages, accelerate onboarding, and improve user satisfaction.

## Problem Framing

- **Bold lead phrases** that name the pain point (e.g., **Getting to outage mode is hard**).
- Tie every problem to a specific scenario from the Users & Scenarios section.
- Use evidence: customer messages, telemetry data, incident counts, support ticket volumes.
- Separate External (Customer/DRI) pain from Internal (Brain/Ops) pain.

## Goals vs. Features

- Goals describe **what the customer wants** (outcomes), not what we build (features).
- Map every P0/P1 goal to a success metric with baseline → target → owner.
- Features go in the Capabilities section, sorted by priority.
