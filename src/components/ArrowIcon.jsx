/**
 * Shared 12×12 thin square-cap stroke arrow glyphs — the About sequence's
 * control glyphs. Purely presentational.
 *
 * Default: a straight left-to-right arrow — every arrow on the site points
 * along its row (no northeast/diagonal mark anywhere anymore).
 * `horizontal`: the same straight left-to-right arrow (kept as an explicit
 * option for the controls that point along the row).
 */
export function ArrowIcon({ horizontal = false }) {
  return horizontal ? (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1.75 6h8.5M6.9 2.9 10 6 6.9 9.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1.75 6h8.5M6.9 2.9 10 6 6.9 9.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}
