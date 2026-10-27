import { useRef, Fragment, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/expertise-means.css'

/**
 * EXPERTISE — Page 02 · WHAT THIS MEANS FOR YOU (second screen of the
 * three-part Expertise experience).
 *
 * Section composition: the `02` numeral with a short thin horizontal rule
 * followed by the WHAT THIS MEANS FOR YOU eyebrow, the two-line serif
 * headline ("Better websites." / "Measurable results." — the closing
 * phrase in the sequence's turquoise), the exact supporting paragraph, and
 * the six-stage workflow (Design / Frontend / Backend / Data / Deploy /
 * Grow) as a two-column, three-row grid of outlined cards with connecting
 * lines, nodes and arrows.
 *
 * The number is `02` and progress segment 2 is active because this is the
 * second Expertise screen (Page 01 is "MY TECH STACK", Page 03 is
 * "TECHNOLOGIES I USE"); the reference artwork's `03`/segment 3 reflects a
 * three-screen composition that does not match this screen's actual
 * position.
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

// Reusable brand marks (inline SVG, object-fit: contain in the tile).
const figmaIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="24" y="4" width="16" height="16" rx="8" fill="#f24e1e" />
    <rect x="24" y="20" width="16" height="16" rx="8" fill="#ff7262" />
    <rect x="24" y="36" width="16" height="16" rx="8" fill="#a259ff" />
    <rect x="8" y="4" width="16" height="16" rx="8" fill="#ff7262" />
    <rect x="8" y="20" width="16" height="16" rx="8" fill="#1abcfe" />
    <rect x="8" y="36" width="16" height="16" rx="8" fill="#0acf83" />
  </svg>
)

const reactIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="32" cy="32" r="5" fill="#61dafb" />
    <g fill="none" stroke="#61dafb" strokeWidth="2.5">
      <ellipse cx="32" cy="32" rx="26" ry="10" />
      <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)" />
    </g>
  </svg>
)

const nextIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="56" height="56" rx="12" fill="#000" stroke="rgb(242 240 232 / 22%)" strokeWidth="1" />
    <path d="M16 44V20h5.5l13 16V20H40v24h-5.5l-13-16v16H16Z" fill="#fff" />
  </svg>
)

const nodeIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M32 4 56 18v28L32 60 8 46V18L32 4Z" fill="#339933" />
    <path d="M32 14 46 22v16L32 46 18 38V22l14-8Z" fill="#fff" opacity=".18" />
    <text x="32" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">node</text>
  </svg>
)

const mongoIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M32 4c-2 8-12 18-12 30a12 12 0 0 0 24 0C44 22 34 12 32 4Z" fill="#47a248" />
    <path d="M32 10c0 10 6 18 6 26a6 6 0 0 1-12 0c0-8 6-16 6-26Z" fill="#a6e8a8" opacity=".7" />
    <path d="M30 20c-1 8-3 16-1 26" stroke="#1f5e20" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
)

const prismaIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M12 48 32 8l20 40-20 8-20-8Z" fill="#2d3748" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M32 8v48" stroke="#fff" strokeWidth="1.5" />
    <path d="M12 48 32 32l20 16" stroke="#fff" strokeWidth="1" opacity=".6" />
  </svg>
)

const vercelIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M32 8 60 56H4L32 8Z" fill="#fff" />
  </svg>
)

/* Official Simple Icons Hostinger mark (CC0), filled with the brand's
   purple; same flat-glyph convention as the other module-level marks. */
const hostingerIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M16.415 0v7.16l5.785 3.384V2.949L16.415 0ZM1.8 0v11.237h18.815L14.89 8.09l-7.457-.003V3.024L1.8 0Zm14.615 20.894v-5.019l-7.514-.005c.007.033-5.82-3.197-5.82-3.197l19.119.091V24l-5.785-3.106ZM1.8 13.551v7.343l5.633 2.949v-6.988L1.8 13.551Z"
      fill="#673de6"
    />
  </svg>
)

/* Official Bluehost mark — the square-grid emblem from the brand's own
   published logo (Endurance International Group newsroom release, the
   geometry transcribed verbatim into this 24-unit box; brand blue). */
const bluehostIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g fill="#4f78ba">
      <rect x="1.1" y="1.1" width="6" height="6" />
      <rect x="8.98" y="1.1" width="6" height="6" />
      <rect x="16.86" y="1.1" width="6" height="6" />
      <rect x="1.1" y="8.98" width="6" height="6" />
      <rect x="8.98" y="8.98" width="6" height="6" />
      <rect x="16.86" y="8.98" width="6" height="6" />
      <rect x="1.1" y="16.86" width="6" height="6" />
      <rect x="8.98" y="16.86" width="6" height="6" />
      <rect x="16.86" y="16.86" width="6" height="6" opacity="0.5" />
    </g>
  </svg>
)

const seoIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="26" cy="26" r="16" fill="none" stroke="#00e6bc" strokeWidth="4" />
    <path d="M38 38 54 54" stroke="#00e6bc" strokeWidth="4" strokeLinecap="round" />
    <circle cx="26" cy="26" r="6" fill="#00e6bc" opacity=".35" />
  </svg>
)

