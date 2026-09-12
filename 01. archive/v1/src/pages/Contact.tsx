import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Facebook,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Users,
  Youtube,
} from "lucide-react";
import { useSite, usePeople } from "@/lib/content";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import Crosshairs from "@/components/about/Crosshairs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------ section 1 */
function Hero() {
  const reduced = useReducedMotion();
  const words = "Let's build something intelligent.".split(" ");
  return (
    <section
      className="relative flex min-h-[52dvh] items-center overflow-hidden bg-hero-gradient"
      aria-label="Contact"
    >
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden />
      <svg
        viewBox="0 0 500 500"
        className="absolute -bottom-32 -right-24 h-[420px] w-[420px] opacity-25"
        fill="none"
        aria-hidden
      >
        <circle cx="250" cy="250" r="220" stroke="#3D8FE0" strokeWidth="1" />
        <circle cx="250" cy="250" r="150" stroke="#3D8FE0" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="250" cy="250" r="80" stroke="#3D8FE0" strokeWidth="1" />
        <circle cx="250" cy="30" r="6" fill="#F2A900" />
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className="h-px w-8 origin-left bg-nsu-sky"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#7FB3EC]"
          >
            {"// CONTACT"}
          </motion.span>
        </div>

        <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
          {words.map((word, i) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: reduced ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3 + i * 0.06,
                    ease: PRECISION_EASE,
                  }}
                >
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: PRECISION_EASE }}
          className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-200"
        >
          We welcome inquiries about collaborations, graduate research
          opportunities, partnerships, and student involvement.
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------- section 2 (left col) */
function CopyEmailChip({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // clipboard unavailable (non-secure context) - select fallback
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <span className="relative inline-block">
      <button
        onClick={copy}
        className="group inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-mono text-[13px] text-nsu-blue ring-1 ring-nsu-line transition-colors hover:ring-nsu-blue"
        aria-label={`Copy email address ${email}`}
      >
        {email}
        {copied ? (
          <Check className="h-3.5 w-3.5 text-nsu-success" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-nsu-slate transition-colors group-hover:text-nsu-blue" />
        )}
      </button>
      <span
        role="status"
        className={cn(
          "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-nsu-ink px-2.5 py-1 font-mono text-[11px] text-nsu-sky transition-opacity duration-200",
          copied ? "opacity-100" : "opacity-0",
        )}
      >
        Copied ✓
      </span>
    </span>
  );
}

