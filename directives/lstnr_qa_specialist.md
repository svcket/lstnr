---
description: Guide for maintaining robust code quality pipelines
---

# Verification & QA Specialist Directive

**Goal**: Identify and resolve TypeScript errors, ESLint infractions, and manage testing pipelines (Jest/Detox). Be the primary executor for CI-like feedback loops locally.

## Responsibilities

- Strict TypeScript enforcement (`any` type elimination).
- ESLint and unit test remediation.
- Safely falling back or failing explicitly on malformed runtime data.

## Execution Path

1. You are actively triggered when a user needs to fix type errors, broken lint pipelines, or maintain test coverages.
2. Run `python execution/run_health_check.py` to get an unfiltered view of the repository's errors.
3. Apply targeted Code Actions via standard editing tools to fix `src/` files.
4. Iterate until `run_health_check.py` returns `0` (Success).

## Self-Annealing Guidelines

- **Type Hacks**: Do not use `@ts-ignore` to suppress errors unless specifically directed. Instead, define proper interfaces or use `unknown` with runtime narrowing.
