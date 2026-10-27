# PROJECT_CONTEXT.md — mobile-my web

Concise, current-state record for this standalone mobile website. Everything
under "Verified facts" was checked against the repository on 2026-10-24; items
under "Pending decisions" are genuinely undecided and must not be treated as
established requirements. Update this file when the project changes (see
`AGENTS.md` → Documentation maintenance).

## Verified facts

### Purpose and scope
- `index.html` declares the site as a **mobile-first portfolio**:
  `<title>Portfolio</title>`, meta description "Mobile-first portfolio",
  viewport locked to device width with `viewport-fit=cover`.
- Implemented scope so far: **Home (Hero)**, the complete **About sequence**
  (Blocks 01–05), and **Expertise · Page 01 "MY TECH STACK"**
  (`#/expertise`) — as flowing content sections inside a shared site shell
  (fixed `SiteHeader`, fixed `AboutTimeline` for About, `SiteFooter`). The
  menu and footer list only routes that exist.
- Deliberately non-navigational pending real destinations: the Hero CTA
  buttons ("View My Work" / "Let's Talk"), Block 05's LET'S TALK
  call-to-action (no Contact destination exists), the ExpertiseBar's WORK
  control (no Work destination exists), and Expertise Pages 02–03 (not yet
  implemented). The AboutBar's final EXPERTISE control now links to the
  implemented Expertise Page 01 (`#/expertise`). No dead links are invented
  (each missing destination is a real, focusable non-navigational control).
- `Hero.jsx` cites a design mockup (`assets/ui/my-website/ui-home.png`) as the
  source of the established hero copy; **no `assets/ui/` directory exists on
  disk**, so that mockup is not currently available in the repository.
- Content gaps (reported, not filled): no Work/Expertise area, no
  Contact area. The footer surfaces only real links.

### Technology stack
- React 19.2 + React DOM 19.2; plain JavaScript (JSX, ESM,
  `"type": "module"`).
- Build tooling: Vite 7.1 + `@vitejs/plugin-react` 5.1; package manager npm
  (`package-lock.json`); scripts `dev`, `build`, `preview`; `node_modules` is
  installed.
- Styling: plain CSS. Fonts via local `@font-face`: Clash Display variable
  (`assets/ClashDisplay-Variable.woff2`) is the sans UI voice; headlines use a
  system serif stack (`'Playfair Display', Georgia, 'Times New Roman', …`).
  External font downloads are consciously excluded (stated in the
  `src/index.css` header).
- Animation: **GSAP installed** (`gsap` + ScrollTrigger, registered once in
  `src/main.jsx`). Current use: restrained content-reveal animations in the
  five About sections via the shared `useSectionReveal` hook. GSAP is the
  only animation engine; no Lenis or second scroll system.
- No router, state, or test libraries installed. Hash "routing" is scroll
  sync in `App.jsx`.
- Version control: the directory is **not a Git repository**.

### Repository structure
```text
mobile-my web/
├── AGENTS.md                       # root agent instructions
├── .opencode/
│   └── agents/mobile-ui.md         # specialized UI implementation agent
├── docs/
│   ├── PROJECT_CONTEXT.md          # this file
│   ├── ANIMATION_SYSTEM.md         # GSAP conventions
│   └── WORKING_TREE.md             # working protocol
├── index.html                      # Vite entry (mounts /src/main.jsx)
├── vite.config.js                  # react plugin; assets under root assets/
├── package.json / package-lock.json
├── .gitignore                      # node_modules/, dist/, *.local, .DS_Store
├── assets/                         # all static assets (roles below)
├── dist/                           # Vite build output (gitignored)
├── node_modules/
└── src/
    ├── main.jsx                    # StrictMode root render; registers ScrollTrigger
    ├── App.jsx                     # site shell + flowing sections + scroll-synced hash
    ├── index.css                   # :root tokens, @font-face, global + home + menu panel styles
    ├── styles/site.css             # SiteHeader (brand, menu trigger, scrim) + SiteFooter
    ├── styles/about-background.css # fixed .about-scene layer + About region wrapper (owned by App.jsx)
    ├── styles/about-timeline.css   # fixed AboutTimeline (About sequence nav)
    ├── styles/about-bar.css        # persistent AboutBar (sticky bottom navigation + track)
    ├── styles/about-intro.css      # About Block 01 styles (imported by AboutIntro)
    ├── styles/about-philosophy.css # About Block 02 styles (imported by AboutPhilosophy)
    ├── styles/about-approach.css   # About Block 03 styles + workflow rail (imported by AboutApproach)
    ├── styles/about-values.css     # About Block 04 styles (imported by AboutValues)
    ├── styles/about-closing.css    # About Block 05 styles (imported by AboutClosing)
    └── components/
        ├── SiteHeader.jsx          # fixed site header: monogram brand + MobileMenu
        ├── SiteFooter.jsx          # site footer: brand + real links + identity line
        ├── AboutTimeline.jsx       # About subsection nav (scroll-derived active state)
        ├── AboutBar.jsx            # About bottom navigation (ABOUT · progress track · NEXT)
        ├── Hero.jsx                # home section composition (no header of its own)
        ├── AboutIntro.jsx          # about Block 01 · Introduction
        ├── AboutPhilosophy.jsx     # about Block 02 · Philosophy
        ├── AboutApproach.jsx       # about Block 03 · Approach (+ workflow timeline)
        ├── AboutValues.jsx         # about Block 04 · Values
        ├── AboutClosing.jsx        # about Block 05 · Closing (LET'S TALK CTA)
        ├── ArrowIcon.jsx           # shared northeast arrow glyph
        ├── MobileMenu.jsx          # shared full-surface pages menu (app-level dialog)
        └── useSectionReveal.js     # shared GSAP content-reveal hook (About sections)
```

