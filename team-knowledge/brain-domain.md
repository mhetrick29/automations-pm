# Brain Domain Reference

Shared context for all agents working on Brain/AIOps products.

## Brain Teams

| Team | Responsibility |
|------|---------------|
| **AI Models** | New models, training, inference |
| **AI Platform** | Orchestration, scheduling, execution |
| **AI Monitoring-Pipeline** | Configuration, data flow, signals |
| **AI Monitoring-Actions** | Impact assessment, notifications, escalation |
| **Auto-Diagnosis** | Root cause analysis, diagnostics, remediation |
| **AI Experiences** | UI, incident experience, dashboards |

## External Ecosystem Partners

- **SLO/SLI Platform** — Service-level objective and indicator infrastructure
- **ARG** (Azure Resource Graph) — Resource discovery and querying
- **IcM** — Incident management system

## Core Domain Model

```
signals → scopes → models → monitors → policies/actions
```

- **Signals**: Telemetry data points (metrics, logs, traces) from monitored services
- **Scopes**: Logical groupings that define what a monitor observes (e.g., per-resource, per-region)
- **Models**: AI/ML models that analyze signals within scopes to detect anomalies
- **Monitors**: Configured detection units that combine signals, scopes, and models
- **Policies/Actions**: Rules that determine what happens when a monitor fires (notify, escalate, auto-remediate)

## Key Terminology

| Abbreviation | Term |
|-------------|------|
| IM | Intelligent Monitors |
| OPM | Outage Prediction Model |
| EB | Error Budget Anomaly detection model |
| SLI | Service Level Indicator |
| SIA | Standard Impact Assessment |
| TV | Traffic Volume anomaly detection model |
| SC | Status code anomaly detection model
