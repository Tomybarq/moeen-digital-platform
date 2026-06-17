import { useState, useEffect } from "react";

/**
 * Reactive media-query hook that returns `true` when the viewport
 * width is **below** the given pixel threshold.
 *
 * @param {number} px  — breakpoint in pixels (default 1024)
 * @returns {boolean}  `true` = below breakpoint (mobile/tablet)
 */
export function useBreakpoint(px = 1024) {
  const [below, setBelow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < px : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Throttle with rAF so resize storms don't trigger React renders
    let raf;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setBelow(window.innerWidth < px);
      });
    };

    const mql = window.matchMedia(`(max-width: ${px - 1}px)`);
    // Modern browsers fire change events; fallback to resize for older
    mql.addEventListener("change", (e) => setBelow(e.matches));
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      mql.removeEventListener("change", (e) => setBelow(e.matches));
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [px]);

  return below;
}

export default useBreakpoint;