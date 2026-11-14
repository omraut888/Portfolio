/**
 * Glitch-on-hover text. Renders the text with a data-text copy that the
 * .glitch ::before / ::after layers reuse: one cyan-tinted, one crimson, each
 * clipped to a jumping horizontal band and nudged sideways while hovered
 * (see .glitch in globals.css). Hover on the element itself or on any
 * ancestor with the `glitch-host` class triggers it. Disabled for
 * prefers-reduced-motion. The copies are hidden from screen readers.
 */
export default function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`glitch${className ? ` ${className}` : ""}`} data-text={text}>
      {text}
    </span>
  );
}
