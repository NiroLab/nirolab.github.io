import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import Navbar from "./Navbar";
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

  // Lenis smooth scroll (lerp 0.09, wheelMultiplier 0.95 - design.md §6)
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
