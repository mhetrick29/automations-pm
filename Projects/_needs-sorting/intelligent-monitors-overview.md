# Intelligent Monitors Overview

## What is an Intelligent Monitor?

Self-tuning, prompt-configurable monitors that use Brain to reason over signals (SLIs, Geneva monitors, MDM metrics) to create incidents, declare outages, and send comms—without manual tuning.

## Core Definition

**Intelligence** = The ability to:

1. **Reason** over available data to make decisions
2. **Self-tune** based on new data (user rules, incident labels, DRI feedback)
3. **Select optimal signals and models** for the job
4. **Accept natural language prompts** as configuration

## Key Differentiator

Users express *intent*, not thresholds:

- *"Don't wake me for single-region unless Tier 0"*
- *"Outage only if 3+ correlated anomalies in 5 min"*
- *"Ignore anomalies during maintenance"*

## Comparison

| Aspect | Traditional Monitors | Intelligent Monitors |
|--------|---------------------|---------------------|
| Config | 9+ params per model | Optional high-level guardrails |
| Alerts | Threshold-based | Context-aware reasoning |
| Tuning | Per-model | Self-tuning across signals |
| Learning | Static | Learns from DRI behavior |

## Go-to-Market Phases

### Phase 1: Introduce the Paradigm Shift

- Users see Brain monitoring all signals at once via high-level settings
- Built on OPM (not branded as "OPM monitor") because:
  - OPM has no control surface today
  - OPM already uses multiple signals
  - DT/EB still require manual params

### Phase 1.5: Hybrid Anomaly Detection (DT + EB)

- Brain incorporates anomaly detection models into intelligent monitors
- **Hybrid model approach**: Selects best model per SLI or weights multiple models
- **Prerequisites**:
  - Auto-tuned models (DT & EB self-configure)
  - Smart throttling to avoid anomaly floods

### Phase 2: Unified Anomaly Detection

- Smart model selection across all models
- Customers configure nothing but ICM team
- Brain backtrains on onboard

### Phase 2.5 (Exploring): Geneva Monitor Integration

- Noise-filtering agent for Geneva monitors
- Geneva incidents → Brain reasons → outage decision
- Geneva monitors not yet inputs to OPM models

## Future Exploration

- Custom outage reasoning prompts
- Prompt-based severity determination
- Geneva/MDM as inputs to prediction & anomaly models
- Prompt-based impact assessment (SIA without 9+ params)
- Extensible skills (e.g., "S500 customers" scoping skill)
