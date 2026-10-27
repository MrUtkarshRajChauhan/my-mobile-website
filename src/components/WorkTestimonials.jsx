import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/work02.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * WORK 02 — CLIENT PERSPECTIVE (the testimonial carousel).
 *
 * WHERE IT SITS
 * A plain sibling of <Work /> in App: the same normal-flow position, the same
 * `--z-content` band and the same bare, transparent box. It therefore scrolls
 * over the ONE persistent fixed background (`.static-background`, mounted and
 * crossfaded in by <ExpertiseExitRunway />) exactly, with no second background
 * layer, no second pin and nothing added to the cinematic scroll distance.
 *
 * THE HANDOFF (one boundary timeline, no new bus)
 * Work 01's exit and this section's entrance share ONE paused-at-birth GSAP
 * timeline whose `progress()` IS the boundary progress `p ∈ [0,1]`, scrubbed
 * by a single non-pinning ScrollTrigger. Work 01's own scrubbed entrance owns
 * `.work__copy` and `.work__showcase`, so this timeline animates CHILDREN of
 * those boxes only — one writer per property, the two systems can never fight.
 *
 * THE CAROUSEL — one shared state, two coordinated systems
 * A single `index` state drives everything: the testimonial text (quote,
 * author, role, tags, avatar) AND the portrait-card stack arrangement. The
 * stack is a pure function of the index — `rotate(INITIAL_STACK, index)` with
 * INITIAL_STACK read front → middle → back — so text, counter and card roles
 * can never desynchronise:
 *
 *   ['green','yellow','blue']  (initial)
 *   -> next:  ['yellow','blue','green']   (yellow front, green to back)
 *   -> prev:  ['green','yellow','blue']   (green returns to front)
 *
 * Each stable card node (data-card) is animated to its new role inside ONE
 * GSAP timeline that also transitions the panel content (outgoing copy up and
 * out, incoming copy in from the travel direction, index committed at the
 * controlled swap point). A single animation lock ignores arrow clicks during
 * the transition; the lock is released on completion and its timeline is
 * killed on unmount. Reduced motion swaps content and snaps roles with no
 * travel.
 *
 * TESTIMONIAL CONTENT
 * The project ships NO verified client testimonials and no client imagery, so
 * the data holds THREE clearly-marked pending records — unattributed, none of
 * which presents itself as real client feedback. They exist so the carousel's
 * navigation, counter and card-role rotation are exercisable; replacing them
 * with real, attributed records is all that is needed for publication.
 */

export const PLACEHOLDER_TESTIMONIALS = [
  {
    id: 'pending-01',
    quote:
      'Feedback from a real collaboration will be published here once it has been shared and approved by the client.',
    author: 'Awaiting verified testimonial',
    role: 'Name, role and project context to be confirmed',
    isPlaceholder: true,
  },
  {
    id: 'pending-02',
    quote:
      'A second verified testimonial will replace this placeholder once it has been shared and approved for publication.',
    author: 'Awaiting verified testimonial',
    role: 'Name, role and project context to be confirmed',
    isPlaceholder: true,
  },
  {
    id: 'pending-03',
    quote:
      'A third verified testimonial will replace this placeholder once it has been shared and approved for publication.',
    author: 'Awaiting verified testimonial',
    role: 'Name, role and project context to be confirmed',
    isPlaceholder: true,
  },
]

/* -- PORTRAIT-CARD CAROUSEL CONSTANTS -------------------------------------- */

/** Stable card ids: identity (colour/artwork) never changes, only the role. */
export const PORTRAIT_CARDS = ['green', 'yellow', 'blue']
/** Initial stack order: front → middle → back. */
export const INITIAL_STACK = ['green', 'yellow', 'blue']

/**
 * The three positional roles, as GSAP transforms. Cards share ONE base box —
 * left 50% / top 50%, width 60% / height 84% of the stack container (see
 * `.work02__portrait-card`) — so any card can land in any role exactly.
 * xPercent/yPercent are relative to the card's own (unscaled) size and also
 * carry the -50/-50 vertical/horizontal centring; the values below were
 * measured from the section's standing layout:
 *
 *   middle: centre (~29%, 50%) of the container -> x = 50 + 0.6v + 30 = 29
 *           => xPercent -85 ; scale ≈ 58/60 -> 0.92 ; rotation -6
 *   back:   centre (~73%, 40%) of the container -> x = 73 => xPercent -11.5
 *           y = 40 => yPercent -62 ; scale ≈ 54/60 -> 0.88 ; rotation 5
 */
