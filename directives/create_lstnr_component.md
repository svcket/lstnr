---
description: Scaffolds a React Native component adhering to the LSTNR design system
---

# LSTNR Component Scaffolder Directive

**Goal**: Automatically generate a standardized React Native component using the LSTNR `theme.ts` (colors, spacing, typography) and a standard index export file.

## Inputs

- `name`: The camelCase or PascalCase name of the component (e.g., `ArtistCard`).
- (Optional) `dir`: The directory path (e.g., `src/components/common`). Defaults to `src/components`.

## Execution Path

1. Run `python execution/run_create_lstnr_component.py {name} --dir {dir}`
2. The script will create a new folder for the component.
3. It will populate `index.ts` and `{name}.tsx` with a standard boilerplate containing an interface and `StyleSheet` usage tied to `theme.ts`.
4. It will calculate the relative path to `theme.ts` automatically based on the directory depth.

## Outputs

- `src/components/[name]/[name].tsx`
- `src/components/[name]/index.ts`

## Self-Annealing Guidelines

- **Import Errors**: If the generated component has a bad path to `theme.ts` because the standard structure changed, manually verify the location of `theme.ts` and update the executed script logic to point to the correct file path.
