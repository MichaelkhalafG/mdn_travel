// Light skeleton for the (force-dynamic) admin views — the shell topbar
// renders from the layout, this fills the content area while queries run.
export default function AdminLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-7 w-40 rounded-brand bg-border-light/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-brand border border-border-light bg-canvas-light" />
        ))}
      </div>
      <div className="h-[420px] rounded-brand border border-border-light bg-canvas-light" />
    </div>
  );
}
