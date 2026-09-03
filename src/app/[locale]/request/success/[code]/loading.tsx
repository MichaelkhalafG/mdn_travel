// Branded skeleton while the (dynamic) success page verifies the code —
// navigation paints instantly instead of stalling on the DB.
export default function SuccessLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-navy-deep">
      <div className="h-14 border-b border-border-on-dark bg-navy-deep md:h-[72px]" />
      <div className="flex flex-1 items-center justify-center bg-linear-to-b from-navy-deep to-navy px-5">
        <div className="flex w-full max-w-[560px] animate-pulse flex-col items-center gap-6">
          <div className="size-12 rounded-brand bg-fg-on-dark/8 md:size-14" />
          <div className="h-9 w-3/4 rounded-brand bg-fg-on-dark/8 md:h-12" />
          <div className="h-4 w-full rounded-brand bg-fg-on-dark/6" />
          <div className="h-4 w-2/3 rounded-brand bg-fg-on-dark/6" />
          <div className="mt-2 h-16 w-64 rounded-brand bg-fg-on-dark/10" />
        </div>
      </div>
    </div>
  );
}
