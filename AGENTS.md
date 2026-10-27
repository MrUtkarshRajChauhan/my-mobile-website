# AGENTS.md — mobile-my web

Authoritative instructions for every OpenCode session working in this
repository. Detailed project facts live in `docs/PROJECT_CONTEXT.md`, animation
conventions in `docs/ANIMATION_SYSTEM.md`, and the per-task protocol in
`docs/WORKING_TREE.md`. When these notes drift from the actual code, the code
wins — update them in the same task that changes the stack or architecture.

## Project identity and isolation

This repository is **"mobile-my web"**: a completely new, independent,
standalone mobile website (mobile-first portfolio). It has zero assumed
correlation with any of the owner's previous projects, repositories, websites,
codebases, designs, assets, or technical decisions. Mandatory rules:

1. Inspect only this repository and its actual configuration for facts; assume
   nothing about the stack or decisions from anywhere else.
2. Do not import previous projects' architecture, code, assets, design tokens,
   component patterns, dependencies, or implementation decisions.
3. This repository's existing files and the owner's explicit instructions for
   this project are the only authoritative sources of truth.
4. Reuse a previous concept only when the owner explicitly requests it, and
   then adapt it to this project's actual requirements — never copy blindly.
5. Inspect the relevant existing code and understand the current architecture
   before implementing anything.
6. Preserve working code and existing functionality; modify only what a
   requested change explicitly requires.
7. Never invent project requirements and never make unrelated changes.
8. Work autonomously: inspect, plan internally, implement, verify, and report
   completion or unavoidable blockers — no unnecessary approval checkpoints.

## Technology stack (verified)

Recorded from `package.json`, `index.html`, `vite.config.js`, and the source
tree; details in `docs/PROJECT_CONTEXT.md`:

| Layer | Choice |
| --- | --- |
| Framework | React 19 + React DOM 19, plain JSX/ESM (`"type": "module"`) |
| Build | Vite 7 + `@vitejs/plugin-react`; npm; scripts `dev`, `build`, `preview` |
| Language | JavaScript (JSX) — no TypeScript |
| Styling | Plain CSS: `:root` tokens + home styles in `src/index.css`; per-section styles in `src/styles/*.css` imported by their component |
| Site shell | One fixed `SiteHeader` (brand + `MobileMenu`), one `SiteFooter`, one fixed `AboutTimeline` (About sequence nav) — rendered once by `src/App.jsx` over flowing content sections; the page components own no headers/rails |
| Routing | Content sections flow in one document (`main#main-content` + `SiteFooter`); hash (`#/`, `#/about`, `#/about/philosophy`, `#/about/approach`, `#/about/values`, `#/about/closing`, `#/expertise`, `#/expertise/means`, `#/expertise/stack`, `#/work`, `#/contact`) stays synced to scroll position; explicit anchors scroll sections into view below the fixed header (`scroll-margin-top`); no snap, no router dependency |
| Animation | GSAP **installed** (`gsap` + ScrollTrigger, registered once in `src/main.jsx`); restrained content reveals in the About sections via `src/components/useSectionReveal.js` (see `docs/ANIMATION_SYSTEM.md`) |
| Fonts | Local `@font-face` (Clash Display variable, from `assets/`); editorial headlines use a system serif stack; external font downloads are excluded |
| Tests / lint | None installed |
| Version control | Directory is not a Git repository |

**When the stack changes**, update this table and `docs/PROJECT_CONTEXT.md`
(“Technology stack”) within the same task.

## Session entry sequence

Every future implementation task follows this sequence internally:

1. Read this file and the relevant specialized instructions — UI implementation
   tasks may be delegated to the `mobile-ui` agent
   (`.opencode/agents/mobile-ui.md`), which follows these project instructions.
2. Read the applicable docs: `docs/PROJECT_CONTEXT.md` always; for animation
   work also `docs/ANIMATION_SYSTEM.md`; `docs/WORKING_TREE.md` for protocol.
