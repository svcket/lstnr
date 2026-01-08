---
description: Run full test suite and commit changes automatically
---

This workflow runs linting, type checking, and tests, then commits changes if everything passes.

1. Run Type Check
   // turbo
   tsc --noEmit

2. Run Tests
   // turbo
   npm run test:ci

3. Add all changes
   // turbo
   git add .

4. Commit Changes
   git commit -m "updates"
