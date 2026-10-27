import { useEffect, useRef, useState } from 'react'
import { Hero } from './components/Hero.jsx'
import { AboutIntro } from './components/AboutIntro.jsx'
import { AboutPhilosophy } from './components/AboutPhilosophy.jsx'
import { AboutApproach } from './components/AboutApproach.jsx'
import { AboutValues } from './components/AboutValues.jsx'
import { AboutClosing } from './components/AboutClosing.jsx'
import { ExpertiseTechStack } from './components/ExpertiseTechStack.jsx'
import { ExpertiseMeans } from './components/ExpertiseMeans.jsx'
import { ExpertiseTechnologies } from './components/ExpertiseTechnologies.jsx'
import { ExpertiseBar } from './components/ExpertiseBar.jsx'
import { Work } from './components/Work.jsx'
import { WorkTestimonials } from './components/WorkTestimonials.jsx'
import { Contact } from './components/Contact.jsx'
import { SiteHeader } from './components/SiteHeader.jsx'
import { SiteFooter } from './components/SiteFooter.jsx'
import { SceneThreadBeads } from './components/SceneThreadBeads.jsx'
import { AboutBar } from './components/AboutBar.jsx'
import './styles/about-background.css'
import './styles/expertise-region.css'
import './styles/expertise-means.css'

/**
 * SITE STRUCTURE — global shell over flowing content sections.
 *
 * One document holds the implemented content as real sections (not isolated
 * poster stops): the Hero, the About sequence's implemented blocks (Block 01
 * Intro / Block 02 Philosophy / Block 03 Approach / Block 04 Values /
 * Block 05 Closing), the site footer, and the Expertise region. Sections are
 * free-flowing — mandatory scroll-snap is
 * gone, so the screens connect into one continuous scroll instead of
 * wall-to-wall full-viewport stops.
 *
 * Layers, from the global shell down:
 * - `.about-scene` (fixed, z -1): the non-Home experience's one persistent
 *   background layer (the shared `assets/background-work-1.jpg`, styles/about-background.css)
 *   — the environment stays still while About content moves over it. Home,
 *   the site end and the menu all have opaque surfaces, so the scenery is
 *   never seen anywhere else and needs no visibility toggling.
 * - `SiteHeader` (fixed): brand + the site-wide menu. Rendered once; the
 *   per-stage headers were removed so the same control never appears twice.
 * - `main#main-content`: the content sections. `.page` wrappers carry the
 *   ids (`home`, `about`, `about-philosophy`, `about-approach`,
 *   `about-values`, `about-closing`, `expertise`) and refs the
 *   router needs; the page components mount single-section compositions
 *   inside. The About stages sit in an `.about-region` wrapper together with
 *   the persistent `AboutBar` so the bar's sticky containment stays inside
 *   the sequence (pinned to the viewport bottom through it, released at its
 *   end).
 * - `AboutBar` (sticky bottom): the About sequence's one persistent bottom
 *   navigation — ABOUT · five-position step track · NEXT/EXPERTISE. It never
 *   travels
 *   with a subsection and is never duplicated per block; its controls and
 *   its position states reflect the scroll-synced route.
 * - `SiteFooter`: structural end with real links only.
 * - About position states: the AboutBar track is a cumulative five-position
 *   step indicator — each position maps to one subsection and stays active
 *   once its subsection has been reached (positions never move; no
 *   continuous fill). The active subsection is the same scroll-synced
 *   `route` state that drives the address bar and the title.
 *
 * Address bar sync is unchanged: scroll position writes `#/`, `#/about`,
 * `#/about/philosophy`, `#/about/approach`, `#/about/values`,
 * `#/about/closing`, `#/expertise` via history.replaceState (silent,
 * never firing hashchange); explicit references — the Hero scroll cue,
 * bottom-bar links, menu links, a deep link such as `#/about/closing`, and
 * browser back/forward — scroll the matching section
 * into view, and a short navigation lock keeps un-arrived scroll events from
 * overwriting the target's address while a programmatic glide is in flight.
 * The document title follows the section actually in view.
 */