const ROLE_POSES = {
  front: {
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    rotation: 0,
    zIndex: 3,
    opacity: 1,
  },
  middle: {
    xPercent: -85,
    yPercent: -50,
    scale: 0.92,
    rotation: -6,
    zIndex: 2,
    opacity: 0.96,
  },
  back: {
    xPercent: -11.5,
    yPercent: -62,
    scale: 0.88,
    rotation: 5,
    zIndex: 1,
    opacity: 0.95,
  },
}

/** front → middle → back for the first three stack entries. */
function roleFor(stack, cardId) {
  const slot = stack.indexOf(cardId)
  if (slot === 0) return 'front'
  if (slot === 1) return 'middle'
  return 'back'
}

/** Rotate the stack by one position in each direction. */
const rotateForward = (items) => [...items.slice(1), items[0]]
const rotateBackward = (items) => [items[items.length - 1], ...items.slice(0, -1)]

/** Zero-pad a 1-based slide number to the two-digit house style. */
function pad(n) {
  return String(n).padStart(2, '0')
}

/** The circular control glyphs — the house inline-SVG convention, no icon font. */
function ControlArrow({ direction }) {
  return (
    <svg
      className="work02__panel-arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === 'prev' ? 'M13.75 5.5 7.25 12l6.5 6.5' : 'M10.25 5.5 16.75 12l-6.5 6.5'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function WorkTestimonials() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const portraitRef = useRef(null)
  const panelRef = useRef(null)
  /** The coordinated content container: outgoing + incoming copy. */
  const swapRef = useRef(null)
  /** One shared animation lock; never two overlapping timelines. */
  const isAnimatingRef = useRef(false)
  /** The narration timeline, so unmount/re-route can clean it up. */
  const navTlRef = useRef(null)

  const [index, setIndex] = useState(0)
  // `cardsMounted` runs its layout-set only once per section mount.
  const cardsMountedRef = useRef(false)

  const total = PLACEHOLDER_TESTIMONIALS.length
  // Single source of truth: the stack is derived from the SAME index that
  // selects the testimonial — no second mutable order to fall out of sync.
  const stack = (() => {
    let out = INITIAL_STACK
    for (let i = 0; i < ((index % INITIAL_STACK.length) + INITIAL_STACK.length) % INITIAL_STACK.length; i++) {
      out = rotateForward(out)
    }
    return out
  })()
  const current = PLACEHOLDER_TESTIMONIALS[index]
  // Until more than one verified record exists there is nothing to navigate
  // to, so the arrows stay visibly present but genuinely disabled — never a
  // control that moves the counter while the testimonial stands still.
  const canNavigate = total > 1

  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /**
   * Apply a card's pose for `stack` at index time. Posing via a static
   * transform, so reduced motion and the mount-set both come through ONE
   * function that reads from the shared stack (never ad-hoc DOM state).
   */
  const poseFromStack = (stack, animate) => {
    const portrait = portraitRef.current
    if (!portrait) return
    gsap.utils.toArray(portrait.querySelectorAll('[data-card]')).forEach((el) => {
      const pose = ROLE_POSES[roleFor(stack, el.getAttribute('data-card'))]
      if (!pose) return
      gsap.set(el, { ...pose }) // no travel: reduced-motion-safe snapshot
    })
    if (animate) return
  }

  /**
   * The combined navigation timeline: the card stack moves to its new roles
   * and the panel content transitions out / commits / in simultaneously. One
   * lock guards against overlapping timelines on rapid clicks.
   */
  const narration = (step) => {
    const portrait = portraitRef.current
    const swap = swapRef.current
    if (!portrait || !swap || !canNavigate) return
    if (isAnimatingRef.current) return
    const cards = gsap.utils.toArray(portrait.querySelectorAll('[data-card]'))
    if (cards.length === 0) return

    const nextIndex = (index + step + total) % total
    const nextStack =
      step > 0 ? rotateForward(stack) : rotateBackward(stack)

    isAnimatingRef.current = true
    const reduced = reduceMotion

    // Reduced motion: snap cards and swap content in place; no travel at all.
    if (reduced) {
      poseFromStack(nextStack, false)
      setIndex(nextIndex)
      isAnimatingRef.current = false
      return
    }

    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power3.inOut' },
      onComplete: () => {
        isAnimatingRef.current = false
        navTlRef.current = null
      },
    })
    navTlRef.current = tl

    // All three stable nodes in one coordinated pass. The outgoing front card
    // drops its zIndex immediately, so the incoming cards visibly travel
    // over it instead of popping above it at the end.
    cards.forEach((el) => {
      const id = el.getAttribute('data-card')
      tl.to(el, { ...ROLE_POSES[roleFor(nextStack, id)] }, 0)
    })

    // Panel content: out (towards the travel origin's far side), commit the
    // shared index (React re-renders the copy from the same state), then in.
    tl.to(
      swap,
      {
        y: step > 0 ? -14 : 14,
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.out',
      },
      0.08,
    )
    tl.add(() => setIndex(nextIndex), 0.3)
    tl.fromTo(
      swap,
      { y: step > 0 ? 18 : -18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
      0.34,
    )
    // The cards themselves continue to 0.6; the content finishes at ~0.64 —
    // both systems move within the same transition window.
  }

  const go = (step) => {
    if (!canNavigate) return
    narration(step)
  }

  // ONE shared boundary timeline for the Work 01 exit and the Work 02 entrance.
  //
  // Scrubbed and non-pinning: the section stays in normal document flow and the
  // timeline's progress is driven purely by scroll position, so the whole
  // handoff reverses naturally and lands correctly wherever the page is
  // refreshed.
  //
  // Created only once the cinematic `.pin-spacer` exists: the pin-spacer is
  // inserted asynchronously when the 183 frames finish preloading, and until
  // then the document is in its transient, much shorter pre-pin layout, so
  // measuring the boundary early would compute an interval wrong by several
  // viewports. A MutationObserver fires the moment the settled document exists
  // — the same contract Work.tsx and ExpertiseExitRunway already use, with no
  // timer and no polling.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const head = headRef.current
    const portrait = portraitRef.current
    const panel = panelRef.current
    if (!section || !head || !portrait || !panel) return

    // Reduced motion: no translation and no reveal. Both sections simply rest
    // in place, fully visible, and the reading order is untouched.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Still pose the cards so the stack arrangement is correct with no JS
      // travel at all.
      poseFromStack(stack, false)
      return
    }

    // Work 01 elements are owned by Work 01's 5-beat timeline; do not animate them here.
    const work01 = document.getElementById('work')
    if (!work01) return

    let context = null

    const create = () => {
      if (context) return

      context = gsap.context(() => {
        const boundary = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 12%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // Normalise the timeline's total duration to exactly 1 so its
        // `progress()` IS the shared boundary progress p.
        boundary.to({}, { duration: 1 }, 0)

        // ---- WORK 02 ENTRANCE ---------------------------------------------
        // Positions are the groups' intended final spots; the whole section
        // also travels through normal document flow, so this is a short
        // relative reveal on top of that, never a second movement system.

        // Upper row — 0.30 -> 0.65, entering from +32px.
        boundary.fromTo(
          head,
          { y: 32, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35 },
          0.3,
        )

        // Portrait stack — 0.40 -> 0.88, entering from +56px.
        boundary.fromTo(
          portrait,
          { y: 56, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.48 },
          0.4,
        )

        // Testimonial panel — 0.45 -> 0.94, entering from +44px.
        boundary.fromTo(
          panel,
          { y: 44, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.49 },
          0.45,
        )

        // Refresh this one instance after the pin-spacer settles (same
        // contract as above — no second measurement pass, no other triggers).
        boundary.scrollTrigger?.refresh()
      }, section)
    }

    create()

    return () => {
      context?.revert()
      context = null
    }
  }, [])

  // Card pose at rest + on remount: derived strictly from the shared stack.
  useLayoutEffect(() => {
    if (cardsMountedRef.current) return
    cardsMountedRef.current = true
    poseFromStack(stack, false)
    return () => {
      // Drop the narration timeline on unmount or route change: no orphaned
      // tweens, no overlap with the next mount, and the lock releases itself
      // via onComplete only when this timeline finishes cleanly.
      navTlRef.current?.kill()
      navTlRef.current = null
      isAnimatingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      id="work-testimonials"
      className="work02"
      ref={sectionRef}
      aria-labelledby="work02-title"
    >
      {/* UPPER ROW — section label, headline, supporting copy and the slide
          counter. In normal flow at the top of the section; the two visual
          columns below are the absolutely positioned layers. */}
      <div className="work02__inner">
        <header className="work02__head" ref={headRef}>
          <div className="work02__intro">
            <p className="work02__eyebrow">
              <span className="work02__eyebrow-num">02</span>
              <span className="work02__eyebrow-line" aria-hidden="true" />
              <span className="work02__eyebrow-text">Client Perspective</span>
            </p>

            <h2 className="work02__title" id="work02-title">
              <span className="work02__title-line">Trusted by</span>
              <span className="work02__title-line work02__title-accent">
                Businesses.
              </span>
            </h2>
          </div>

          <div className="work02__support">
            <p className="work02__support-lead">
              Real collaborations. Meaningful results.
            </p>
            <p className="work02__support-note">
              Here&rsquo;s what clients and partners say about working together.
            </p>
          </div>

          {/* LOCAL decorative rule + counter, derived from the SAME shared
              index that drives the card stack. */}
          <div className="work02__counter">
            <span className="work02__counter-rule" aria-hidden="true" />
            <span className="work02__counter-value" aria-live="polite">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
        </header>
      </div>

      {/*
        PORTRAIT-CARD STACK — carousel roles.

        Three stable card nodes (stable `data-card` ids; never recreated by
        navigation). Identity appearance (colour / border / artwork slot)
        belongs to the card; its POSITION is a carousel role expressed as a
        GSAP transform derived from the shared stack. Initial arrangement:
        green front (centre), yellow middle (behind, left),
        blue back (behind, upper-right).

        TODO(assets): drop the supplied transparent portrait-stack composite in
        as `assets/portrait-stack.png` when it arrives; the stack container's
        geometry already matches the intended composition.
      */}
      <div className="work02__portrait" ref={portraitRef} aria-hidden="true">
        {INITIAL_STACK.map((cardId) => (
          <span
            key={cardId}
            data-card={cardId}
            className={`work02__portrait-card work02__portrait-card--${cardId}`}
          >
            {cardId === 'green' ? (
              <span className="work02__portrait-note">
                Portrait artwork required
              </span>
            ) : null}
          </span>
        ))}
      </div>

      {/* TESTIMONIAL GLASS PANEL — one rounded, translucent card on the right.
          Never overlaps the portrait stack (it starts at 57% while the stack
          ends at 53%). */}
      <article className="work02__panel" ref={panelRef}>
        <p className="work02__panel-eyebrow">
          <span className="work02__panel-dot" aria-hidden="true" />
          <span className="work02__panel-eyebrow-text">Client Testimonial</span>
        </p>

        <span className="work02__panel-quote" aria-hidden="true">
          &ldquo;
        </span>

        {/* Content container: a STABLE node animated by the carousel timeline
            (outgoing copy up and out, incoming copy in from the travel side).
            The arrow controls are deliberately NOT inside this subtree, so a
            transition can never destroy the button being used. */}
        <div className="work02__panel-flow">
          <div className="work02__panel-swap" ref={swapRef}>
            <blockquote className="work02__panel-text">
              <p>{current.quote}</p>
            </blockquote>

            <span className="work02__panel-rule" aria-hidden="true" />

            <footer className="work02__panel-foot">
              <div className="work02__panel-author">
                {current.avatar ? (
                  <img
                    className="work02__panel-avatar"
                    src={current.avatar}
                    alt={current.avatarAlt ?? ''}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  /* No verified client photograph exists, so the avatar is an
                     empty frame rather than an invented identity. */
                  <span
                    className="work02__panel-avatar work02__panel-avatar--empty"
                    aria-hidden="true"
                  />
                )}

                <span className="work02__panel-meta">
                  <span className="work02__panel-name">{current.author}</span>
                  <span className="work02__panel-role">{current.role}</span>
                  {current.tags && current.tags.length > 0 ? (
                    <span className="work02__panel-tags">
                      {current.tags.map((tag) => (
                        <span className="work02__panel-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </div>
            </footer>
          </div>

          {/* Circular controls — stable nodes. Disabled — not fake — until
              more than one verified record exists in the data. */}
          <div className="work02__panel-controls">
            <button
              type="button"
              className="work02__panel-arrow"
              onClick={() => go(-1)}
              disabled={!canNavigate}
              aria-label="Previous testimonial"
            >
              <ControlArrow direction="prev" />
            </button>
            <button
              type="button"
              className="work02__panel-arrow"
              onClick={() => go(1)}
              disabled={!canNavigate}
              aria-label="Next testimonial"
            >
              <ControlArrow direction="next" />
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}
