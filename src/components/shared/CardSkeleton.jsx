export default function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border glass-card p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-3/5 rounded bg-muted" />
      </div>
      <div className="h-8 rounded-lg bg-muted" />
    </div>
  );
}