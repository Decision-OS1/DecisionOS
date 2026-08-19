export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-text">DecisionOS</p>
          <p className="text-xs leading-tight text-text-muted">
            Understand Decisions. Improve Lives.
          </p>
        </div>
      </div>
      <div className="card w-full max-w-md p-8">{children}</div>
    </div>
  );
}
