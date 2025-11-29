import Lenis from "@studio-freight/lenis";

export const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.6, // slower scroll → smoother
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 2, // smoother touch scroll
    lerp: 0.08, // lower value = smoother easing
    easing: (t) => 1 - Math.pow(1 - t, 3), // cubic smooth ease
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
};
