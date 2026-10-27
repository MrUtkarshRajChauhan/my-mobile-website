import { useRef } from 'react'
import { useSectionReveal } from './useSectionReveal.js'
import '../styles/expertise-technologies.css'

/**
 * EXPERTISE — Page 03 · TECHNOLOGIES I USE (third screen of the
 * three-part Expertise experience).
 *
 * Section composition: the `02` numeral with a short thin horizontal rule
 * followed by the TECHNOLOGIES I USE eyebrow, the two-line serif headline
 * ("The right tools." / "Built to work together." — only the closing
 * phrase in the sequence's turquoise), the exact supporting paragraph, and
 * the seven outlined technology panels (Frontend, Frameworks, Backend,
 * Database & ORM, Deployment, Design, Optimization) holding twelve items
 * with their brand marks.
 *
 * The number is `02` and progress segment 2 is active because this is the
 * second Expertise screen (Page 01 is "MY TECH STACK"); the reference
 * artwork's `03`/segment 3 reflects a three-screen composition that does
 * not match this screen's actual position.
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

// Shared inline icon for the technology tiles. Each tile's SVG keeps its
// original aspect ratio via object-fit: contain (see the stylesheet).
const htmlIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M8 4 4 34l28 26 28-26L56 4H8Z" fill="#e34f26" />
    <path d="M32 56.5V7.5h24l4 27-28 22Z" fill="#f16529" opacity=".95" />
    <path d="M32 16h16l.6 6H32v6h15.8l-1.6 18L32 50V16Z" fill="#fff" />
    <path d="M32 16v6h-15.4l.6-6H32Zm0 12v6h-7.2l.6-6H32Zm0 12v6l-6.4-3.6.4-2.4H32Z" fill="#ebebeb" />
  </svg>
)

const cssIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M8 4 4 34l28 26 28-26L56 4H8Z" fill="#264de4" />
    <path d="M32 56.5V7.5h24l4 27-28 22Z" fill="#2965f1" opacity=".95" />
    <path d="M32 16h16l.6 6H32v6h15.8l-1.6 18L32 50V16Z" fill="#fff" />
    <path d="M32 16v6h-15.4l.6-6H32Zm0 12v6h-7.2l.6-6H32Zm0 12v6l-6.4-3.6.4-2.4H32Z" fill="#ebebeb" />
  </svg>
)

const jsIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="56" height="56" rx="4" fill="#f7df1e" />
    <path d="M17 47.5c1.2 2 3.2 3.5 6.4 3.5 3.8 0 6.2-2 6.2-6.6V22h-5.2v22.2c0 1.8-.8 2.4-2.1 2.4-1.4 0-2-.9-2.7-2.1L17 47.5Zm14.5-1.1c1.6 2.6 4 4.6 8.2 4.6 4.3 0 7.4-2.2 7.4-6.3 0-3.8-2.2-5.6-6.1-7.3l-1.8-.8c-2-.9-2.8-1.4-2.8-2.8 0-1.1.9-2 2.3-2 1.4 0 2.2.6 3 2l3.8-2.4c-1.6-2.8-3.9-3.9-6.8-3.9-4 0-6.6 2.6-6.6 6.3 0 3.9 2.2 5.7 5.6 7.1l1.8.8c2.1.9 3.2 1.5 3.2 3 0 1.3-1.1 2.2-2.9 2.2-2 0-3.1-1-4.1-2.6l-4.2 2.1Z" fill="#000" />
  </svg>
)

const tsIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="56" height="56" rx="4" fill="#3178c6" />
    <path d="M14 24h36v6H35v22h-6V30H14v-6Zm22 6h14v6H42v4h8v6h-8v8h-6V30Z" fill="#fff" />
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
    <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">node</text>
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

/* Official Simple Icons Hostinger mark (CC0), brand purple — identical to
   the page 02 Deploy card's marks so both deployment panels match. */
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

const seoIcon = (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="26" cy="26" r="16" fill="none" stroke="#00e6bc" strokeWidth="4" />
    <path d="M38 38 54 54" stroke="#00e6bc" strokeWidth="4" strokeLinecap="round" />
    <circle cx="26" cy="26" r="6" fill="#00e6bc" opacity=".35" />
  </svg>
)

