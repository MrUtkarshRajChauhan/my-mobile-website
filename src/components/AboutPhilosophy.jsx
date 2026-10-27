import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/about-philosophy.css'

/**
 * ABOUT — Block 02 · Philosophy (second section of the About sequence)
 *
 * Section composition: the `02 —` section identifier, the two-line serif
 * headline ("Design with purpose." / "Build with precision." — trailing
 * accent words in turquoise) and the supporting paragraph. This content is
 * the moving layer inside the persistent About scene: the background lives
 * in the app-level fixed `.about-scene` layer (App.jsx +
 * styles/about-background.css) and does not travel with the text.
 *
 * The header (brand + menu control), the bottom bar moved to the shared
 * site shell — `SiteHeader` (fixed, site wide) and `AboutBar` (the
 * persistent ABOUT · progress track · NEXT navigation, rendered once at the
 * end of the About region in App.jsx). Neither is duplicated here.
 *
 * Content reveal: a restrained GSAP entrance (see useSectionReveal.js) under
 * `prefers-reduced-motion: no-preference`.
 *
 * Navigation lives in the persistent AboutBar and reflects the route: from
 * this block on, ABOUT leads back to Block 01 (`#/about`) while NEXT
 * advances to Block 03 (`#/about/approach`).
 */

export function AboutPhilosophy() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.ph__indicator', y: 10},
    { selector: '.ph__headline', y: 22},
    { selector: '.ph__para', y: 14},
  ])

  return (
    <section className="ph" ref={rootRef}>
      <div className="ph__frame">
        <div className="ph__main">
          <p className="ph__indicator">
            <span className="ph__indicator-num">02 —</span>
            <span className="ph__indicator-label">Philosophy</span>
          </p>

          {/* Two-line serif headline; accent words live at each line's end. */}
          <h1 className="ph__headline">
            <span>
              Design with <em className="ph__headline-accent">purpose.</em>
            </span>
            <span>
              Build with <em className="ph__headline-accent">precision.</em>
            </span>
          </h1>

          <p className="ph__para">
            I begin by deeply understanding the client’s pain point, analyzing
            their needs, and mapping out a strategic solution. Next, we craft
            an intuitive UI/UX that engages visitors, motivates them to explore
            further, and turns casual viewers into loyal customers. Our modern
            design approach helps clients attract more buyers, significantly
            increase sales, and drive sustainable business growth.
          </p>
        </div>
      </div>
    </section>
  )
}