const CARDS = [
  {
    number: '01',
    title: 'Design',
    techs: [{ label: 'Figma', icon: figmaIcon }],
    description: 'Plan the experience and create UI/UX.',
  },
  {
    number: '02',
    title: 'Frontend',
    techs: [
      { label: 'React', icon: reactIcon },
      { label: 'Next.js', icon: nextIcon },
    ],
    description: 'Build the interface using React / Next.js.',
  },
  {
    number: '03',
    title: 'Backend',
    techs: [{ label: 'Node.js', icon: nodeIcon }],
    description: 'Power the logic with server-side code and APIs.',
  },
  {
    number: '04',
    title: 'Data',
    techs: [
      { label: 'MongoDB', icon: mongoIcon },
      { label: 'Prisma', icon: prismaIcon },
    ],
    description: 'Store and organize data efficiently.',
  },
  {
    number: '05',
    title: 'Deploy',
    techs: [
      { label: 'Vercel', icon: vercelIcon },
      { label: 'Hostinger', icon: hostingerIcon },
      { label: 'Bluehost', icon: bluehostIcon },
    ],
    compact: true,
    description: 'Launch the website to the world.',
  },
  {
    number: '06',
    title: 'Grow',
    techs: [{ label: 'SEO', icon: seoIcon }],
    description: 'Improve discoverability and performance.',
  },
]

