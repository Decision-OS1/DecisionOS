export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="h-8 w-64 rounded-xl bg-border" />
      <div className="h-4 w-48 rounded-xl bg-border" />
      <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
        <div className="card h-40" />
        <div className="card h-40" />
        <div className="card h-40" />
      </div>
      <div className="card h-64" />
    </div>
  );
}
