export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-10 text-center">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto mb-3" />
        <div className="h-5 w-64 bg-muted rounded animate-pulse mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-5 w-full bg-muted rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
