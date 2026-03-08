---
description: Guide for orchestrating State (Zustand) and global app routing
---

# State & Architecture Orchestrator Directive

**Goal**: Implement and maintain complex state requirements and global data flows across LSTNR React Native components effectively, preventing prop drilling.

## Responsibilities

- Zustand store creation, modification, and organization.
- Managing side-effects safely.
- Optimizing React Navigation stack flows and deeply nested routing interactions.

## Execution Path

1. Map out the state requirements.
2. If creating a new Zustand store, place it in `src/store/`.
3. To verify store syntax and validity, run `python execution/test_zustand_store.py {path_to_store_file}`.
4. If integrating with Supabase realtime data, ensure listeners are securely unmounted in `useEffect` returns.

## Self-Annealing Guidelines

- **Stale Closures**: If Zustand state seems outdated inside a callback or hook, remind yourself to use the `useStore.getState()` method directly for non-reactive readings.