function InfoCards() {
  const site = useSite();
  const people = usePeople();
  const leaders = people
    .filter((p) => p.category === "founding_faculty")
    .slice(0, 2)
    .map(
      (p) =>
        `${p.name} (${p.role.toLowerCase().includes("co-director") ? "Co-Director" : "Director"})`,
    )
    .join(" · ");

  const socials = [
    { icon: Github, href: site.socials.github, label: "GitHub" },
    { icon: Linkedin, href: site.socials.linkedin, label: "LinkedIn" },
    { icon: Facebook, href: site.socials.facebook, label: "Facebook" },
    { icon: Youtube, href: site.socials.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  const cards = [
    {
      icon: MapPin,
      title: "Visit",
      body: (
        <>
          <p className="text-sm leading-[1.7] text-nsu-text">
            NIRO Lab
            <br />
            North South University
            <br />
            Bashundhara, Dhaka-1229, Bangladesh
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-nsu-slate">
            Dept. of Electrical &amp; Computer Engineering
          </p>
        </>
      ),
    },
    {
      icon: Mail,
      title: "Email",
      body: (
        <>
          <CopyEmailChip email={site.email} />
          <p className="mt-3 text-sm leading-[1.6] text-nsu-slate">
            We typically respond within a few days.
          </p>
        </>
      ),
    },
    {
      icon: Users,
      title: "Leadership",
      body: (
        <>
          <Link
            to="/people"
            className="group text-sm leading-[1.7] text-nsu-text"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              {leaders || "Meet the lab's founding faculty"}
            </span>
          </Link>
          <p className="mt-3 text-sm leading-[1.6] text-nsu-slate">
            For supervision and research inquiries, reach the directors via the
            People page.
          </p>
        </>
      ),
    },
  ];

  return (
    <RevealGroup className="space-y-5" stagger={0.1}>
      {cards.map(({ icon: Icon, title, body }) => (
        <RevealItem key={title} y={32}>
          <div className="relative rounded-2xl border border-nsu-line bg-white p-6">
            <Crosshairs />
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-nsu-ice">
                <Icon className="h-5 w-5 text-nsu-blue" />
              </span>
              <h2 className="font-display text-lg font-semibold text-nsu-navy">
                {title}
              </h2>
            </div>
            <div className="mt-4">{body}</div>
          </div>
        </RevealItem>
      ))}
      <RevealItem y={32}>
        <div className="flex items-center gap-3 px-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-nsu-slate">
            Follow the lab
          </span>
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`NIRO Lab on ${label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-nsu-line text-nsu-slate transition-colors hover:border-nsu-blue hover:bg-nsu-ice hover:text-nsu-blue"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </RevealItem>
    </RevealGroup>
  );
}

/* ------------------------------------------------ section 2 (right col) */
const TOPICS = [
  "Collaboration",
  "Join the lab",
  "Project proposal",
  "Media & events",
  "Content submission",
] as const;

type FormStatus = "idle" | "sending" | "sent";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function OrbitSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      aria-hidden
    >
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle cx="21" cy="9.5" r="2" fill="currentColor" />
    </svg>
  );
}

function ContactForm() {
  const site = useSite();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (message.trim().length < 10)
      next.message = "Tell us a little more (at least 10 characters).";
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // honeypot filled → silently accept and drop (spam bot)
    if (honeypot) {
      setStatus("sent");
      return;
    }
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    // Static hosting: no backend - the form composes a prefilled mailto as
    // graceful degradation, then shows the success state.
    timerRef.current = window.setTimeout(() => {
      const subject = `[${topic}] Message from ${name.trim()}`;
      const body = [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Topic: ${topic}`,
        "",
        message.trim(),
      ].join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    }, 900);
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: PRECISION_EASE }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl bg-nsu-ice p-10 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-nsu-success/15">
          <Check className="h-8 w-8 text-nsu-success" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold text-nsu-navy">
          Message sent - we'll be in touch.
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-[1.7] text-nsu-slate">
          Your email client should have opened with a pre-filled message to{" "}
          <span className="font-mono text-[13px] text-nsu-blue">
            {site.email}
          </span>{" "}
          - just hit send there. (The site is statically hosted, so email is
          our transport.)
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setName("");
            setEmail("");
            setMessage("");
            setTopic(TOPICS[0]);
          }}
          className="mt-8 rounded-full border border-nsu-blue/40 px-6 py-2.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-white"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const fieldLabel =
    "mb-1.5 block text-sm font-semibold text-nsu-navy transition-colors";
  const fieldInput =
    "w-full rounded-lg border border-nsu-line bg-white px-4 py-3 text-[0.9375rem] text-nsu-text outline-none transition focus:border-nsu-sky focus:ring-2 focus:ring-nsu-sky/40 placeholder:text-nsu-slate/70";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl bg-nsu-ice p-7 sm:p-9"
      aria-label="Contact form"
    >
      <h2 className="font-display text-2xl font-semibold text-nsu-navy">
        Send us a message
      </h2>
      <p className="mt-2 text-sm leading-[1.6] text-nsu-slate">
        Fill this in and your email client will open with everything
        pre-addressed to the lab.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="group">
          <label htmlFor="contact-name" className={cn(fieldLabel, "group-focus-within:text-nsu-blue")}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={cn(fieldInput, errors.name && "border-nsu-error focus:ring-nsu-error/30")}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-nsu-error">{errors.name}</p>
          )}
        </div>
        <div className="group">
          <label htmlFor="contact-email" className={cn(fieldLabel, "group-focus-within:text-nsu-blue")}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={cn(fieldInput, errors.email && "border-nsu-error focus:ring-nsu-error/30")}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-nsu-error">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="group mt-5">
        <label htmlFor="contact-topic" className={cn(fieldLabel, "group-focus-within:text-nsu-blue")}>
          Topic
        </label>
        <div className="relative">
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
            className={cn(fieldInput, "appearance-none pr-10")}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nsu-blue"
          />
        </div>
      </div>

      <div className="group mt-5">
        <label htmlFor="contact-message" className={cn(fieldLabel, "group-focus-within:text-nsu-blue")}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your idea, project, or how you'd like to get involved…"
          aria-invalid={Boolean(errors.message)}
          className={cn(fieldInput, "resize-y", errors.message && "border-nsu-error focus:ring-nsu-error/30")}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-nsu-error">{errors.message}</p>
        )}
      </div>

      {/* honeypot - invisible to humans, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-white transition-transform active:scale-[0.97] disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              <OrbitSpinner />
              Opening your email client…
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
        <span className="text-xs leading-relaxed text-nsu-slate">
          Static site - messages are delivered via your own email client.
        </span>
      </div>
    </form>
  );
}

function ContactSplit() {
  return (
    <section className="bg-nsu-mist py-24 md:py-32" aria-label="Get in touch">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <InfoCards />
        </div>
        <Reveal className="lg:col-span-7" delay={0.15} y={32}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 3 */
function MapSection() {
  const site = useSite();
  const reduced = useReducedMotion();
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=North+South+University+Bashundhara+Dhaka";

  return (
    <section className="bg-nsu-mist pb-24 md:pb-32" aria-label="Map">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{
            clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(12% 6% 12% 6%)",
            opacity: 0,
          }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: PRECISION_EASE }}
          className="relative"
        >
          <Crosshairs />
          <div className="relative overflow-hidden rounded-3xl border border-nsu-line">
            <img
              src="/assets/placeholders/map.svg"
              alt="Map showing North South University, Bashundhara, Dhaka"
              className="aspect-[16/7] w-full object-cover"
              loading="lazy"
            />
            {/* glass overlay card */}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: PRECISION_EASE }}
              className="absolute bottom-4 left-4 max-w-sm rounded-xl border border-white/60 bg-white/80 p-5 backdrop-blur-md sm:bottom-6 sm:left-6"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-nsu-blue" />
                <div>
                  <p className="text-sm font-medium leading-[1.6] text-nsu-navy">
                    {site.address}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-nsu-blue hover:text-nsu-navy"
                  >
                    Get directions
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 4 */
function NodeWireBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 400"
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M80 320 L260 180 L430 260 L610 120 L790 220 L960 90 L1130 200 M260 180 L610 120 M430 260 L790 220"
        stroke="#3D8FE0"
        strokeWidth="1"
      />
      {[
        [80, 320],
        [260, 180],
        [430, 260],
        [610, 120],
        [790, 220],
        [960, 90],
        [1130, 200],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={i === 3 ? "#F2A900" : "#3D8FE0"} />
      ))}
    </svg>
  );
}

