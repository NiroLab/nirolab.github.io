import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSite } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Navbar (design.md §8.1): always-dark glass bar, 72px, compresses to 60px
 * past 200px scroll, hide-on-fast-scroll-down / reveal on scroll-up.
 * Sticky (in normal document flow) so no page needs offset bookkeeping.
 */
export default function Navbar() {
  const site = useSite();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompressed(y > 200);
    // hide on fast scroll down, reveal on scroll up
    if (y > 400 && y - prev > 8) setHidden(true);
    else if (prev - y > 4 || y < 120) setHidden(false);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-[rgba(6,26,58,0.72)] backdrop-blur-md transition-[height,border-color] duration-300",
          compressed ? "h-[60px] border-nsu-line-dark" : "h-[72px] border-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
          {/* brand */}
          <Link to="/" className="flex items-center gap-3" aria-label="NIRO Lab home">
            <img src="/assets/brand/logo.svg" alt="" className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-white">
                {site.name}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[#7FB3EC]">
                NSU · Robotics
              </span>
            </span>
          </Link>

          {/* desktop links */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {site.nav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative pt-3 text-sm font-semibold tracking-[0.01em] transition-colors",
                    isActive ? "text-white" : "text-slate-100/90 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-nsu-sky transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile full-screen drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-nsu-ink/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-nsu-navy px-8 py-6"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#7FB3EC]">
                  {"// MENU"}
                </span>
                <motion.button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  whileTap={{ rotate: 90 }}
                  className="rounded-md p-2 text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              <nav className="flex-1" aria-label="Mobile">
                <ul className="space-y-1">
                  {site.nav.map((item, i) => {
                    const active =
                      item.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.path);
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-baseline gap-4 rounded-lg px-3 py-3 font-display text-2xl font-semibold transition-colors",
                            active
                              ? "text-nsu-sky"
                              : "text-white hover:bg-white/5",
                          )}
                        >
                          <span className="font-mono text-xs text-nsu-sky/70">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
              <div className="border-t border-nsu-line-dark pt-6 font-mono text-xs leading-relaxed text-slate-300">
                <div>{site.email}</div>
                <div className="mt-1 text-nsu-sky/70">
                  {site.university} · {site.city}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
