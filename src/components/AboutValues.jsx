import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/about-values.css'

/**
 * ABOUT — Block 04 · Values (fourth section of the About sequence)
 *
 * Section composition: the `04 —` section identifier with the WHAT I VALUE
 * eyebrow, the two-line serif headline ("The details" / "make the
 * difference." — `details` and the closing period in the sequence's
 * turquoise accent, lines wrapping naturally on narrow viewports), and the
 * established body paragraph about audience-tailored design. The copy is
 * established content — nothing invented beyond it.
 *
 * The header (brand + menu control) and the bottom navigation stay in the
 * shared app shell — `SiteHeader`, the app-level `.about-scene` background
 * layer (App.jsx + styles/about-background.css) and the persistent
 * `AboutBar` (rendered once at the end of the About region in App.jsx).
 * None of them are duplicated here; this section stays transparent so the
 * scene never moves with the text.
 *
 * Content reveal: a restrained GSAP entrance (see useSectionReveal.js) under
 * `prefers-reduced-motion: no-preference`.
 *
 * Navigation lives in the persistent AboutBar: from this block on, ABOUT
 * leads back to Block 01 while NEXT advances to Block 05
 * (`#/about/closing`).
 */

export function AboutValues() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.av__indicator', y: 10},
    { selector: '.av__headline', y: 22},
    { selector: '.av__para', y: 14},
  ])

  return (
    <section className="av" ref={rootRef}>
      <div className="av__frame">
        <div className="av__main">
          <p className="av__indicator">
            <span className="av__indicator-num">04 —</span>
            <span className="av__indicator-label">What I Value</span>
          </p>

          {/* Two designed lines; spans wrap naturally when a viewport is
              too narrow instead of clipping or shrinking. The accents sit
              inside their lines' statements. */}
          <h1 className="av__headline">
            <span>
              The <em className="av__headline-accent">details</em>
            </span>
            <span>
              make the difference<em className="av__headline-accent">.</em>
            </span>
          </h1>

          <p className="av__para">
            I precisely understand the client’s industry and curate web
            designs tailored to attract their exact target audience. This
            creates a stronger market positioning for their business. By
            deeply understanding their goals, geographic location, and ideal
            customers, we deliver custom designs that build a healthy user
            experience and foster lasting business-to-customer relationships.
            A happy customer makes our client happy, and a happy client makes
            me happy.
          </p>
        </div>
      </div>
    </section>
  )
}
