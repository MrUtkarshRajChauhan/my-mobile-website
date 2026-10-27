import { useEffect, useRef, useState } from 'react'
import monogramUrl from '../../assets/monogram.png'
import '../styles/mm.css'
import { SOCIAL_PROFILES, CONTACT_EMAIL_CONFIGURED, buildMailtoHref } from '../contactInfo'

/**
 * SHARED SITE MENU — the cinematic navigation overlay.
 *
 * The trigger (the fixed SiteHeader's `.site__menu`, three strokes morphing
 * to an X via `.mm-open`) opens one near-full-screen, inset rounded smoked-
 * glass panel over the current page. Layout per the overlay specification:
 *
 * - header row (inside the panel): the UR monogram with the identity pill
 *   below it, and a dedicated circular X close button at the panel's
 *   upper-right;
 * - a five-row navigation timeline: a thin vertical line to the left with
 *   circular nodes; each row is a two-column grid — the stacked number above
 *   the serif title on the left, the dash + tracked uppercase descriptor on
 *   the right;
 * - footer: one horizontal row — the four social controls left, the outlined
 *   `Hire Me →` pill right — below a fine divider.
 *
 * No links are invented: a social profile with no URL renders
 * non-interactive, exactly like the Contact panel's rows. The active page is
 * the scroll-synced route (accent passed by SiteHeader) — never hard-coded.
 *
 * Behaviour: Escape closes and refocuses the trigger, Tab is trapped,
 * background scrolling is locked while open, open/close ease with a
 * restrained fade/slide, and clicking any blank space (in the backdrop or
 * inside the panel) closes the overlay — clicks on links, buttons, and
 * [data-mm-interactive] elements never do.
 */

const PAGES = [
  { num: '01', label: 'Home', descriptor: 'Introduction', href: '#/', key: 'home' },
  { num: '02', label: 'About', descriptor: 'My Story', href: '#/about', key: 'about' },
  { num: '03', label: 'Expertise', descriptor: 'What I Do', href: '#/expertise', key: 'expertise' },
  { num: '04', label: 'Work', descriptor: 'Selected Projects', href: '#/work', key: 'work' },
  { num: '05', label: 'Contact', descriptor: 'Let’s Talk', href: '#/contact', key: 'contact' },
]

// Menu footer order, fixed by the design: GitHub, LinkedIn, Instagram, Gmail.
// URLs come from the contact configuration — never invented here. Gmail opens
// the pre-addressed mailto compose built from the configured contact email.
// A value that is not configured renders inactive until the owner fills it in.
const SOCIAL_ORDER = ['github', 'linkedin', 'instagram', 'gmail']

/* Official Simple Icons (simple-icons, CC0-1.0) path data, the same marks the
   Contact page renders — verbatim, one flat glyph so a circular button can pad
   around them. */
const SOCIAL_PATHS = {
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  /* Authentic Simple Icons Gmail mark (CC0), same flat currentColor glyph. */
  gmail:
    'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  /* Authentic Simple Icons Instagram mark — verbatim from Contact.jsx. */
  instagram:
    'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
}

/* The close glyph — a thin X on currentColor, the house inline-SVG convention. */
function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* The → on HIRE ME — straight horizontal, per the site-wide straight-arrow
   rule (the ↗ mark and every other diagonal arrow are retired everywhere). */
function HireGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const CLOSE_MS = 300

