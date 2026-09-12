import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ArrowRight,
  Github,
  Linkedin,
  Facebook,
  Youtube,
  Mail,
} from "lucide-react";
import { useSite } from "@/lib/content";

/** Footer (design.md §8.2): deep ink, node-and-wire motif, official
 * NIRO lockup, 4 columns, CTA band above (except /contact), back-to-top pill. */
export default function Footer() {
  const site = useSite();
  const location = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const socials = [
    { icon: Github, href: site.socials.github, label: "GitHub" },
    { icon: Linkedin, href: site.socials.linkedin, label: "LinkedIn" },
    { icon: Facebook, href: site.socials.facebook, label: "Facebook" },
    { icon: Youtube, href: site.socials.youtube, label: "YouTube" },
    { icon: Mail, href: `mailto:${site.email}`, label: "Email" },
  ].filter((s) => s.href);

  return (
    <>
      {location.pathname !== "/contact" && (
        <div className="mx-auto max-w-7xl px-5 pb-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nsu-ink via-nsu-navy to-nsu-blue px-8 py-14 md:px-14">
            <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
            <svg
              viewBox="0 0 300 300"
              className="absolute -right-16 -top-16 h-64 w-64 opacity-30"
              fill="none"
              aria-hidden
            >
              <g transform="rotate(18 150 150)">
                <ellipse cx="150" cy="150" rx="130" ry="72" stroke="#3D8FE0" strokeWidth="1.5" />
              </g>
              <circle cx="272" cy="118" r="6" fill="#F2A900" />
            </svg>
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                  Want to collaborate with NIRO Lab?
                </h3>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 inline-block text-lg font-semibold text-white underline decoration-nsu-gold decoration-2 underline-offset-8 hover:text-nsu-ice"
                >
                  {site.email}
                </a>
              </div>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Get in touch
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="relative overflow-hidden bg-nsu-ink text-slate-300">
        {/* node-and-wire motif */}
        <svg
          viewBox="0 0 1200 400"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <g stroke="#3D8FE0" strokeWidth="1">
            <path d="M100 300 240 180 420 240 600 120 780 200 980 100 1120 220M240 180 300 340 520 320 600 120M780 200 820 340 520 320M980 100 1040 300 820 340" fill="none" />
          </g>
          <g fill="#3D8FE0">
            <circle cx="100" cy="300" r="4" /><circle cx="240" cy="180" r="5" />
            <circle cx="420" cy="240" r="4" /><circle cx="600" cy="120" r="5" />
            <circle cx="780" cy="200" r="4" /><circle cx="980" cy="100" r="5" />
            <circle cx="1120" cy="220" r="4" /><circle cx="300" cy="340" r="4" />
            <circle cx="520" cy="320" r="4" /><circle cx="820" cy="340" r="4" />
            <circle cx="1040" cy="300" r="4" />
          </g>
          <circle cx="600" cy="120" r="6" fill="#F2A900" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {/* brand */}
            <div>
              <img
                src="/assets/brand/niro-logo-white.svg"
                alt={site.fullName}
                className="h-11 w-auto"
              />
              <p className="mt-5 text-sm leading-relaxed">
                An innovation hub turning ideas into intelligent machines.
              </p>
              <div className="mt-5 flex gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-full border border-nsu-line-dark p-2.5 text-slate-300 transition-colors hover:border-nsu-sky hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* explore */}
            <nav aria-label="Explore">
              <h4 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#7FB3EC]">
                {"// EXPLORE"}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {site.nav.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* contact */}
            <div>
              <h4 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#7FB3EC]">
                {"// CONTACT"}
              </h4>
              <address className="space-y-3 text-sm not-italic leading-relaxed">
                <p>{site.address}</p>
                <p>
                  <a href={`mailto:${site.email}`} className="text-nsu-sky hover:text-white">
                    {site.email}
                  </a>
                </p>
                {site.officeHours && (
                  <p className="text-slate-400">Office hours: {site.officeHours}</p>
                )}
              </address>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-nsu-line-dark pt-6 text-xs text-slate-400">
            <span>
              © {new Date().getFullYear()} {site.name} - {site.university}
            </span>
            <span className="font-mono tracking-wide">
              {site.university} · {site.city}
            </span>
          </div>
        </div>
      </footer>

      {/* back-to-top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 left-6 z-40 rounded-full border border-nsu-line-dark bg-nsu-ink/90 p-3 text-nsu-sky shadow-lg backdrop-blur transition-colors hover:text-white"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
