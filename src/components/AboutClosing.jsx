import { useRef } from 'react'
import { ArrowIcon } from './ArrowIcon.jsx'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/about-closing.css'

/**
 * ABOUT — Block 05 · Closing (final section of the About sequence)
 *
 * Section composition: the `05 —` section identifier with the CLOSING
 * eyebrow, the three-line serif headline ("Let’s build something" /
 * "that moves your" / "business forward." — the complete closing phrase in
 * the sequence's turquoise, lines wrapping naturally on narrow viewports),
 * the exact supporting paragraph, and the LET'S TALK call-to-action — an
 * outlined pill with a straight horizontal arrow.
 *
 * The LET'S TALK control is a non-navigational button: the application has
 * no implemented Contact route, section, form or configured contact method
 * (the menu lists only `#/` and `#/about`; the footer links Home/About), so
 * no destination is invented — the missing target is reported instead,
 * matching the no-dead-links rule.
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
 */

export function AboutClosing() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.ac__indicator', y: 10},
    { selector: '.ac__headline', y: 22},
    { selector: '.ac__para', y: 14},
    { selector: '.ac__cta', y: 12},
  ])

  return (
    <section className="ac" ref={rootRef}>
      <div className="ac__frame">
        <div className="ac__main">
          <p className="ac__indicator">
            <span className="ac__indicator-num">05 —</span>
            <span className="ac__indicator-label">Closing</span>
          </p>

          {/* Three designed lines; spans wrap naturally when a viewport is
              too narrow instead of clipping or shrinking. The accent wraps
              the complete closing phrase. */}
          <h1 className="ac__headline">
            <span>Let’s build something</span>
            <span>that moves your</span>
            <span className="ac__headline-accent">business forward.</span>
          </h1>

          <p className="ac__para">
            Have a business to grow or an idea worth building? Let’s discuss
            what your website needs to achieve.
          </p>

          {/* Outline pill CTA with a straight horizontal arrow. The real
              contact destination is not implemented in this application —
              the control stays non-navigational rather than dead-linking. */}
          <button type="button" className="ac__cta">
            <span>Let’s Talk</span>
            <ArrowIcon horizontal />
          </button>
        </div>
      </div>
    </section>
  )
}
