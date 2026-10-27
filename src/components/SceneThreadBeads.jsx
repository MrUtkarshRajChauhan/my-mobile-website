/**
 * SCENE THREAD BEADS — the luminous nodes on the shared background layer.
 *
 * Copied from the desktop project's Work/Contact background overlay
 * (src/ui/ExpertiseExitRunway.tsx): the five thin curved threads already
 * painted by `assets/background-work-1.jpg` are traced here as geometry in
 * <defs> — the trace is byte-identical to the desktop THREAD_SHIMMER source
 * (smoothed centre-lines measured from the asset, deviation ≈ 2 source
 * pixels). The paths are NEVER stroked: the artwork draws the lines.
 *
 * On the desktop each path carries one small mint bead that travels the
 * curve with native SMIL. The mobile shared background is a stationary
 * environment by established constraint (no scrolling parallax, no motion on
 * the background layer), so each bead rests at a fixed position along its
 * own curve — the desktop's bead painting (halo, body, core, specular) at
 * the desktop's opacity ceiling, just without travel or fade.
 *
 * `viewBox 0 0 1408 736` is the asset's exact pixel box and
 * `preserveAspectRatio="xMidYMid slice"` mirrors the layer's own
 * cover / center-center, so the beads crop with the image at every viewport
 * and always sit on their threads. The overlay is aria-hidden, outside the
 * tab order, and pointer-events: none via the stylesheet.
 */

const THREAD_SHIMMER = [
  {
    group: 'upper-left',
    d: 'M 484 0 C 469 5.3 418.7 22.7 393.8 32 C 368.8 41.3 356 46.7 334.5 56 C 313 65.3 288.5 76 264.8 88 C 241 100 214 114.7 191.8 128 C 169.5 141.3 149.8 154.7 131.3 168 C 112.7 181.3 96.9 193.3 80.3 208 C 63.6 222.7 44.5 242 31.3 256 C 18 270 6 286 1 292',
  },
  {
    group: 'upper-right',
    d: 'M 1331 0 C 1332.9 4 1339.2 16 1342.5 24 C 1345.8 32 1347.3 34.7 1350.8 48 C 1354.3 61.3 1361 85.3 1363.5 104 C 1366 122.7 1366.4 142.7 1365.8 160 C 1365.1 177.3 1363.4 192 1359.8 208 C 1356.1 224 1349.2 242.7 1343.8 256 C 1338.3 269.3 1335.7 274.7 1327 288 C 1318.3 301.3 1302.3 323 1291.8 336 C 1281.3 349 1268.6 361 1264 366',
  },
  {
    group: 'mid-right',
    d: 'M 1404 348 C 1383.7 352.7 1327.9 363.3 1282 376 C 1236.1 388.7 1164.9 412 1128.8 424 C 1092.6 436 1094.5 436 1065.3 448 C 1036 460 992.5 477.7 953.3 496 C 914 514.3 850.5 547.7 830 558',
  },
  {
    group: 'lower-right',
    d: 'M 1405 432 C 1400.1 433.3 1394.7 436 1375.8 440 C 1356.8 444 1320.7 449.3 1291.5 456 C 1262.3 462.7 1227.2 472 1200.5 480 C 1173.8 488 1155.3 494.7 1131.3 504 C 1107.3 513.3 1079.4 525.3 1056.5 536 C 1033.6 546.7 1013.5 557.3 994 568 C 974.5 578.7 956.9 589.3 939.8 600 C 922.6 610.7 911.8 617.3 891.3 632 C 870.7 646.7 837.4 670.8 816.5 688 C 795.6 705.2 774.4 727.2 766 735',
  },
  {
    group: 'lower-left',
    d: 'M 1 415 C 2.8 416.5 7.6 419.6 11.5 423.8 C 15.4 427.9 16.6 433.3 24.3 440 C 31.9 446.7 45.5 456 57.5 464 C 69.5 472 82.4 480 96.5 488 C 110.6 496 123.7 503 142.3 512 C 160.8 521 197 537 208 542',
  },
]

/**
 * Resting positions: fixed points sampled on the desktop's own geometry (each
 * control-point vertex from its path above), one bead per thread.
 */
const BEAD_POSITIONS = {
  'upper-left': { x: 131.3, y: 168 },
  'upper-right': { x: 1343.8, y: 256 },
  'mid-right': { x: 953.3, y: 496 },
  'lower-right': { x: 994, y: 568 },
  'lower-left': { x: 57.5, y: 464 },
}

export function SceneThreadBeads() {
  return (
    <svg
      className="work-background__thread-overlay"
      viewBox="0 0 1408 736"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Soft outer halo: a bright mint-white centre falling through the
            inner neon and the mint accent to a restrained emerald rim, and
            finally to full transparency exactly at the circle's edge — the
            desktop's own gradient, copied verbatim. */}
        <radialGradient id="thread-bead-halo">
          <stop offset="0%" stopColor="#E6FFF7" stopOpacity="0.95" />
          <stop offset="18%" stopColor="#65FFD1" stopOpacity="0.76" />
          <stop offset="45%" stopColor="#50E3A4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00D6A0" stopOpacity="0" />
        </radialGradient>

        {/* Geometry only — inside <defs>, therefore never painted. */}
        {THREAD_SHIMMER.map((thread) => (
          <path key={thread.group} id={`thread-path-${thread.group}`} d={thread.d} />
        ))}
      </defs>

      {THREAD_SHIMMER.map((thread) => {
        const at = BEAD_POSITIONS[thread.group]
        return (
          // Layered like a glass bead, exactly as the desktop paints it:
          // halo, mint body, bright core and an offset specular highlight.
          <g
            key={thread.group}
            className="thread-bead"
            transform={`translate(${at.x} ${at.y})`}
            opacity="0.9"
          >
            <circle r="6" fill="url(#thread-bead-halo)" />
            <circle r="2.7" fill="#50E3A4" opacity="0.72" />
            <circle r="1.25" fill="#E6FFF7" opacity="0.95" />
            <circle cx="-0.45" cy="-0.45" r="0.45" fill="#FFFFFF" opacity="0.78" />
          </g>
        )
      })}
    </svg>
  )
}
