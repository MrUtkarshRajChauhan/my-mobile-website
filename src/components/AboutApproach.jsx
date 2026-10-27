import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/about-approach.css'

/**
 * ABOUT — Block 03 · Approach (third section of the About sequence)
 *
 * Section composition: the `03 —` section identifier with the MY APPROACH
 * eyebrow, the three-line serif headline ("Understand." / "Design. Develop."
 * / "Refine." — the closing word in the sequence's turquoise accent, lines
 * wrapping naturally on narrow viewports), and a real vertical workflow
 * timeline with four numbered steps (Understand / Design / Develop / Refine)
 * aligned along one continuous rail. The steps' copy is established content —
 * nothing invented beyond it.
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
 * leads back to Block 01 while NEXT advances to Block 04
 * (`#/about/values`).
 */

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Understand',
    desc: 'Learn about the business, its audience, and its goals.',
  },
  {
    num: '02',
    title: 'Design',
    desc: 'Create a clear visual direction and intuitive user experience.',
  },
  {
    num: '03',
    title: 'Develop',
    desc: 'Build a responsive, performant website.',
  },
  {
    num: '04',
    title: 'Refine',
    desc: 'Test the details and improve the experience before delivery.',
  },
]

export function AboutApproach() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.ap__indicator', y: 10},
    { selector: '.ap__headline', y: 22},
    { selector: '.ap__step', y: 10},
  ])

  return (
    <section className="ap" ref={rootRef}>
      <div className="ap__frame">
        <div className="ap__main">
          <p className="ap__indicator">
            <span className="ap__indicator-num">03 —</span>
            <span className="ap__indicator-label">My Approach</span>
          </p>

          {/* Three designed lines; spans wrap naturally when a viewport is
              too narrow instead of clipping or shrinking. The accent word is
              the line's own statement. */}
          <h1 className="ap__headline">
            <span>Understand.</span>
            <span>Design. Develop.</span>
            <span>
              <em className="ap__headline-accent">Refine.</em>
            </span>
          </h1>

          {/* Workflow timeline — markers grid-align with their own step; the
              connecting rail is CSS-drawn (about-approach.css). */}
          <ol className="ap__steps">
            {WORKFLOW_STEPS.map((step) => (
              <li key={step.num} className="ap__step">
                <span className="ap__step-marker" aria-hidden="true" />
                <h2 className="ap__step-title">
                  <span className="ap__step-num">{step.num}</span>
                  <span>{step.title}</span>
                </h2>
                <p className="ap__step-desc">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
