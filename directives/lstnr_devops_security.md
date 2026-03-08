---
description: Guide for Auth, RLS, Deployments, and Environment Security
---

# DevOps & Security Guardian Directive

**Goal**: Handling Authentication states (Supabase Auth/OAuth), Row Level Security (RLS) policies, deployment configurations (e.g., Vercel, EAS Build), and secure environment variables.

## Responsibilities

- Verifying deployment readiness (API key mappings).
- Securing Supabase tables via RLS.
- Managing proxy caches or edge caching logic.

## Execution Path

1. Analyze the requested security profile or deployment error.
2. If verifying environment variables, run `python execution/audit_security_rules.py` to ensure local `.env` keys exist and map correctly to the required components.
3. If an RLS policy needs updating, draft a safe migration script via the Core Data Architect skill.

## Self-Annealing Guidelines

- **Missing Secrets**: Do NOT proceed with code that calls `process.env.XXX` if the `.env` placeholder does not exist. Instruct the user to add it first.