### Asset roles (verified by content search)
| Asset | Role |
| --- | --- |
| `my_background-contact.png` | Hero portrait (bottom-anchored transparent cutout) |
| `monogram.png` | Brand mark — shown site-wide in the fixed `SiteHeader` and `SiteFooter` through the established CSS crop window (artwork sits at x=541..994 / y=310..690 of the 1536×1024 PNG) |
| `avatar-01.jpg` … `avatar-04.jpg` | Hero trust-strip avatar stack |
| `background-work-1.jpg` | The non-Home experience's persistent background (1408×736) — byte-identical copy of the desktop project's Work/Contact artwork, painted once by the fixed `.about-scene` layer (`src/styles/about-background.css`, rendered by App.jsx) behind the whole non-Home view; cover-fitted/centred, never moved or swapped per section. The scene adds a restrained viewport-anchored corner-glow `::before` (sampled from the artwork's own pixels, compensating the portrait cover crop) and a static thread-bead SVG overlay (`SceneThreadBeads.jsx`, copied from the desktop's THREAD_SHIMMER geometry — beads rest, no motion) |
| `bg.png` | **Retired** from the shared layer (267×773 strip) — still present in `assets/` but referenced by no source file |
| `ClashDisplay-Variable.woff2` | UI font (sans voice), loaded via `@font-face` |
| `my background.png`, `signature.svg` | Present but **unreferenced by any source file** (verified by search) — their intended roles are not established in code |

### Entry points and modules
- `index.html` → `/src/main.jsx` (StrictMode → `App`) → imports
  `/src/index.css`; registers `gsap.registerPlugin(ScrollTrigger)` once.
- `src/App.jsx` — **site shell over flowing sections**: one document holds
  the fixed `.about-scene` scene layer, `SiteHeader` (fixed),
  `main#main-content` with the Hero section, the **About region**
  (`div.about-region` grouping the five `section.page` stages together with
  the persistent `AboutBar`) and the **Expertise region**
  (`div.expertise-region` grouping the Expertise screens together with the
  persistent `ExpertiseBar`), `SiteFooter`, and one fixed `AboutTimeline`. Sections are content-driven (100dvh *minimums* only —
  nothing clips); mandatory scroll-snap is gone. The hash stays synced: the
  section covering the viewport centre writes `#/`, `#/about`,
  `#/about/philosophy`, `#/about/approach`, `#/about/values`,
  `#/about/closing` or `#/expertise` via
  `history.replaceState`
  (silent), while explicit
  references — the Hero scroll cue, timeline links, the persistent bar's
  controls, menu
  links, deep links, browser back/forward — scroll the matching section into
  view below the fixed header (smooth under `prefers-reduced-motion:
  no-preference`; `scroll-margin-top: var(--header-offset)`). A short
  navigation lock keeps scroll-sync from overwriting the target's address
  while a programmatic glide is in flight. The document title follows the
  section in view. About position states derive from the same scroll-synced
  route — the AboutBar track (styles/about-bar.css) is a cumulative
  **five-position step indicator** driven by React state (one position per
  subsection, active positions accumulate, no continuous fill, no
  per-frame writes); the former progress ScrollTrigger and its root
  `--about-progress` variable were retired with that change.
