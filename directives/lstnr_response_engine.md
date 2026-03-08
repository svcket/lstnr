---
description: Guide for building schemas and mapping AI JSON data streams
---

# AI Response Engine Specialist Directive

**Goal**: Seamlessly design, map, and validate the complex JSON schemas that power LSTNR's generative integrations safely avoiding hallucinated props.

## Responsibilities

- Validate Zod schemas and TypeScript inference types.
- Ensure proper fallback states for missing or malformed AI data.
- Manage structured output mapping.

## Execution Path

1. Analyze the requested AI prompt or mapping change.
2. Ensure the TypeScript types matching the intended AI schema are exact.
3. Run `python execution/verify_json_schema.py {path_to_schema_file}` to ensure valid JSON structure templates.
4. If testing real output, mock a JSON response and verify the UI fallbacks trigger correctly.

## Self-Annealing Guidelines

- **Type Mismatches**: If TypeScript complains about a missing optional property in a mapped AI component, ALWAYS add a fallback UI state (e.g., `data?.field ?? 'Default'`) instead of forcing non-null assertions.
