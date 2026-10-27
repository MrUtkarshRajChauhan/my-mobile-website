import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/expertise-tech-stack.css'

/**
 * EXPERTISE — Page 01 · MY TECH STACK (first screen of the three-part
 * Expertise experience).
 *
 * Section composition: the `01` numeral with a short thin horizontal rule
 * followed by the MY TECH STACK eyebrow, the three-line serif headline
 * ("Modern tools." / "Real skills." / "Practical websites." — the closing
 * phrase in the sequence's turquoise), the exact supporting paragraph, and
 * the four equal-width feature pillars (Focused / Practical / Modern /
 * Client Ready) with outlined icon tiles and subtle vertical dividers.
 *
 * The header (brand + menu control) stays in the shared app shell
 * (`SiteHeader`); the bottom navigation is the persistent `ExpertiseBar`
 * (rendered once at the end of the Expertise region in App.jsx). None of
 * them are duplicated here; this section stays transparent so the shared
 * stationary scene shows through.
 *
 * Content reveal: a restrained GSAP entrance (see useSectionReveal.js) under
 * `prefers-reduced-motion: no-preference`.
 */

const PILLARS = [
  {
    title: 'Focused',
    description: 'Only the tools I truly work with.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Practical',
    description: 'Used in real projects.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M12 2 2 7v10l10 5 10-5V7L12 2ZM2 7l10 5 10-5M12 12v10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Modern',
    description: 'Built for today and tomorrow.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M8 7 3 12l5 5M16 7l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Client Ready',
    description: 'Reliable, maintainable and scalable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function ExpertiseTechStack() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.ets__indicator', y: 10},
    { selector: '.ets__headline', y: 22},
    { selector: '.ets__para', y: 14},
    { selector: '.ets__pillars', y: 10},
  ])

  return (
    <section className="ets" ref={rootRef}>
      <div className="ets__frame">
        <div className="ets__main">
          <p className="ets__indicator">
            <span className="ets__indicator-row">
              <span className="ets__indicator-num">01</span>
              <span className="ets__indicator-rule" aria-hidden="true" />
            </span>
            <span className="ets__indicator-label">My Tech Stack</span>
          </p>

          <h1 className="ets__headline">
            <span>Modern tools.</span>
            <span>Real skills.</span>
            <span className="ets__headline-accent">Practical websites.</span>
          </h1>

          <p className="ets__para">
            I use a focused set of modern technologies to design and develop
            high-performance, scalable and visually appealing websites. Each
            tool plays a specific role in creating clean, maintainable and
            effective solutions for real business needs.
          </p>

          <div className="ets__pillars" role="list">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="ets__pillar" role="listitem">
                <span className="ets__pillar-icon" aria-hidden="true">
                  {pillar.icon}
                </span>
                <span className="ets__pillar-title">{pillar.title}</span>
                <span className="ets__pillar-desc">{pillar.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
