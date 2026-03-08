# Skills Curator Workflow

This document serves as the master guide for generating, curating, and refining new skills within our 3-layer agentic architecture. Whenever there is a need to establish a new reproducible agent capability, the steps and architectural principles outlined below MUST be followed.

## 1. Architectural Alignment

Every new skill must align with the 3-layer separation of concerns:

1. **Layer 1: Directive (Intent)**
   - **Location**: `directives/[skill_name].md`
   - **Purpose**: Defines the SOP (Standard Operating Procedure) for the skill.
   - **Contents**: Goals, required inputs, edge cases, expected deliverables, and the exact names of the execution scripts to call.
   - **Tone**: Written in natural language as instructions to the Orchestration layer.

2. **Layer 2: Orchestration (Decision & Routing)**
   - **Location**: Handled dynamically by the AI Agent.
   - **Purpose**: Reads the directive, gathers context, executes the specified scripts, handles errors, and performs self-annealing.
   - **Rule**: Do NOT write static code for decision-making unless absolutely necessary. Rely on the LLM's orchestration capabilities guided by the directive.

3. **Layer 3: Execution (Deterministic Logic)**
   - **Location**: `execution/[script_name].py`
   - **Purpose**: The actual deterministic tools handling API calls, data transformation, or programmatic tasks.
   - **Contents**: Python scripts that read from `.env`, take clear inputs, and produce structured outputs.
   - **Rule**: Keep scripts dumb, fast, and testable.

## 2. Skill Creation Protocol

When tasked with creating a new skill, execute the following steps:

### Step A: Define the Scope

- Verify the skill does not already exist in `skills.md`.
- Determine the final deliverable (e.g., a cloud document, a committed codebase change, a populated database).

### Step B: Draft the Directive

Create a markdown file in the `directives/` directory. It must contain:

- **Title**: Clear, action-oriented title.
- **Goal**: 1-2 sentences on what the directive accomplishes.
- **Execution Path**: A step-by-step list pointing to the exact scripts in the `execution/` folder to run.
- **Self-Annealing Guidelines**: Common failure points (e.g., rate limits, bad data) and how the agent should pivot or fix the scripts if encountered.

### Step C: Build the Execution Scripts

Create the necessary deterministic scripts in the `execution/` directory.

- Do NOT hardcode credentials (use `.env`).
- Ensure the script outputs clear, parseable errors (e.g., Python stack traces) so the orchestration layer can self-anneal.
- Any temporary data must be written to `.tmp/`.

### Step D: Register the Skill

Update the `skills.md` file (or equivalent registry) to document the new capability. Include:

- A brief description of the new skill.
- The exact trigger/intent that should cause the agent to use this skill.
- A pointer to the corresponding directive file.

## 3. The Self-Annealing Loop

As new skills are curated, they will inevitably break during execution. When managing these skills:

1. **Fix the Execution**: Modify the Python scripts if an API changes or logic fails.
2. **Update the Directive**: If a new edge case is discovered, document the workaround in the `directives/` SOP.
3. **Iterate**: The system is intended to become stronger over time as edge cases are folded into the directives and execution layers.