const ROUTES = {
  home: { hash: '#/', title: 'Portfolio' },
  about: { hash: '#/about', title: 'About — Portfolio' },
  philosophy: { hash: '#/about/philosophy', title: 'Philosophy — Portfolio' },
  approach: { hash: '#/about/approach', title: 'Approach — Portfolio' },
  values: { hash: '#/about/values', title: 'Values — Portfolio' },
  closing: { hash: '#/about/closing', title: 'Closing — Portfolio' },
  expertise: { hash: '#/expertise', title: 'Expertise — Portfolio' },
  expertiseStack: { hash: '#/expertise/stack', title: 'Technologies — Portfolio' },
  expertiseMeans: { hash: '#/expertise/means', title: 'Means — Portfolio' },
  work: { hash: '#/work', title: 'Work — Portfolio' },
  contact: { hash: '#/contact', title: 'Contact — Portfolio' },
}

const ROUTE_ORDER = ['home', 'about', 'philosophy', 'approach', 'values', 'closing', 'expertise', 'expertiseMeans', 'expertiseStack', 'work', 'contact']

const routeFromHash = () => {
  const hash = window.location.hash
  if (hash.startsWith('#/about/philosophy')) return 'philosophy'
  if (hash.startsWith('#/about/approach')) return 'approach'
  if (hash.startsWith('#/about/values')) return 'values'
  if (hash.startsWith('#/about/closing')) return 'closing'
  if (hash.startsWith('#/expertise/means')) return 'expertiseMeans'
  if (hash.startsWith('#/expertise/stack')) return 'expertiseStack'
  if (hash.startsWith('#/expertise')) return 'expertise'
  if (hash.startsWith('#/work')) return 'work'
  if (hash.startsWith('#/contact')) return 'contact'
  if (hash.startsWith('#/about')) return 'about'
  return 'home'
}

// The Work section's first milestone position (the same `stepLen` contract
// Work.jsx uses): arriving at `#/work` lands on the ENTRY beat so the hero
// copy is already in view, instead of on the section's top edge where the
// timeline's pre-state still holds.
const WORK_ENTRY_STEP = () => {
  const H = window.innerHeight
  return Math.round(Math.max(240, Math.min(400, H * 0.3)))
}

