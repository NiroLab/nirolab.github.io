import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-40 text-center md:px-8">
      <div className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
        {"// ERROR 404"}
      </div>
      <h1 className="font-display text-5xl font-bold text-nsu-navy">
        Signal lost.
      </h1>
      <p className="mt-4 max-w-md text-nsu-slate">
        The page you're looking for isn't on this orbit. Let's get you back to
        base.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-nsu-navy px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-nsu-blue"
      >
        Back to home
      </Link>
    </div>
  );
}
