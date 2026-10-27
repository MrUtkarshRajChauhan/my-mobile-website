import monogramUrl from '../../assets/monogram.png'
import '../styles/site.css'

/**
 * SITE FOOTER — the content journey's structural end (global shell).
 *
 * Contains only established facts and real destinations:
 * - the monogram brand mark linking home,
 * - the identity line established by the hero's eyebrow copy
 *   ("Website developer — Bangalore, India"), right-aligned,
 * - the copyright line: current year + "All rights reserved".
 *
 * No contact details, work listings or other content are invented here — the
 * footer does not pretend otherwise.
 */

export function SiteFooter() {
  return (
    <footer className="sf">
      <a className="sf__brand" href="#/" aria-label="Home — back to top">
        <span className="site__monogram">
          <img
            src={monogramUrl}
            alt=""
            aria-hidden="true"
            draggable={false}
            decoding="async"
          />
        </span>
      </a>
      <div className="sf__lines">
        <p className="sf__line">Website developer — Bangalore, India</p>
        <p className="sf__line">©{new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  )
}