- `src/components/SiteHeader.jsx` — fixed global bar: monogram brand (CSS
  crop window) linking `#/`, and the single `MobileMenu` instance. `current`
  is derived from the scroll-synced route (never hard-coded per screen).
- `src/components/MobileMenu.jsx` — circular 3-stroke trigger in the
  SiteHeader (`.site__menu`; morphs to an X via `.mm-open`) opening an
  app-level full-surface dialog listing only `#/` and `#/about`; the active
  item takes the page's accent colour. Focus moves to the first link on
  open, Tab is trapped inside the dialog, Escape closes and refocuses the
  trigger, and the trigger (layered above the panel in the fixed header)
  doubles as the visible close control; link activation closes the panel.
- `src/components/AboutTimeline.jsx` — the About sequence's subsection nav,
  rendered once, fixed below the header. INTRO (`#/about`), PHILOSOPHY
  (`#/about/philosophy`), APPROACH (`#/about/approach`), VALUES
  (`#/about/values`) and CLOSING (`#/about/closing`) link; the current
  item carries `aria-current="location"` (and is never a self-link) and is
  derived from the same scroll-synced route (works scrolling, deep links and
  history, both
  directions); the nav is hidden and
  inert outside the About region. The refined geometry derives the rail's
  top/bottom trims from the rows' own metrics (`--at-dot-center-inset`), so
  the continuous rail spans exactly between the first and last marker
  centres at any viewport, with uniform row heights for static and linked
  rows. The active highlight eases between items
  (dot/label colour + glow transitions, 220ms, motion-gated); the nav's own
  geometry
  never moves.
- `src/components/SiteFooter.jsx` — structural end: monogram brand, links to
  the routes that exist (Home, About), and the established identity line
  ("Website developer — Bangalore, India"). No invented contact/work
  content.
- `src/components/Hero.jsx` — home section (full-viewport cinematic
  composition, `100dvh`): eyebrow, five-line headline with mint final
  phrase, paragraph (established copy), two non-navigational CTA buttons,
  avatar trust row, and a scroll cue linking `#/about`. No header of its
  own — the fixed SiteHeader owns the brand/menu slot.
- `src/components/AboutIntro.jsx` — About Block 01: `01 — Philoduction`
  indicator, three-line headline (turquoise accents), bio paragraph. No
  header, rail or bottom bar of its own — the scene layer, the timeline and
  the persistent AboutBar own those. GSAP reveal via `useSectionReveal`.
