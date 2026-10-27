import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/about-intro.css'

/**
 * ABOUT — Block 01 · Introduction (About sequence opening section)
 *
 * Section composition: the `01 —` section identifier, the three-line serif
 * headline (turquoise on lines 2-3) and the supporting paragraph. This
 * content is the moving layer inside the persistent About scene: the
 * background lives in the app-level fixed `.about-scene` layer
 * (App.jsx + styles/about-background.css) and does not travel with the text.
 *
 * The header (brand + menu control), the bottom bar moved to the shared
 * site shell — `SiteHeader` (fixed, site wide) and `AboutBar` (the
 * persistent ABOUT · progress track · NEXT navigation, rendered once at the
 * end of the About region in App.jsx). Neither is duplicated here.
 *
 * Content reveal: a restrained GSAP entrance (see useSectionReveal.js) under
 * `prefers-reduced-motion: no-preference`.
 *
 * Navigation lives in the persistent AboutBar and reflects the route: at
 * this block ABOUT is the current location (aria-current) and NEXT advances
 * to Block 02 · Philosophy (`#/about/philosophy`). The bottom track is
 * sequence-driven: a cumulative five-position step indicator (one fixed
 * position per subsection, active positions accumulate as the sequence
 * advances) derived from the same scroll-synced route as this block. Destinations
 * that do not exist yet are not invented.
 */

export function AboutIntro() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.ai__indicator', y: 10},
    { selector: '.ai__headline', y: 22},
    { selector: '.ai__para', y: 14},
  ])

  return (
    <section className="ai" ref={rootRef}>
      <div className="ai__frame">
        <div className="ai__main">
          <p className="ai__indicator">
            <span className="ai__indicator-num">01 —</span>
            <span className="ai__indicator-label">Philoduction</span>
          </p>

          <h1 className="ai__headline">
            <span>More than just</span>
            <span className="ai__headline-accent">a good-looking</span>
            <span className="ai__headline-accent">website.</span>
          </h1>

          <p className="ai__para">
            I started coding in 11th grade, and today, as a third-year
            Computer Science Engineering student, I’m still building,
            learning, and refining my craft. I’ve experienced the shift from
            writing code line by line to working in an era transformed by AI.
            That journey has taught me that great websites need more than
            modern tools—they need clear thinking, solid fundamentals, and a
            genuine understanding of what businesses need.
          </p>
        </div>
      </div>
    </section>
  )
}
