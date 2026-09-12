import type Lenis from "lenis";

/**
 * Shared Lenis singleton. Layout registers its instance here so overlays
 * (e.g. the person modal) can stop/start smooth scrolling without prop
 * drilling. `data-lenis-prevent` on a scrollable element keeps native
 * scrolling working inside it even while Lenis is stopped.
 */
let instance: Lenis | null = null;

/** Called by Layout when the Lenis instance is created (null on destroy). */
export function registerLenis(lenis: Lenis | null): void {
  instance = lenis;
}

/** Pause smooth scrolling (background scroll-lock while a modal is open). */
export function stopLenis(): void {
  instance?.stop();
}

/** Resume smooth scrolling. */
export function startLenis(): void {
  instance?.start();
}
