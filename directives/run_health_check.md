---
description: Run the core TypeScript, Lint, and Jest pipeline
---

# LSTNR Health Check Directive

**Goal**: Automatically run the comprehensive static analysis and testing pipeline to ensure the frontend code is healthy and ready for deployment.

## Execution Path

1. Run `python execution/run_health_check.py`
2. The script sequentially executes:
   - TypeScript compilation check (`npx tsc --noEmit`)
   - ESLint static analysis (`npx eslint .`)
   - Jest Unit/Component tests (`npm run test:ci`)
3. The script aggregates the results and prints out clear `✅` or `❌` indicators for each phase.

## Outputs

- Terminal output with pass/fail logs for TS, Lint, and Jest.

## Self-Annealing Guidelines

- **Missing Scripts**: If `eslint` or `test:ci` fails strictly because the `package.json` script isn't found, fall back to running `npx jest` or `npx eslint .` directly.
- **Failures Found**: If a test or typecheck fails, do NOT commit. Read the stdout trace provided by the execution script, fix the code in `src/`, and re-run the health check until everything passes.
