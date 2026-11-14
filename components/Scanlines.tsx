/**
 * Page-wide CRT texture: fixed 2px scanline stripes plus one brighter band
 * sweeping slowly downward (CSS only, see .scanlines in globals.css).
 * Ignores the pointer and is hidden for prefers-reduced-motion.
 */
export default function Scanlines() {
  return (
    <div className="scanlines" aria-hidden="true">
      <div className="scanline-band" />
    </div>
  );
}
