import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Shared GSAP content reveal for the About sequence's and the Expertise
 * experience's content blocks (conventions: docs/ANIMATION_SYSTEM.md).
 *
 * `groups` is an ordered list of role groups — the reveal is one connected
 * scrubbed sequence, not unrelated tweens:
 *
 *   useSectionReveal(rootRef, [
 *     { selector: '.ai__indicator', y: 10 }, // metadata settles upward
 *     { selector: '.ai__headline',  y: 22 }, // headline enters as a composition
 *     { selector: '.ai__para',      y: 14 }, // paragraph follows
 *     { selector: '.ai__cta',       y: 12 }, // actions follow the copy
 *     { selector: '.ai__steps',     y: 10 }, // feature groups settle last
 *   ])
 *
 * Design constraints:
 * - SCRUBBED, not play-once: the scroll position drives the timeline
 *   directly over a 0.46-viewport window (`top 88%` → `top 42%` of the
 *   block's content wrapper) — scrolling downward reveals, scrolling
 *   upward reverses deterministically, and deep links / refreshes land on
 *   the correct local state by definition. This is the same pattern the
 *   Contact section has always used, applied to each block's measured
 *   content geometry: these blocks are bottom-anchored full-viewport
 *   compositions, so the content's own travel (top 88% → top 42% of the
 *   viewport) is exactly the visible span where a reveal can be seen.
 * - The trigger is the block's *content wrapper* itself
 *   (`[class$="__main"]`, falling back to the section root) — never the
 *   fixed controls, the background or the stage chrome.
 * - Groups are placed at fixed intervals (0.12) with an equal length
 *   (0.34 of the normalized window, consecutive groups overlapping
 *   slightly) so the order metadata → headline → paragraph → CTA/features
 *   lives inside ONE timeline; 0.08 stagger per additional item in a
 *   group.
 * - Per-role `y` offsets follow the site's motion language: metadata
 *   settles from 10, the headline composes in from 22, the paragraph
 *   follows from 14, actions from 12, features from 10. Easing
 *   `power2.out` for restrained entrances. `transform`/`opacity` only.
 * - Motion only under `prefers-reduced-motion: no-preference`
 *   (`gsap.matchMedia`); under `reduce` nothing is touched, so content is
 *   never hidden behind an animation that would never run.
 * - `immediateRender: false` keeps the elements at their natural (visible)
 *   state until the first scrub render — a throttled or paused tab can
 *   never strand the copy in a hidden "from" state.
 * - One trigger per section, created inside the matchMedia cleanup
 *   pattern, reverted on unmount (StrictMode-safe).
 */

const STAGGER = 0.08
const STEP = 0.12
const LENGTH = 0.34

export function useSectionReveal(rootRef, groups) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    // Each block's bottom-anchored content wrapper is the reveal anchor.
    const triggerEl =
      root.querySelector('[class$="__main"]') || root
    const groupTargets = groups
      .map((group) => ({
        y: group.y,
        targets: [...root.querySelectorAll(group.selector)],
      }))
      .filter((group) => group.targets.length > 0)
    if (groupTargets.length === 0) return undefined

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

      // Normalize the window to exactly 1 so the group offsets below are
      // literal fractions of the scroll span (the Contact pattern).
      tl.to({}, { duration: 1 }, 0)

      groupTargets.forEach((group, index) => {
        tl.fromTo(
          group.targets,
          { y: group.y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: LENGTH,
            ease: 'power2.out',
            stagger: STAGGER,
            immediateRender: false,
          },
          index * STEP,
        )
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })
    return () => mm.revert()
    // Stable inputs by contract: the group list is a module constant and
    // the ref target never changes, matching the established effect rules.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- no lint setup; intent: mount-only
  }, [])
}
