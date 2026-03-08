---
description: Guide for building and modifying LSTNR UI components
---

# UI & Design System Architect Directive

**Goal**: Build, modify, or style UI components (buttons, layouts, cards) while strictly adhering to the LSTNR design system.

## Responsibilities

- Mobile-first responsiveness.
- Pixel-perfect adherence to LSTNR aesthetic (dark theme, gradients, glassmorphism).
- Proper usage of generic components and `src/theme/theme.ts`.

## Execution Path

1. Analyze the requested UI change.
2. Check existing generic components in `src/components/common` before building new ones.
3. If scaffolding a new component, trigger `python execution/run_create_lstnr_component.py {ComponentName}`.
4. Modify the component using localized `StyleSheet` definitions tied to `theme.colors`, `theme.typography`, and `theme.spacing`.
5. Run `python execution/verify_ui_theme.py {path_to_file}` to ensure no hardcoded hex strings or arbitrary spacing values were used.

## Self-Annealing Guidelines

- **Hardcoded Values**: If `verify_ui_theme.py` fails due to hardcoded colors (e.g., `#FFFFFF`), replace them with the semantic equivalent from `theme.ts` (e.g., `theme.colors.text.primary`).
