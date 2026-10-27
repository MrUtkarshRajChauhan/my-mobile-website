import portraitUrl from '../../assets/my_background-contact.png'
import avatar01 from '../../assets/avatar-01.jpg'
import avatar02 from '../../assets/avatar-02.jpg'
import avatar03 from '../../assets/avatar-03.jpg'
import avatar04 from '../../assets/avatar-04.jpg'

/**
 * HERO — home section (full-viewport cinematic composition).
 *
 * Imagery comes exclusively from the project's root assets folder. Nothing
 * is redrawn, recoloured or replaced; the supplied monogram portrait sits
 * bottom-anchored through a transparent cutout.
 *
 * The copy below is the established site wording, verified against the
 * project's own design mockup (assets/ui/my-website/ui-home.png):
 *   eyebrow: WEBSITE DEVELOPER / BANGALORE, INDIA
 *   headline: I Design & Develop High-Quality Digital Experiences
 *             That Help Businesses Grow.  (final phrase, mint)
 *   paragraph as written on the mockup
 *   CTAs: View My Work / Let's Talk
 *   trust: Trusted by businesses / Startups · Local Businesses · Creators
 *   scroll cue: SCROLL
 *
 * The header row (monogram + menu control) moved into the fixed SiteHeader
 * shared by every screen — this section keeps only its own composition.
 * The CTA buttons remain intentionally non-navigational: the reference
 * does not define destinations, so none are invented (the menu, scroll cue
 * and footer provide the real navigation).
 */

const AVATARS = [
  { src: avatar01 },
  { src: avatar02 },
  { src: avatar03 },
  { src: avatar04 },
]

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.75 6h8.5M6.9 2.9 10 6 6.9 9.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="hero">
      {/* Emerald atmosphere: layered CSS gradients only, no image asset. */}
      <div className="hero__atmos" aria-hidden="true" />

      {/* Transparent cutout portrait, bottom-anchored foreground. */}
      <img
        className="hero__portrait"
        src={portraitUrl}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />

      {/* Legibility scrims for header and lower copy zones. */}
      <div className="hero__scrims" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__main">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-label">
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              Website Developer
            </span>
            <span className="hero__eyebrow-sep" aria-hidden="true" />
            <span className="hero__eyebrow-loc">Bangalore, India</span>
          </p>

          <h1 className="hero__headline">
            <span>I Design &amp; Develop</span>{' '}
            <span>High-Quality Digital</span>{' '}
            <span>Experiences</span>{' '}
            <span>That Help</span>{' '}
            <span className="hero__headline-mint">Businesses Grow.</span>
          </h1>

          <p className="hero__para">
            I build modern, high-performance websites that not only look
            exceptional but also help businesses attract customers, build
            trust and grow.
          </p>

          <div className="hero__ctas">
            <a className="hero__cta hero__cta--primary" href="#/work">
              <span>View My Work</span>
              <ArrowIcon />
            </a>
            <button type="button" className="hero__cta hero__cta--ghost">
              <span>Let&rsquo;s Talk</span>
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div className="hero__trust">
          <div className="hero__avatars" aria-hidden="true">
            {AVATARS.map((avatar) => (
              <img
                key={avatar.src}
                src={avatar.src}
                alt=""
                decoding="async"
                draggable={false}
              />
            ))}
          </div>
          <div className="hero__trust-text">
            <p className="hero__trust-title">Trusted by businesses</p>
            <p className="hero__trust-sub">
              Startups · Local Businesses · Creators
            </p>
          </div>
        </div>

        {/* Vertical scroll cue along the right edge — links to the next page. */}
        <a
          className="hero__scroll"
          href="#/about"
          aria-label="Scroll — go to About"
        >
          <span className="hero__scroll-label" aria-hidden="true">
            Scroll
          </span>
          <span className="hero__scroll-line" aria-hidden="true" />
          <span className="hero__scroll-dot" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