function Pathways() {
  const site = useSite();
  const pathways = [
    {
      icon: GraduationCap,
      title: "For Students",
      pitch:
        "Join NIRO as a student researcher - work on real robots, compete nationally, and learn the full innovation cycle hands-on.",
      cta: "See open paths",
      href: "/people",
      external: false,
    },
    {
      icon: Users,
      title: "For Industry & Government",
      pitch:
        "Partner with the lab on sponsored projects, applied R&D, and live demos of autonomous systems built in Dhaka.",
      cta: "Start a partnership",
      href: `mailto:${site.email}?subject=${encodeURIComponent("Industry / government partnership inquiry")}`,
      external: true,
    },
    {
      icon: BookOpen,
      title: "For Academia",
      pitch:
        "Collaborate on joint research, co-supervision, and publications across our eight research areas.",
      cta: "Propose a collaboration",
      href: `mailto:${site.email}?subject=${encodeURIComponent("Academic collaboration inquiry")}`,
      external: true,
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-nsu-navy py-24 md:py-32"
      aria-label="Collaboration pathways"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <NodeWireBackdrop />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-sky" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#7FB3EC]">
              {"// COLLABORATE"}
            </span>
          </div>
          <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Pathways into the lab
          </h2>
        </div>
        <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {pathways.map(({ icon: Icon, title, pitch, cta, href, external }) => (
            <RevealItem key={title} y={40}>
              <div className="group flex h-full flex-col rounded-2xl border border-nsu-line-dark bg-white/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-nsu-sky">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-nsu-line-dark bg-nsu-ink/60 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-6 w-6 text-nsu-sky" />
                </span>
                <h3 className="mt-6 font-display text-[1.375rem] font-semibold tracking-[-0.01em] text-white">
                  {title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-[1.7] text-slate-300">
                  {pitch}
                </p>
                {external ? (
                  <a
                    href={href}
                    className="group/btn mt-7 inline-flex items-center gap-2 self-start rounded-full border border-nsu-sky/60 px-6 py-2.5 text-[0.9375rem] font-semibold text-[#7FB3EC] transition-colors hover:bg-nsu-sky/10 hover:text-white"
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </a>
                ) : (
                  <Link
                    to={href}
                    className="group/btn mt-7 inline-flex items-center gap-2 self-start rounded-full border border-nsu-sky/60 px-6 py-2.5 text-[0.9375rem] font-semibold text-[#7FB3EC] transition-colors hover:bg-nsu-sky/10 hover:text-white"
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */
export default function Contact() {
  return (
    <>
      <Hero />
      <ContactSplit />
      <MapSection />
      <Pathways />
    </>
  );
}
