import monogramUrl from '../../assets/monogram.png'
import { MobileMenu } from './MobileMenu.jsx'
import '../styles/site.css'

/**
 * SITE HEADER — the global shell's fixed top bar, shared by every screen
 * (Home, both implemented About blocks, footer scrolls beneath it).
 *
 * - Brand mark: the established monogram through the same CSS crop window
 *   the hero used; it links to `#/` (home). One brand instance site-wide.
 * - `MobileMenu` is the functional site-wide navigation: it lists only the
 *   routes that exist (Home, About). The `current` page is derived from the
 *   scroll-synced route — never hard-coded; a stage never carries its own
 *   instance, so location state can never disagree.
 */

const PAGE_ACCENTS = {
  home: '#50e3a4',
  about: '#00e6bc',
  philosophy: '#00e6bc',
  expertise: '#00e6bc',
  expertiseMeans: '#00e6bc',
  expertiseStack: '#00e6bc',
  work: '#00e6bc',
  contact: '#00e6bc',
}

export function SiteHeader({ current = 'home' }) {
  return (
    <header className="site-header">
      <a className="site__brand" href="#/" aria-label="Home">
        <span className="site__monogram">
          <img
            src={monogramUrl}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </span>
      </a>
      {/* Live pages menu — lists only routes that exist. */}
      <MobileMenu
        current={current}
        accentColor={PAGE_ACCENTS[current] ?? PAGE_ACCENTS.home}
        className="site__menu"
      />
    </header>
  )
}
