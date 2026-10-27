import { ArrowIcon } from './ArrowIcon.jsx'
import '../styles/expertise-bar.css'

/**
 * EXPERTISE BOTTOM NAVIGATION — one persistent instance for the Expertise
 * experience (EXPERTISE · three-position progress track · WORK), rendered
 * once at the end of the Expertise region wrapper. The per-screen bars
 * inside the Expertise pages were removed so the navigation stays in place
 * while the content moves and is never duplicated per screen.
 *
 * - Controls reflect the scroll-synced route (`current` from App.jsx): at
 *   Page 01 EXPERTISE is the current location (aria-current, no self-link)
 *   and from later pages EXPERTISE leads back to Page 01. WORK advances to
 *   the Work area, which is implemented, so the control is a real link; the
 *   inert button branch remains for any future route whose destination has
 *   not been built.
 * - The track is a cumulative three-position progress indicator, not a
 *   flowing fill: one fixed position per Expertise page. A position whose
 *   page has been reached is active; all earlier positions stay active;
 *   positions never move or resize; only the changed position's own state
 *   eases (motion-gated). Outside the Expertise experience no position is
 *   active — no stale Expertise state on Home/About. The active page is the
 *   same authoritative scroll-synced `route` that drives the address bar,
 *   document title and (where present) the top timeline — there is no
 *   second progress calculation. `aria-valuenow` reports the step count
 *   (0–3).
 * - Positioning lives in styles/expertise-bar.css: sticky bottom within the
 *   region pins the band to the viewport bottom through the experience and
 *   releases it exactly when the region's content ends (navigation is not
 *   scrolled away mid-experience, and the site end stays uncovered).
 */

// Implemented chain: the destination AFTER each Expertise page; null where
// the following page/area does not exist yet (the control stays inert).
const NEXT_AFTER = {
  expertise: '#/work',
  expertiseMeans: '#/work',
  expertiseStack: '#/work',
}

// Step ordering of the designed three-page Expertise experience. Routes
// without a sequence position (e.g. `home`, `about`) resolve to -1 — no
// active positions.
const SEGMENT_INDEX = {
  expertise: 0,
  expertiseMeans: 1,
  expertiseStack: 2,
  // Future Expertise pages extend this map; nothing else changes.
}

const TRACK_POSITIONS = [0, 1, 2]

export function ExpertiseBar({ current }) {
  const nextHref = NEXT_AFTER[current]
  const activeIndex = SEGMENT_INDEX[current] ?? -1

  return (
    <div className="eb">
      <div className="eb__row">
        {current === 'expertise' ? (
          /* Page 01 — EXPERTISE is the current location, not a self-link. */
          <span className="eb__expertise" aria-current="page">
            Expertise
          </span>
        ) : (
          /* A later page exists — EXPERTISE returns to Page 01. */
          <a className="eb__expertise" href="#/expertise">
            Expertise
          </a>
        )}
        <span
          className="eb__track"
          role="progressbar"
          aria-label="Expertise progress"
          aria-valuemin={0}
          aria-valuemax={3}
          aria-valuenow={activeIndex + 1}
        >
          {TRACK_POSITIONS.map((position) => (
            <i
              key={position}
              className={`eb__track-cell${
                position <= activeIndex ? ' is-active' : ''
              }`}
            />
          ))}
        </span>
        {/* WORK — advances to the Work area. A real link while the
            destination exists; the inert button branch is retained for
            any future route whose following page has not been built
            (no dead link, nothing invented). */}
        {nextHref ? (
          <a className="eb__work" href={nextHref}>
            <span>Work</span>
            <ArrowIcon horizontal />
          </a>
        ) : (
          <button type="button" className="eb__work">
            <span>Work</span>
            <ArrowIcon horizontal />
          </button>
        )}
      </div>
    </div>
  )
}