- `src/components/AboutPhilosophy.jsx` — About Block 02: `02 — Philosophy`
  indicator, two-line serif headline ("Design with purpose." / "Build with
  precision." with cyan accents), the exact philosophy paragraph. No header,
  rail or bottom bar of its own (same app-level scene/timeline/AboutBar
  ownership). GSAP reveal via `useSectionReveal`.
- `src/components/AboutApproach.jsx` — About Block 03 · Approach: `03 —`
  indicator with the MY APPROACH eyebrow, three-line serif headline
  ("Understand." / "Design. Develop." / "Refine." — turquoise accent on the
  final line; the spans wrap naturally on narrow viewports instead of
  clipping), and a real four-step workflow timeline (01 Understand / 02
  Design / 03 Develop / 04 Refine) laid out on a continuous vertical rail in
  `styles/about-approach.css` — grid-driven marker/content columns, so each
  marker aligns with its own step and the rail's ends trim to the first/last
  markers from the row's type metrics (no hardcoded coordinates). No header,
  rail or bottom bar of its own (same app-level scene/timeline/AboutBar
  ownership). GSAP reveal via `useSectionReveal`.
- `src/components/AboutValues.jsx` — About Block 04 · Values: `04 —`
  indicator with the WHAT I VALUE eyebrow, two-line serif headline
  ("The details" / "make the difference." — the sequence's turquoise on
  `details` and on the closing period; the fluid `min(8.8vw, 4.2rem)`
  curve keeps the designed two-line composition down to the 320px battery
  floor, relaxing by natural wrap rather than clipping), and the exact
  values paragraph about audience-tailored design. No header, rail or
  bottom bar of its own (same app-level scene/timeline/AboutBar ownership).
  GSAP reveal via `useSectionReveal`.
- `src/components/AboutClosing.jsx` — About Block 05 · Closing: `05 —`
  indicator with the CLOSING eyebrow, three-line serif headline
  ("Let's build something" / "that moves your" / "business forward." — the
  complete closing phrase in the sequence's turquoise; fluid
  `min(8.4vw, 4.25rem)` curve so the longest line stays on one line down
  to the 320px battery floor, relaxing by natural wrap rather than clipping),
  the exact supporting paragraph, and the LET'S TALK outlined-pill
  call-to-action with a straight horizontal arrow. The CTA is a
  non-navigational button — no Contact destination exists in this
  application, so no dead link is invented. No header, rail or bottom bar
  of its own (same app-level scene/timeline/AboutBar ownership). GSAP reveal
  via `useSectionReveal`.
- `src/styles/about-closing.css` — Block 05 sheet; mirrors the structural
  Blocks 01–04 sheets with the display-scale headline (no fixed rem floor —
  see above), the established indicator/paragraph tokens, and the outlined
  pill CTA (≥44px touch target, thin turquoise border, fully rounded ends,
  focus-visible + pressed states, restrained hover feedback; transparent
  ground over the fixed scene layer).
- `src/components/ExpertiseTechStack.jsx` — Expertise Page 01 · MY TECH
  STACK: `01` numeral with a short thin horizontal rule followed by the MY
  TECH STACK eyebrow, three-line serif headline ("Modern tools." / "Real
  skills." / "Practical websites." — the closing phrase in the sequence's
  turquoise; fluid `min(8.8vw, 4.25rem)`), the exact supporting paragraph,
  and the four equal-width feature pillars (Focused / Practical / Modern /
  Client Ready) with outlined cyan icon tiles and subtle vertical
  dividers. No header or bottom bar of its own (shared `SiteHeader` and
  persistent `ExpertiseBar`). GSAP reveal via `useSectionReveal`.
- `src/styles/expertise-tech-stack.css` — Page 01 sheet; mirrors the
  structural About sheets with the display-scale headline, the established
  indicator/paragraph tokens, and the four-column pillar row (equal flex
  columns, dividers, responsive tightening; transparent ground over the
  fixed scene layer).
- `src/components/ExpertiseBar.jsx` — the experience's one persistent bottom
  navigation (EXPERTISE · three-position progress track · WORK), rendered
  once at the end of the Expertise region (`styles/expertise-bar.css`;
  `position: sticky; bottom: 0` pins it through the experience and
  releases it exactly at the region's end). At Page 01 EXPERTISE is the
  current location (aria-current, no self-link); WORK has no implemented
  destination and stays a non-navigational button. The track is a
  cumulative three-position progress indicator from the route state. The
  control arrows point horizontally to the right.
- `src/styles/expertise-bar.css` — ExpertiseBar sheet; mirrors about-bar.css
  with the three-segment track and EXPERTISE/WORK controls.
- `src/styles/expertise-region.css` — Expertise region wrapper; carries the
  `--expertise-bar-reserve` token. Reuses the global stationary scene.
- `src/styles/about-background.css` — owned by App.jsx: the fixed
  `.about-scene` layer (the one `assets/background-work-1.jpg` painting
  behind the whole non-Home view; cover / 50% 50% / no-repeat on a
  full-viewport fixed box, `z-index: -1`, static unified scrims on `::after`,
  corner-glow radials on `::before`, the `.work-background__thread-overlay`
  bead-SVG block) and the `.about-region` wrapper (contains the sequence;
  carries the `--about-bar-reserve` token). Nothing about the layer
  animates, and Home (`#home`'s own opaque ground) / the footer / the menu
  never see it. Requires `body { background: transparent }`: an in-flow
  block's background paints after negative-z descendants, so a `body`
  ground would hide the layer; the page ground lives on `<html>` instead.
- `src/components/AboutBar.jsx` — the sequence's one persistent bottom
  navigation (ABOUT · five-position step track · NEXT), rendered at the end
  of the About region (`styles/about-bar.css`; `position: sticky; bottom: 0`
  pins it to the viewport bottom through the sequence and releases it exactly
  at the region's end, so the site end stays uncovered). Controls reflect the
  scroll-synced route: at Block 01 ABOUT is the current location
  (aria-current) and NEXT advances to Block 02; later blocks return ABOUT to
  Block 01 while NEXT advances along the implemented chain (Block 02 →
  `#/about/approach`, Block 03 → `#/about/values`, Block 04 →
  `#/about/closing`); at the sequence's end the same right-hand slot (Block
  05) presents EXPERTISE — the Expertise experience now exists, so the
  control links to `#/expertise`. The control arrows point
  horizontally to the right in every route. The track is a **cumulative
  five-position step
  indicator**: each position maps to one subsection and activates when that
  subsection is reached, staying active for all earlier ones
  (`A_j = j <= i`); positions never move, resize or slide, the active paint
  layer is always the same full dash and only its opacity carries the
  state (motion-gated ease; instant under reduce), outside the sequence no
  position is active, `aria-valuenow` reports the step count (0–5), and
  routes without a sequence position resolve to "none active". Each frame's
  bottom band is reserved with
  `--about-bar-reserve` so content never rests under the pinned bar; a
  static top-fade covers content traveling beneath, mirroring the fixed
  header's treatment.
- `src/components/useSectionReveal.js` — shared reveal hook
  (`gsap.matchMedia` + `once: true` fromTo, `immediateRender: false`,
  transform/opacity only) — content can never be stranded hidden; one
  ScrollTrigger per section, reverted on unmount.
- `src/components/ArrowIcon.jsx` — shared 12×12 northeast arrow glyph, used
  by the About sequence's NEXT controls.

### Design conventions in code
- Tokens on `:root` in `src/index.css`: dark emerald ground `#020a09`, ivory
  ink `#f2f0e8`, single mint accent `#50e3a4` (About-sequence accent
  `#00e6bc`, shared by both About blocks), hairlines at 16% / 28% ivory
  alpha, `--serif-display` and `--sans-ui` type stacks, monogram-crop
  constants, and the shell/layout tokens `--page-gutter`,
  `--body-copy-max`, `--header-offset` (anchor scroll offset).
  `color-scheme: dark`; `body { min-width: 320px }`; `[id]` gets
  `scroll-margin-top: var(--header-offset)`.
- BEM-style class prefixes per component: `site__`/`sf__` (shell),
  `at__` (About timeline), `ab__` (persistent AboutBar), `hero__`, `ai__`,
  `ph__`, `ap__` (workflow rail block), `av__` (Values block),
  `ac__` (Closing block), `ets__` (Expertise Page 01 block),
  `eb__` (persistent ExpertiseBar), `mm__` (menu panel), plus the
  App-owned `about-scene` / `about-region` / `expertise-region` classes.
- Section styles live in `src/styles/<area>.css` (site.css, about-timeline.css,
  about-bar.css, about-intro.css, about-philosophy.css, about-approach.css,
  about-values.css, about-closing.css, expertise-tech-stack.css,
  expertise-bar.css, expertise-region.css),
  imported inside the component that needs them; `about-background.css` (the
  scene layer + region wrapper) is imported once by `App.jsx`, which owns
  those elements;
  home + menu-panel styles stay in `src/index.css`. The scene paints
  `background-work-1.jpg` once (plain relative `url()` so Vite processes it
  like the other assets).
- Type sizes on supporting copy use `clamp()` with a ≥0.9375rem body floor
  (about paragraphs) / ≥0.875rem (hero paragraph); rail/timeline and bar
  labels sit at 10–12px with letter-spaced uppercase.

### Commands
| Command | Effect |
| --- | --- |
| `npm install` | Install dependencies (already satisfied) |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` (gitignored) |
| `npm run preview` | Serve the built site locally |

### Current implementation status (as of 2026-10-24)
| Area | State |
| --- | --- |
| Home · Hero | Implemented; renders at `#/` (section `#home`), no internal header |
| About · Block 01 (Introduction) | Implemented; `#/about` (section `#about`) |
| About · Block 02 (Philosophy) | Implemented; `#/about/philosophy` (section `#about-philosophy`); transparent ground over the persistent scene layer |
| About · Block 03 (Approach) | Implemented; `#/about/approach` (section `#about-approach`); `03 —`/MY APPROACH indicator, three-line serif headline with turquoise close, four-step workflow timeline on a continuous rail; transparent ground over the scene layer |
| About · Block 04 (Values) | Implemented; `#/about/values` (section `#about-values`); `04 —`/WHAT I VALUE indicator, two-line serif headline "The details / make the difference." with turquoise accents (fluid display curve, no clipping), exact values paragraph; transparent ground over the scene layer |
| About · Block 05 (Closing) | Implemented; `#/about/closing` (section `#about-closing`); `05 —`/CLOSING indicator, three-line serif headline "Let's build something / that moves your / business forward." with turquoise closing phrase, exact supporting paragraph, outlined-pill LET'S TALK CTA (horizontal arrow, non-navigational — no Contact destination), transparent ground over the scene layer |
| Expertise · Page 01 (My Tech Stack) | Implemented; `#/expertise` (section `#expertise`); `01` numeral with short horizontal rule + MY TECH STACK eyebrow, three-line serif headline "Modern tools. / Real skills. / Practical websites." with turquoise closing phrase, exact supporting paragraph, four equal-width feature pillars (Focused / Practical / Modern / Client Ready) with outlined cyan icon tiles and subtle vertical dividers; transparent ground over the shared stationary scene layer |
| Persistent About scene | Implemented; one fixed `.about-scene` layer paints `assets/background-work-1.jpg` behind the whole non-Home view (cover/center/no-repeat, `z-index: -1`, static unified scrims + corner-glow `::before` + static thread-bead SVG overlay via `SceneThreadBeads.jsx`); `body { background: transparent }` (ground on `<html>`) so the layer is visible; `#home` keeps its own opaque ground so Home is untouched; verified stationary during scroll (identical computed state at scroll 0 vs 6000, 0 animations) |
| About bottom navigation (`AboutBar`) | Implemented; one sticky-bottom bar inside the About region — pinned through the sequence, released exactly at its end; route-driven ABOUT/NEXT (now EXPERTISE at Block 05, linking to `#/expertise`) variants; five-position cumulative step track from the route state; frames reserve the bar band (`--about-bar-reserve`) |
| Expertise bottom navigation (`ExpertiseBar`) | Implemented; one sticky-bottom bar inside the Expertise region — pinned through the experience, released exactly at its end; EXPERTISE current location at Page 01 (aria-current, no self-link); WORK is non-navigational (no Work destination); three-position cumulative progress track from the route state; frames reserve the bar band (`--expertise-bar-reserve`) |
| Site shell | Fixed `SiteHeader` (monogram brand + `MobileMenu`), `SiteFooter` — rendered once by `App.jsx` |
| Global navigation (`MobileMenu`) | Implemented; lists `#/` + `#/about`; active derived from route; Escape/focus/Tab-trap/labels verified; trigger doubles as close control above the panel |
| About sequence nav (`AboutTimeline`) | Implemented; INTRO/PHILOSOPHY/APPROACH/VALUES/CLOSING link, active carries `aria-current="location"` derived from route, hidden+`inert` outside About; rail trims derived from row metrics (exact marker alignment) |
| Section flow | Free-flowing sections (no snap); `min-height` screens for the cinematic compositions; content-driven growth; the About region ends with the sticky AboutBar, then the footer |
| Animations | GSAP installed; About content reveals via `useSectionReveal` (one ScrollTrigger per section); About positions/timeline active state derive from the scroll-synced route (React state for discrete flips; no per-frame writes); timeline highlight + bar state ease via motion-gated CSS transitions; the scene layer itself is static by design; no other motion systems |
| Tests / lint / CI | None |
| Version control | Not a Git repository |

## Pending decisions (explicitly unknown — not established requirements)
- All five About blocks and Expertise Page 01 are now implemented; no further
  About content is coded. `my background.png` and `signature.svg` are
  unreferenced; no code or instruction establishes their intended use yet.
- Missing destinations (reported, not invented): the Hero CTA buttons
  ("View My Work" / "Let's Talk"), Block 05's LET'S TALK call-to-action
  (no Contact destination exists), the ExpertiseBar's WORK control (no Work
  destination exists), and Expertise Pages 02–03 (not yet implemented). Each
  missing destination is a real, focusable, non-navigational control rather
  than a dead link. The AboutBar's final EXPERTISE control now links to the
  implemented Expertise Page 01 (`#/expertise`).
- Reduced-motion emulation and real-device touch QA (momentum, overscroll,
  revealed-animation completion timing) remain unverified in the harness;
  mitigations are code-gated (`prefers-reduced-motion` blocks, once-reveals)
  and the environment could not exercise them directly.