const PANELS = [
  {
    heading: 'FRONTEND',
    items: [
      { label: 'HTML', icon: htmlIcon },
      { label: 'CSS', icon: cssIcon },
      { label: 'JavaScript', icon: jsIcon },
      { label: 'TypeScript', icon: tsIcon },
    ],
    ratio: '1.68fr',
  },
  {
    heading: 'FRAMEWORKS',
    items: [
      { label: 'React', icon: reactIcon },
      { label: 'Next.js', icon: nextIcon },
    ],
    ratio: '1fr',
  },
  {
    heading: 'DEPLOYMENT',
    items: [
      { label: 'Vercel', icon: vercelIcon },
      { label: 'Hostinger', icon: hostingerIcon },
      { label: 'Bluehost', icon: bluehostIcon },
    ],
    compact: true,
    ratio: '1fr',
  },
  {
    heading: 'DATABASE & ORM',
    items: [
      { label: 'MongoDB', icon: mongoIcon },
      { label: 'Prisma', icon: prismaIcon },
    ],
    ratio: '1fr',
  },
  {
    heading: 'BACKEND',
    items: [{ label: 'Node.js', icon: nodeIcon }],
    ratio: '0.70fr',
  },
  {
    heading: 'DESIGN',
    items: [{ label: 'Figma', icon: figmaIcon }],
    ratio: '0.96fr',
  },
  {
    heading: 'OPTIMIZATION',
    items: [{ label: 'SEO', icon: seoIcon }],
    ratio: '1.06fr',
  },
]

export function ExpertiseTechnologies() {
  const rootRef = useRef(null)
  useSectionReveal(rootRef, [
    { selector: '.et__indicator', y: 10},
    { selector: '.et__headline', y: 22},
    { selector: '.et__para', y: 14},
    { selector: '.et__panel', y: 10},
  ])

  return (
    <section className="et" ref={rootRef}>
      <div className="et__frame">
        <div className="et__main">
          <p className="et__indicator">
            <span className="et__indicator-row">
              <span className="et__indicator-num">03</span>
              <span className="et__indicator-rule" aria-hidden="true" />
            </span>
            <span className="et__indicator-label">Technologies I Use</span>
          </p>

          <h1 className="et__headline">
            <span>The right tools.</span>
            <span>
              Built to <em className="et__headline-accent">work together.</em>
            </span>
          </h1>

          <p className="et__para">
            A focused stack for designing, building, and delivering modern
            websites.
          </p>

          <div className="et__rows">
            <div className="et__row et__row--two">
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Frontend</span>
                </header>
                <div className="et__panel-items et__panel-items--four">
                  {PANELS[0].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className="et__item-tile">{item.icon}</span>
                      <span className="et__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Frameworks</span>
                </header>
                <div className="et__panel-items et__panel-items--two">
                  {PANELS[1].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className="et__item-tile">{item.icon}</span>
                      <span className="et__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="et__row et__row--two">
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Deployment</span>
                </header>
                <div className={`et__panel-items${PANELS[2].compact
                  ? ' et__panel-items--deploy'
                  : ' et__panel-items--one'}`}
                >
                  {PANELS[2].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className={`et__item-tile${PANELS[2].compact
                        ? ' et__item-tile--compact'
                        : ''}`}
                      >
                        {item.icon}
                      </span>
                      <span className={`et__item-label${PANELS[2].compact
                        ? ' et__item-label--compact'
                        : ''}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Database &amp; ORM</span>
                </header>
                <div className="et__panel-items et__panel-items--two">
                  {PANELS[3].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className="et__item-tile">{item.icon}</span>
                      <span className="et__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="et__row et__row--three">
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Backend</span>
                </header>
                <div className={`et__panel-items${PANELS[4].compact
                  ? ' et__panel-items--deploy'
                  : ' et__panel-items--one'}`}
                >
                  {PANELS[4].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className={`et__item-tile${PANELS[4].compact
                        ? ' et__item-tile--compact'
                        : ''}`}
                      >
                        {item.icon}
                      </span>
                      <span className={`et__item-label${PANELS[4].compact
                        ? ' et__item-label--compact'
                        : ''}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Design</span>
                </header>
                <div className="et__panel-items et__panel-items--one">
                  {PANELS[5].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className="et__item-tile">{item.icon}</span>
                      <span className="et__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="et__panel">
                <header className="et__panel-head">
                  <span className="et__panel-dot" aria-hidden="true" />
                  <span className="et__panel-heading">Optimization</span>
                </header>
                <div className="et__panel-items et__panel-items--one">
                  {PANELS[6].items.map((item) => (
                    <div key={item.label} className="et__item">
                      <span className="et__item-tile">{item.icon}</span>
                      <span className="et__item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