3. Inspect the relevant source code and current project state.
4. Determine the exact implementation required by the request; preserve
   successful work unless the change explicitly requires modification.
5. Implement and verify autonomously (see "Verification").
6. Report the result — verified facts, honest blockers, no approval
   checkpoints.

## Development constraints (grounded in current code)

- **Mobile-first is the primary design constraint.** Compositions are designed
  and built for phone-sized viewports first (`index.html` viewport is locked
  to device width; `body { min-width: 320px }`). Desktop or tablet treatment
  is added only when explicitly requested.
- **Components**: one section component per file in `src/components/` with
  named exports; component-local helpers (e.g. `ArrowIcon`) stay inside their
  component file; genuinely shared components (e.g. `MobileMenu`) also live in
  `src/components/` and are imported where used.
- **Styles**: BEM-style block prefixes per component (`hero__`, `ai__`,
  `mm__`); design tokens on `:root` in `src/index.css`; per-page styles in
  `src/styles/<page>.css`, imported inside the page component file.
- **Assets** come from the root-level `assets/` directory via relative imports
  only (dev server and production build resolve the same files — see
  `vite.config.js`). Do not create new asset directories or download external
  assets; external font downloads are excluded by established constraint
  (recorded in the `src/index.css` header).
- **No invented behaviour.** Implement only what references or instructions
  define. Elements with unresolved destinations (Hero CTAs, the About `NEXT`
  button on Block 02, and the `AboutTimeline` items APPROACH / VALUES /
  CLOSING) stay non-navigational per the existing code comments. Established
  site copy (marked in component docstrings) is not paraphrased.
- **JS hygiene**: window/document listeners get cleanup in `useEffect`;
  optional DOM refs are guarded; errors are surfaced (logged or rendered),
  never swallowed.

## GSAP animation rules

GSAP owns all scroll-driven timelines and progress-linked motion; ScrollTrigger
provides pinning, scrubbing, triggers, and progress mapping whenever those
features are appropriate. Never build a second, competing scroll-animation
engine, and never add Lenis or other smooth-scroll libraries unless the owner
explicitly requires and justifies it. Full conventions and the progress-mapping
model: `docs/ANIMATION_SYSTEM.md`. Minimum bar for every animation:

- Prefer `transform` and `opacity`; never animate layout-triggering properties
  per frame, recalculate layout in callbacks, or push React state every frame.
- Create animations inside `gsap.context()` scoped to the component, built in
  `useEffect`, reverted on cleanup; kill owned ScrollTriggers; never leave
  duplicate triggers on rerenders or remounts.
- Let ScrollTrigger's `start`/`end`/`scrub` perform the scroll-to-progress
  mapping instead of custom scroll math.
- Support viewport changes via ScrollTrigger's refresh machinery
  (`invalidateOnRefresh`, `ScrollTrigger.refresh()`), not ad-hoc resize math.
- Honour `prefers-reduced-motion: reduce` by disabling or neutralizing motion
  (`gsap.matchMedia()`).

## Verification

- If the directory is (or becomes) a Git repository, run `git status` before
  modifying files and follow `docs/WORKING_TREE.md`; it is currently not one.
- Code tasks touching `src/` or anything the build consumes are complete only
  when `npm run build` passes.
- No test framework exists in this project: functional verification happens in
  a real browser on `npm run dev` / `npm run preview` at a phone-sized
  viewport — rendering, console errors, interactions, and for animation work
  touch scrolling, resize/refresh, and reduced-motion behaviour.
- Never claim a build, test, animation, or browser interaction was verified
  unless it actually was; distinguish verified completion from untested
  assumptions in every report.

## Documentation maintenance

Update the affected documents within the same task as the change they
describe:

- Stack, structure, or status changes → `docs/PROJECT_CONTEXT.md` and the
  table above.
- Animation conventions or the designated library → `docs/ANIMATION_SYSTEM.md`.
- Working protocol changes → `docs/WORKING_TREE.md`.
