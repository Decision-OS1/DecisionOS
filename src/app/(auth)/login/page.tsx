import Link from "next/link";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <>
      <h1 className="text-2xl font-bold text-text">Welcome back</h1>
      <p className="mt-1 text-sm text-text-muted">
        Log in to continue your journey.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form action={login} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary">
          Sign up
        </Link>
      </p>
    </>
  );
}