export function ExpertiseMeans() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.em__indicator', y: 10},
    { selector: '.em__headline', y: 22},
    { selector: '.em__para', y: 14},
    { selector: '.em__grid', y: 10},
  ])

  /* Connector flow — same scrubbed, mount-only trigger pattern as the
     content reveal (docs/ANIMATION_SYSTEM.md): the scroll position drives
     one timeline over the section's content window, so downward scrolling
     draws the accents and pulses and upward scrolling reverses them
     deterministically. Normalized to duration 1:

       0.58/0.66/0.74 — row accents draw left→right (0.10 each)
       +0.03          — a small cyan pulse travels to the arrowhead
       +0.09          — the arrowhead flares as the pulse arrives, then
                        settles to a restrained resting state
       0.60–0.88      — the outer vertical accents draw; the connection
                        nodes flare as their route reaches them (≤ 0.945)

     One ScrollTrigger, created inside gsap.matchMedia, reverted on unmount
     (StrictMode-safe). Under `prefers-reduced-motion: reduce` no timeline
     runs — the CSS keeps the whole circuit statically drawn. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const triggerEl = root.querySelector('[class$="__main"]') || root
    const svg = root.querySelector('.em__connectors')
    if (!svg) return undefined

    const accents = [...svg.querySelectorAll('.em__conn-accent:not(.em__conn-accent--v-left):not(.em__conn-accent--v-right), .em__conn-accent-h')]
    // Horizontal accents are the three rows' first-painted dashes; vertical
    // ones carry --v-left/--v-right classes.
    const hAccents = accents
    const pulses = [...svg.querySelectorAll('.em__conn-pulse')]
    const arrows = [...svg.querySelectorAll('.em__conn-arrow')]
    const vAccents = [
      svg.querySelector('.em__conn-accent--v-left'),
      svg.querySelector('.em__conn-accent--v-right'),
    ].filter(Boolean)
    const nodes = [...svg.querySelectorAll('.em__node')]

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })
      tl.to({}, { duration: 1 }, 0)

      hAccents.forEach((accent, i) => {
        const s = 0.58 + i * 0.08
        tl.to(accent, { strokeDashoffset: 0, duration: 0.1 }, s)
        const pulse = pulses[i]
        if (pulse) {
          tl.to(pulse, { attr: { cx: 56 }, duration: 0.06 }, s + 0.03)
          tl.fromTo(
            pulse,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.015, immediateRender: false },
            s + 0.03,
          )
          tl.to(pulse, { autoAlpha: 0, duration: 0.015 }, s + 0.075)
        }
        const arrow = arrows[i]
        if (arrow) {
          tl.to(arrow, { opacity: 1, duration: 0.02 }, s + 0.085)
          tl.to(arrow, { opacity: 0.5, duration: 0.05 }, s + 0.11)
        }
      })

      vAccents.forEach((accent) => {
        tl.to(accent, { strokeDashoffset: 0, duration: 0.28 }, 0.6)
      })

      nodes.forEach((node, i) => {
        // Left column flares slightly before the right one as the route
        // reaches each row (16.7 / 50 / 83.3 in the viewBox).
        const arrive = 0.6 + (i % 3) * 0.14 + (i < 3 ? 0 : 0.02)
        tl.to(node, { opacity: 1, duration: 0.02 }, arrive)
        tl.to(node, { opacity: 0.85, duration: 0.04 }, arrive + 0.02)
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only by contract
  }, [])

  return (
    <section className="em" ref={rootRef}>
      <div className="em__frame">
        <div className="em__main">
          <p className="em__indicator">
            <span className="em__indicator-row">
              <span className="em__indicator-num">02</span>
              <span className="em__indicator-rule" aria-hidden="true" />
            </span>
            <span className="em__indicator-label">What This Means For You</span>
          </p>

          <h1 className="em__headline">
            <span>Better websites.</span>
            <span>
              <em className="em__headline-accent">Measurable results.</em>
            </span>
          </h1>

          <p className="em__para">
            These technologies help me build fast, responsive and scalable
            websites that look good, work smoothly, and support your business
            goals—from first impression to real user action.
          </p>

          <div className="em__grid-wrap">
            <div className="em__grid">
              {CARDS.map((card) => (
                <article key={card.number} className="em__card">
                  <header className="em__card-head">
                    <span className="em__card-num">{card.number}</span>
                    <span className="em__card-title">{card.title}</span>
                  </header>
                  <div className={`em__card-tray${
                      card.techs.length > 1 ? ' em__card-tray--multi' : ''
                    }${card.compact ? ' em__card-tray--compact' : ''}`}
                  >
                    {card.techs.map((tech, index) => (
                      <Fragment key={tech.label}>
                        {index > 0 && !card.compact ? (
                          <span className="em__card-divider" aria-hidden="true" />
                        ) : null}
                        <div className="em__card-tech">
                          <span className={`em__card-tile${
                              card.compact ? ' em__card-tile--compact' : ''
                            }`}
                          >
                            {tech.icon}
                          </span>
                          <span className="em__card-techlabel">{tech.label}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <p className="em__card-desc">{card.description}</p>
                </article>
              ))}
            </div>

            {/* Decorative connector layer — thin muted circuit lines with
                bright cyan accent draws, traveling pulses and node flares.
                Sits behind the cards and never intercepts taps (pointer-events
                none). The accent strokes are statically hidden via the
                pathLength/dash trick, so without animation (or with reduced
                motion) the diagram still reads from the muted base. The GSAP
                timeline lives in the effect below. */}
            <svg
              className="em__connectors"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {/* Row 1 horizontal arrow (left card -> right card) */}
              <line className="em__conn-base-h" x1="42" y1="16.7" x2="56" y2="16.7" strokeLinecap="round" />
              <line className="em__conn-accent" x1="42" y1="16.7" x2="56" y2="16.7" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              <polygon className="em__conn-arrow" points="56,16.7 54.6,16.0 54.6,17.4" />
              <circle className="em__conn-pulse" cx="42" cy="16.7" r="0.55" opacity="0" />
              {/* Row 2 horizontal arrow */}
              <line className="em__conn-base-h" x1="42" y1="50" x2="56" y2="50" strokeLinecap="round" />
              <line className="em__conn-accent" x1="42" y1="50" x2="56" y2="50" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              <polygon className="em__conn-arrow" points="56,50 54.6,49.3 54.6,50.7" />
              <circle className="em__conn-pulse" cx="42" cy="50" r="0.55" opacity="0" />
              {/* Row 3 horizontal arrow */}
              <line className="em__conn-base-h" x1="42" y1="83.3" x2="56" y2="83.3" strokeLinecap="round" />
              <line className="em__conn-accent" x1="42" y1="83.3" x2="56" y2="83.3" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              <polygon className="em__conn-arrow" points="56,83.3 54.6,82.6 54.6,84.0" />
              <circle className="em__conn-pulse" cx="42" cy="83.3" r="0.55" opacity="0" />

              {/* Left outer vertical connector with nodes */}
              <line className="em__conn-base-v" x1="2" y1="16.7" x2="2" y2="83.3" strokeLinecap="round" />
              <line className="em__conn-accent em__conn-accent--v-left" x1="2" y1="16.7" x2="2" y2="83.3" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              <circle className="em__node em__node--l1" cx="2" cy="16.7" r="0.9" />
              <circle className="em__node em__node--l2" cx="2" cy="50" r="0.9" />
              <circle className="em__node em__node--l3" cx="2" cy="83.3" r="0.9" />

              {/* Right outer vertical connector with nodes */}
              <line className="em__conn-base-v" x1="98" y1="16.7" x2="98" y2="83.3" strokeLinecap="round" />
              <line className="em__conn-accent em__conn-accent--v-right" x1="98" y1="16.7" x2="98" y2="83.3" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
              <circle className="em__node em__node--r1" cx="98" cy="16.7" r="0.9" />
              <circle className="em__node em__node--r2" cx="98" cy="50" r="0.9" />
              <circle className="em__node em__node--r3" cx="98" cy="83.3" r="0.9" />

              {/* Horizontal stubs from cards to outer connectors */}
              <line className="em__conn-base-v" x1="2" y1="16.7" x2="6" y2="16.7" strokeLinecap="round" />
              <line className="em__conn-base-v" x1="94" y1="16.7" x2="98" y2="16.7" strokeLinecap="round" />
              <line className="em__conn-base-v" x1="2" y1="50" x2="6" y2="50" strokeLinecap="round" />
              <line className="em__conn-base-v" x1="94" y1="50" x2="98" y2="50" strokeLinecap="round" />
              <line className="em__conn-base-v" x1="2" y1="83.3" x2="6" y2="83.3" strokeLinecap="round" />
              <line className="em__conn-base-v" x1="94" y1="83.3" x2="98" y2="83.3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
