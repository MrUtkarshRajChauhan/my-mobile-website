# WORKING_TREE.md — working protocol

How implementation tasks are executed in this repository. The specialized
`mobile-ui` agent (`.opencode/agents/mobile-ui.md`) follows this protocol as
well.

## Task sequence

1. **Inspect** — Read `AGENTS.md` and the relevant specialized instructions.
   For UI work read `docs/PROJECT_CONTEXT.md`; for animation work also
   `docs/ANIMATION_SYSTEM.md`. Then read the actual source files the task
   touches. Never modify a file you have not read.
2. **Specify** — Translate the requested result into concrete requirements and
   acceptance criteria that can be checked (elements, copy, spacing, states,
   routes, animation entry points). No invented scope.
3. **Plan** — Identify the files to change, the components touched, any
   dependency requirement, and the risks (e.g. interaction with the hash
   routing in `App.jsx`, the menu overlay, or existing asset references).
   Choose the smallest coherent set of changes that achieves the objective.
4. **Implement** — Make exactly those changes. No drive-by refactors, no
   unrelated edits, no placeholder stubs posing as features.
5. **Verify** — Run the checks this project actually has: `npm run build` for
   anything the build consumes, and functional checks in the browser via the
   dev (`npm run dev`) or preview (`npm run preview`) server at a phone-sized
   viewport. No test framework or linter exists — do not fabricate test runs.
6. **Correct** — Fix every regression, visual discrepancy, or console error
   found during verification, then re-verify.
7. **Document** — Update `docs/PROJECT_CONTEXT.md` (and the stack table in
   `AGENTS.md` or `docs/ANIMATION_SYSTEM.md` when relevant) in the same task
   whenever architecture, stack, or status changes.
8. **Report** — Summarize: files changed; checks performed and their results
   (e.g. build OK, not run); what was verified in a browser vs. what remains
   an untested assumption; defaults chosen for nonessential details; and
   unavoidable blockers. No unnecessary approval checkpoints.

## Working-tree rules

- **Never overwrite uncommitted user changes.** Before modifying a file,
  confirm you have read its current content in this session; if it contains
  work unrelated to the task, preserve it.
- **Git status:** as of this file's creation (2026-10-23) the directory is
  **not a Git repository** (`git status` fails with "not a git repository").
  While that holds there is no status/diff safety net — compensate with
  careful, scoped edits and exact replacements. The moment the directory
  becomes a Git repository: inspect `git status` before modifications; never
  `reset`, `clean`, `checkout`, or `restore` to obtain a clean working tree;
  never discard user changes.
- **Keep each task's changes scoped to its objective.** If a task appears to
  require destroying or regenerating existing work, stop and report instead
  of proceeding.
- **No commits or pushes** unless the owner explicitly instructs it for that
  task.
- **Honesty:** distinguish verified completion from untested assumptions in
  every report. Never claim that a file, test, animation, or browser
  interaction was verified unless it actually was.