export function MobileMenu({ current, accentColor, className = '' }) {
  // `open` is the wanted state; `mounted` keeps the panel in the DOM through
  // the closing transition, then unmounts it (timer cleared on unmount).
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const firstLinkRef = useRef(null)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    if (open) {
      clearTimeout(closeTimer.current)
      setMounted(true)
    } else {
      closeTimer.current = setTimeout(() => setMounted(false), CLOSE_MS)
    }
  }, [open])
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // Background scroll lock while the overlay is open; restored on close.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    firstLinkRef.current && firstLinkRef.current.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current && triggerRef.current.focus()
        return
      }
      if (e.key === 'Tab') {
        const focusables =
          dialogRef.current &&
          dialogRef.current.querySelectorAll(
            'button:not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])',
          )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  /* Blank-space close: clicks in the outer backdrop or on empty panel space
     close the overlay; interactive elements run their own actions first. */
  const handleSurfaceClick = (e) => {
    if (!(e.target instanceof Element)) return
    if (e.target.closest('a, button, [data-mm-interactive]')) return
    setOpen(false)
  }

  // GitHub/LinkedIn resolve from the contact configuration; Gmail resolves
  // to the pre-addressed mailto compose of the configured email. A value
  // that is not configured stays inactive (no link is ever invented).
  const socials = SOCIAL_ORDER.map((id) => {
    if (id === 'gmail') {
      return {
        id,
        platform: 'Gmail',
        label: 'Pre-addressed email',
        url: CONTACT_EMAIL_CONFIGURED ? buildMailtoHref() : '',
      }
    }
    return SOCIAL_PROFILES.find((p) => p.id === id) || { id, url: '', platform: id }
  })

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={`${open ? 'mm-open ' : ''}${className}`.trim()}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="mm-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {mounted && (
        <div
          ref={dialogRef}
          className={`mm${open ? ' is-open' : ''}`}
          id="mm-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          onClick={handleSurfaceClick}
        >
          {/* The softly blurred, dimmed view of the current page behind the
              panel — a static backdrop, never a fabricated image. */}
          <div className="mm__scrim" aria-hidden="true" />

          <div className="mm__surface">
            <div className="mm__card">
              {/* HEADER: UR monogram + status pill; the circular X sits at
                  the panel's upper-right, separate from the pill. */}
              <header className="mm__top">
                <span className="mm__brand">
                  <span className="site__monogram">
                    <img
                      src={monogramUrl}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      decoding="async"
                    />
                  </span>
                </span>
                <span className="mm__pill">
                  <span className="mm__pill-dot" aria-hidden="true" />
                  <span>Website Developer</span>
                  <span className="mm__pill-sep" aria-hidden="true" />
                  <span>Bangalore, India</span>
                </span>
              </header>

              <button
                type="button"
                className="mm__close"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <CloseGlyph />
              </button>

              {/* FIVE ROUTES on the vertical timeline: number stacked above
                  the serif title, dash + descriptor in the right column. The
                  list is the one scrolling element on short screens. */}
              <nav className="mm__links" aria-label="Page links">
                <ul className="mm__list">
                  {PAGES.map((page, i) => {
                    const isActive = current === page.key
                    return (
                      <li
                        key={page.key}
                        className={`mm__item${isActive ? ' is-active' : ''}`}
                      >
                        <span
                          className="mm__node"
                          style={isActive ? { background: accentColor } : undefined}
                          aria-hidden="true"
                        />
                        <a
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={page.href}
                          className="mm__row"
                          style={isActive ? { '--mm-accent': accentColor } : undefined}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          <span className="mm__title">
                            <span className="mm__num">{page.num}</span>
                            <span className="mm__label">{page.label}</span>
                          </span>
                          <span className="mm__descgroup">
                            <span className="mm__dash" aria-hidden="true" />
                            <span className="mm__descriptor">{page.descriptor}</span>
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* FOOTER: fine divider, then one row — social circles left,
                  the outlined Hire Me pill right. */}
              <footer className="mm__foot">
                <ul className="mm__social" aria-label="Social profiles">
                  {socials.map((profile) => {
                    const active = profile.url.trim().length > 0
                    const glyph = (
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d={SOCIAL_PATHS[profile.id]} fill="currentColor" />
                      </svg>
                    )
                    return active ? (
                      <li key={profile.id}>
                        <a
                          className="mm__social-logo"
                          href={profile.url}
                          /* Mail compose stays in the current context;
                             external social profiles open in a new tab. */
                          target={profile.id === 'gmail' ? undefined : '_blank'}
                          rel={profile.id === 'gmail' ? undefined : 'noopener noreferrer'}
                          aria-label={profile.platform}
                        >
                          {glyph}
                        </a>
                      </li>
                    ) : (
                      <li key={profile.id}>
                        <span
                          className="mm__social-logo mm__social-logo--inactive"
                          data-mm-interactive
                          aria-disabled="true"
                          aria-label={profile.platform}
                        >
                          {glyph}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <a className="mm__hire" href="#/contact" onClick={() => setOpen(false)}>
                  <span>Hire Me</span>
                  <HireGlyph />
                </a>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
