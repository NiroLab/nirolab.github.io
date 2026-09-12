import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import Navbar from "./Navbar";
import { registerLenis } from "@/lib/lenis";
import Footer from "./Footer";
import ContentHealthBadge from "./ContentHealthBadge";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Layout: sticky dark-glass nav (in normal flow - no page offsets needed),
 * scroll-progress hairline, <Outlet/> content slot, footer.
 * Owns Lenis smooth scrolling (disabled for reduced motion) and
 * scroll-to-top on route change.
 */
export default function Layout() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis smooth scroll (lerp 0.09, wheelMultiplier 0.95 - design.md §6)
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    registerLenis(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenisRef.current = null;
      registerLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  // Hard scroll-to-top on every route change. The browser's own scroll
  // restoration and Lenis's internal scroll state can both re-apply the old
  // position after navigation, so: take over restoration, then force both
  // Lenis and the native scroller to 0 on the next frame (after paint).
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const raf = requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      {/* scroll progress hairline, fixed just under the navbar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-[60px] z-40 h-0.5 w-full origin-left bg-nsu-sky"
        aria-hidden
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ContentHealthBadge />
    </div>
  );
}
