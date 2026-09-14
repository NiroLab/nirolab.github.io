import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
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
      <footer className="relative overflow-hidden bg-nsu-ink text-slate-300">
        {/* node-and-wire motif */}
        <svg
          viewBox="0 0 1200 400"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <g stroke="var(--nsu-sky)" strokeWidth="1">
            <path d="M100 300 240 180 420 240 600 120 780 200 980 100 1120 220M240 180 300 340 520 320 600 120M780 200 820 340 520 320M980 100 1040 300 820 340" fill="none" />
          </g>
          <g fill="var(--nsu-sky)">
            <circle cx="100" cy="300" r="4" /><circle cx="240" cy="180" r="5" />
            <circle cx="420" cy="240" r="4" /><circle cx="600" cy="120" r="5" />
            <circle cx="780" cy="200" r="4" /><circle cx="980" cy="100" r="5" />
            <circle cx="1120" cy="220" r="4" /><circle cx="300" cy="340" r="4" />
            <circle cx="520" cy="320" r="4" /><circle cx="820" cy="340" r="4" />
            <circle cx="1040" cy="300" r="4" />
          </g>
          <circle cx="600" cy="120" r="6" fill="var(--nsu-gold)" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-5 py-16 pb-24 md:px-8 md:pb-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {/* brand */}
            <div>
              <img
                src="/assets/brand/niro-logo-white.svg"
                alt={site.fullName}
                className="h-11 w-auto"
              />
              <p className="mt-5 font-sans text-[0.9375rem] leading-[1.7]">
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
              <h4 className="mb-4 type-eyebrow text-nsu-skylight">
                {"// EXPLORE"}
              </h4>
              <ul className="space-y-2.5 font-sans text-[0.875rem]">
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
              <h4 className="mb-4 type-eyebrow text-nsu-skylight">
                {"// CONTACT"}
              </h4>
              <address className="space-y-3 font-sans text-[0.875rem] not-italic">
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
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="font-mono">
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
