import { useParams } from "react-router";

/** Temporary placeholder page - later page agents replace these stubs. */
export default function Stub({ name }: { name: string }) {
  const params = useParams();
  return (
    <div className="mx-auto max-w-7xl px-5 py-32 md:px-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-nsu-blue" />
        <span className="type-eyebrow text-nsu-blue">
          {"// COMING SOON"}
        </span>
      </div>
      <h1 className="type-display text-nsu-navy">{name}</h1>
      {params.slug && (
        <p className="mt-3 type-small text-nsu-slate">slug: {params.slug}</p>
      )}
      <p className="mt-4 max-w-xl text-nsu-slate">
        This page is under construction. It will be powered entirely by the
        file-based CMS in <code className="rounded bg-nsu-ice px-1.5 py-0.5 type-small text-nsu-navy">/content</code>.
      </p>
    </div>
  );
}
