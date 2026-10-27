# ANIMATION_SYSTEM.md — GSAP conventions

GSAP is the **designated animation library** for all scroll-driven and
progress-linked motion on this site (decision recorded in `AGENTS.md`).
**Status: GSAP is installed** (`gsap` + ScrollTrigger added to
`package.json` on 2026-10-24; `gsap.registerPlugin(ScrollTrigger)` once in
`src/main.jsx`). First use: the shared content-reveal hook
`src/components/useSectionReveal.js`, consumed by the five About sections
and the three Expertise pages — `gsap.matchMedia()` + a REVERSIBLE
(`toggleActions: 'play none none reverse'`) timeline of fromTo groups
(`y: 10–22` → 0, `autoAlpha`), with `immediateRender: false` so content is
never stranded in a hidden "from" state, `transform`/`opacity` only, one
ScrollTrigger per section (`start: 'top 78%'`), reverted via `mm.revert()`
on unmount. Groups are role-based and sequenced inside ONE timeline
(metadata → headline → paragraph → CTA/features; per-group `y` and
duration per the motion table in the scroll-animation spec; 0.08 stagger,
0.18 group overlap). The former `once: true` behaviour was replaced so
reveals reverse cleanly when the visitor scrolls back upward. Whether the
About sequence's later blocks use pinning/scrubbing is a future
implementation decision this document's conventions already cover.

## Animation ownership

- GSAP owns scroll-driven animation timelines and progress-linked motion.
- Use **ScrollTrigger** whenever its pinning, scrubbing, trigger, or
  progress-mapping features are appropriate.
- **Never implement a second, competing scroll-animation engine** for an
  interaction ScrollTrigger already covers (manual scroll listeners driving
  keyframe math, IntersectionObserver timelines duplicating ScrollTrigger,
  etc.).
- **Do not add Lenis or any other smooth-scroll library** unless the owner
  explicitly requires and justifies it. Native scrolling is assumed (CSS
  `scroll-behavior: smooth`, motion-gated, owns anchor glides; the
  scroll-position → route sync in `App.jsx` is *state detection*, not
  animation, so it is not a competing engine).

## Progress mapping

For an animation controlled by normalized progress \(p\):

\[
p \in [0,1]
\]

For an element moving from position \(x_0\) to \(x_1\):

\[
x(p)=x_0+p(x_1-x_0)
\]

For an animation spanning scroll distance \(D\), define its normalized
progress as:

\[
p=\operatorname{clamp}\left(\frac{s-s_0}{D},0,1\right)
\]

where \(s\) is the current scroll position and \(s_0\) is the animation's
starting scroll position.

Plain-text form (kept for grep-friendly review):

```text
p ∈ [0, 1]
x(p) = x0 + p · (x1 − x0)
p(s) = clamp((s − s0) / D, 0, 1)
```

**Use GSAP's native mechanisms when they already provide this mapping.**
ScrollTrigger's `start`, `end`, and `scrub` implement exactly this
normalization, and easing is produced by GSAP timelines rather than by hand.
Do **not** introduce redundant custom scroll calculations (manual scroll-Δ
division, clamping, or per-frame lerp) where `scrub` does the job. Custom
math is acceptable only for genuinely value-driven effects (for example,
element-dimension deltas) and should feed ScrollTrigger's callback/progress
APIs, not replace them.

### In use — About positions and the retired progress trigger

The AboutBar track (`src/components/AboutBar.jsx`,
`styles/about-bar.css`) is a **cumulative five-position step indicator**,
not a flowing fill: one fixed position per subsection
(Intro/Philosophy/Approach/Values/Closing), active positions accumulate as
the sequence advances (`A_j = j <= i`, `N_active = i + 1`), and outside the
About sequence no position is active. The former per-scroll
progress ScrollTrigger that wrote a normalized `--about-progress` root
variable (and an imperative `aria-valuenow`) was retired with this change —
no continuous mapping remains anywhere in the codebase.

- **Single authoritative source**: the active subsection index comes from
  the same scroll-synced route state in App.jsx that drives the address
  bar, document title and top timeline. Routes without a sequence position
  (e.g. `home`) resolve to −1 (no active positions), so no stale About
  state reaches other pages. All five blocks are now in the ordering map
  (`about: 0`, `philosophy: 1`, `approach: 2`, `values: 3`,
  `closing: 4`); nothing else changes.
