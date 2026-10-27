import { ArrowIcon } from './ArrowIcon.jsx'
import '../styles/about-bar.css'

/**
 * ABOUT BOTTOM NAVIGATION — one persistent instance for the About sequence
 * (ABOUT · five-position step track · right-hand control), rendered once at
 * the end of the About region wrapper. The per-section bars inside the
 * About blocks were removed so the navigation stays in place while the
 * content moves and is never duplicated per subsection.
 *
 * - Controls reflect the scroll-synced route (`current` from App.jsx): at
 *   Block 01 ABOUT is the current location (aria-current, no self-link) and
 *   NEXT advances the sequence; from later blocks on ABOUT leads back to
 *   Block 01 while NEXT follows the implemented chain (Block 02 advances to
 *   `#/about/approach`, Block 03 to `#/about/values`, Block 04 to
 *   `#/about/closing`). At the final block (05) the control presents
 *   EXPERTISE with a straight horizontal arrow; the Expertise experience now
 *   exists, so the control links to `#/expertise`. The control arrows point
 *   horizontally to the right
 *   (per the established bottom-navigation direction; the shared glyph
 *   renders that variant) across every route.
 * - The track is a cumulative five-position step indicator, not a flowing
 *   fill: each position maps to one subsection (Intro/Philosophy/Approach/
 *   Values/Closing) and becomes active when that subsection is reached,
 *   staying active for all preceding subsections (A_j = j <= i). Positions
 *   never move or resize; only the changed position's own state eases
 *   (motion-gated). Outside the About sequence no position is active — no
 *   stale About state on Home. The active subsection is the same
 *   authoritative scroll-synced `route` that drives the address bar,
 *   document title and top timeline — there is no second progress
 *   calculation. `aria-valuenow` reports the step count (0–5).
 * - Positioning lives in styles/about-bar.css: sticky bottom within the
 *   region pins the band to the viewport bottom through the sequence and
 *   releases it exactly when the region's content ends (navigation is not
 *   scrolled away mid-sequence, and the site end stays uncovered).
 */

// Implemented chain: the destination AFTER each route's stage; null at the
// sequence's end (the final control stays inert — no invented destination).
const NEXT_AFTER = {
  about: '#/about/philosophy',
  philosophy: '#/about/approach',
  approach: '#/about/values',
  values: '#/about/closing',
  closing: '#/expertise',
}

// Step ordering of the designed five-subsection sequence. Routes without a
// sequence position (e.g. `home`) resolve to -1 — no active positions.
const STEP_INDEX = {
  about: 0,
  philosophy: 1,
  approach: 2,
  values: 3,
  closing: 4,
}

const TRACK_POSITIONS = [0, 1, 2, 3, 4]

export function AboutBar({ current }) {
  const nextHref = NEXT_AFTER[current] ?? null
  const activeIndex = STEP_INDEX[current] ?? -1
  /* At the final block the same right-hand slot presents the beyond-sequence
     EXPERTISE control. It now links to the Expertise experience (which
     exists); the inert button branch is retained for any future route
     without a resolved destination. */
  const controlLabel = current === 'closing' ? 'Expertise' : 'Next'

  return (
    <div className="ab">
      <div className="ab__row">
        {current === 'about' ? (
          /* Block 01 — ABOUT is the current location, not a self-link. */
          <span className="ab__about" aria-current="page">
            About
          </span>
        ) : (
          /* Preceding section exists — ABOUT returns to Block 01. */
          <a className="ab__about" href="#/about">
            About
          </a>
        )}
        <span
          className="ab__track"
          role="progressbar"
          aria-label="About sequence progress"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={activeIndex + 1}
        >
          {TRACK_POSITIONS.map((position) => (
            <i
              key={position}
              className={`ab__track-cell${position <= activeIndex ? ' is-active' : ''}`}
            />
          ))}
        </span>
        {nextHref ? (
          /* Next stage exists — the control advances the implemented chain. */
          <a className="ab__next" href={nextHref}>
            <span>{controlLabel}</span>
            <ArrowIcon horizontal />
          </a>
        ) : (
          /* Destination unresolved in this application — kept
             non-navigational (the sequence's final EXPERTISE control). */
          <button type="button" className="ab__next">
            <span>{controlLabel}</span>
            <ArrowIcon horizontal />
          </button>
        )}
      </div>
    </div>
  )
}