const scrollToWorkEntry = (section) => {
  const runway = section.querySelector('.work01__runway')
  if (!runway) {
    section.scrollIntoView()
    return
  }
  window.scrollTo({
    top: runway.getBoundingClientRect().top + window.scrollY + WORK_ENTRY_STEP(),
    behavior: 'auto',
  })
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const routeRef = useRef(route)
  // While an explicit reference (menu link, scroll cue, bottom-bar link, deep
  // link, history) is gliding the page, scroll events from un-arrived
  // positions must not overwrite the target's address or state. The lock
  // self-expires so a user who starts scrolling away mid-glide is always
  // re-synced afterwards.
  const navLockRef = useRef(null)
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const philosophyRef = useRef(null)
  const approachRef = useRef(null)
  const valuesRef = useRef(null)
  const closingRef = useRef(null)
  const expertiseRef = useRef(null)
  const expertiseMeansRef = useRef(null)
  const expertiseStackRef = useRef(null)
  const workRef = useRef(null)
  const contactRef = useRef(null)
  const stageRefs = {
    home: homeRef,
    about: aboutRef,
    philosophy: philosophyRef,
    approach: approachRef,
    values: valuesRef,
    closing: closingRef,
    expertise: expertiseRef,
    expertiseMeans: expertiseMeansRef,
    expertiseStack: expertiseStackRef,
    work: workRef,
    contact: contactRef,
  }

  // Scroll position → route + address bar (silent replaceState).
  // Computed synchronously (a few rect reads per event, passive): no rAF
  // gating, so the swap happens even while the tab is throttled.
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2
      let next = routeRef.current
      for (const key of ROUTE_ORDER) {
        const el = stageRefs[key].current
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= mid && rect.bottom > mid) {
          next = key
          break
        }
      }
      const lock = navLockRef.current
      if (lock) {
        if (Date.now() <= lock.until) {
          if (next !== lock.route) return // glide still in flight
          navLockRef.current = null // target reached
        } else {
          navLockRef.current = null // lock expired
        }
      }
      if (next !== routeRef.current) {
        routeRef.current = next
        setRoute(next)
        history.replaceState(null, '', ROUTES[next].hash)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Deep link on first load: restore the scroll position from the URL hash
  // (the hash already set the route through useState; the lock keeps early
  // scroll events from re-deriving an un-arrived route mid-glide).
  useEffect(() => {
    const key = routeFromHash()
    navLockRef.current = { route: key, until: Date.now() + 1500 }
    if (key === 'work' && stageRefs.work.current) {
      scrollToWorkEntry(stageRefs.work.current)
    } else {
      stageRefs[key].current?.scrollIntoView()
    }
  }, [])

  // Explicit navigation (sequence links, menu, scroll cue, back/forward).
  useEffect(() => {
    const onHashChange = () => {
      const next = routeFromHash()
      navLockRef.current = { route: next, until: Date.now() + 1500 }
      routeRef.current = next
      setRoute(next)
      if (next === 'work' && stageRefs.work.current) {
        scrollToWorkEntry(stageRefs.work.current)
      } else {
        stageRefs[next].current?.scrollIntoView()
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Page title follows the section actually in view.
  useEffect(() => {
    document.title = ROUTES[route].title
  }, [route])

  const aboutVisible =
    route === 'about' ||
    route === 'philosophy' ||
    route === 'approach' ||
    route === 'values' ||
    route === 'closing'
  // The menu marks the top-level destination: within the About sequence it
  // stays "About" while the AboutBar communicates the exact subsection.
  const menuCurrent =
    aboutVisible
      ? 'about'
      : route === 'expertise' || route === 'expertiseMeans' || route === 'expertiseStack'
        ? 'expertise'
        : route

  return (
    <>
      {/* The About experience's persistent scene — one fixed background layer
          owned here with the site chrome (styles/about-background.css). The
          environment stays still; opaque Hero/footer/menu surfaces keep the
          layer invisible outside the About region. */}
      <div className="about-scene" aria-hidden="true"><SceneThreadBeads /></div>

      <SiteHeader current={menuCurrent} />

      <main id="main-content">
        <section className="page" id="home" ref={homeRef}>
          <Hero />
        </section>
        {/* The About region: the sequence's subsections plus the persistent
            bottom navigation. The wrapper is what keeps the bar's sticky
            containment (and the reserved bar band in the frames' bottom
            padding) scoped to the sequence. */}
        <div className="about-region">
          <section className="page" id="about" ref={aboutRef}>
            <AboutIntro />
          </section>
          <section className="page" id="about-philosophy" ref={philosophyRef}>
            <AboutPhilosophy />
          </section>
          <section className="page" id="about-approach" ref={approachRef}>
            <AboutApproach />
          </section>
          <section className="page" id="about-values" ref={valuesRef}>
            <AboutValues />
          </section>
          <section className="page" id="about-closing" ref={closingRef}>
            <AboutClosing />
          </section>
          <AboutBar current={route} />
        </div>
        {/* The Expertise region: the experience's screens plus the persistent
            bottom navigation. The wrapper keeps the bar's sticky containment
            (and the reserved bar band in the frames' bottom padding) scoped
            to the experience. The shared stationary scene paints behind it. */}
        <div className="expertise-region">
          <section className="page" id="expertise" ref={expertiseRef}>
            <ExpertiseTechStack />
          </section>
          <section className="page" id="expertise-means" ref={expertiseMeansRef}>
            <ExpertiseMeans />
          </section>
          <section className="page" id="expertise-stack" ref={expertiseStackRef}>
            <ExpertiseTechnologies />
          </section>
          <ExpertiseBar current={route} />
        </div>
        {/* Work + Contact: ported from the desktop project. They live in
            normal document flow after the Expertise region. */}
        <section className="page" id="work" ref={workRef}>
          <Work />
        </section>
        <section className="page" id="work-testimonials">
          <WorkTestimonials />
        </section>
        <section className="page" id="contact" ref={contactRef}>
          <Contact />
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