- **Discrete UI state, not per-frame animation**: position activation is a
  React class change on the changed position only. Positions never move,
  resize, slide or stretch; the paint layer (`::after`) is always the same
  full dash and only its opacity carries the state — no `scaleX`
  interpolation, no translating highlight, no track-width animation.
- **The only eased values are the changed position's opacity
  (`0.2s ease`, motion-gated)** under `prefers-reduced-motion:
  no-preference`; instant under reduce. Continuous scroll → *discrete*
  state remains the boundary of what a scroll listener is allowed to drive
  (see the ownership rules above).
- **ARIA**: `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=5`,
  `aria-valuenow` = active position count (declared from the same state
  that renders the classes — no imperative writers left).
- **Bar lifecycle**: the persistent bar animates nothing — it pins via CSS
  sticky inside the About region and releases exactly when the region's
  content ends; the cumulative states keep counting with scrolling inside
  the sequence and reset naturally outside it.

## Implementation requirements

### Scoping and lifecycle (React is the installed framework)

- Scope selectors to the relevant component: pass a scope element as the
  second argument of `gsap.context()`; selector text then resolves only
  inside that component tree, never document-wide.
- Build animations in `useEffect` — never during render. Revert owned
  animations and ScrollTriggers during cleanup (`ctx.revert()` /
  `mm.revert()`) so remounts (StrictMode, Fast Refresh) leave no orphaned
  triggers. Note: `App.jsx` keeps all content sections mounted for the
  session — navigation is scroll, not unmount; ScrollTriggers therefore
  persist for a section's lifetime and must clean up only on that
  section's own unmount.
- Register ScrollTrigger once (`gsap.registerPlugin(ScrollTrigger)` in
  `src/main.jsx`) — done.

```jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'                       // installed
import { ScrollTrigger } from 'gsap/ScrollTrigger' // registered in main.jsx

export function Section() {
  const scopeRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.to(trackRef.current, {
          x: () => -(trackRef.current.scrollWidth - window.innerWidth),
          scrollTrigger: {
            trigger: scopeRef.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            invalidateOnRefresh: true, // recompute x on resize/refresh
          },
        })
      }, scopeRef)
      return () => ctx.revert()          // also fires on condition change
    })
    return () => mm.revert()             // final unmount cleanup
  }, [])

  return <section ref={scopeRef}>…</section>
}
```

- Avoid duplicate triggers during rerenders or remounts: create animations
  only inside effects with stable dependency arrays, keep every trigger
  inside the context/matchMedia cleanup pattern above, and never register the
  "same" animation twice for one element.

### Performance

- Prefer `transform` and `opacity`. Do not animate layout-affecting
  properties (`top/left/width/height/margin`) per frame.
- Prevent unnecessary layout recalculation and React state updates on every
  animation frame: scroll-linked visual values belong to GSAP (via `scrub`,
  or `onUpdate`/`quickSetter` writing styles directly); React state is for
  discrete UI changes only if React is present — it is, so this rule applies.

### Responsive behaviour

- Compute dynamic values as function-based values
  (`x: () => track.scrollWidth - window.innerWidth`) with
  `invalidateOnRefresh: true`, so viewport resizing and orientation change
  re-measure on refresh instead of storing one-off numbers.
- Call `ScrollTrigger.refresh()` after layout changes the component causes
  itself (e.g. lazy images with unknown intrinsic size) rather than guessing
  dimensions.

### Reduced-motion accessibility

- Wrap motion-creating code in `gsap.matchMedia()` with the
  `(prefers-reduced-motion: no-preference)` condition (pattern above). Under
  `reduce`, either skip the animation entirely or register a neutralized
  variant that leaves content fully visible without motion. Never leave
  content inaccessible because its entrance animation never ran.

### Verification checklist (animation tasks)

Verify in a real browser at a phone-sized viewport — never report unverified
checks:

- Touch scrolling is smooth; scrub/pinning does not fight native scroll.
- Resize and orientation change keep the layout correct after refresh; a hard
  reload at a scrolled position still lays out correctly.
- Pinned sections release correctly, with no dead space from leftover pin
  spacers after unmount.
- Stacking contexts: where pinned layers sit relative to overlays (e.g. the
  MobileMenu dialog), `overflow` on ancestors (pinned elements must not sit
  inside an `overflow: hidden` ancestor), and transforms on ancestors (they
  create containing blocks that break `position: fixed` pinning).
- Reduced-motion behaviour verified under `prefers-reduced-motion: reduce`.
