import Link from "next/link";
import { signup } from "../actions";

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <>
      <h1 className="text-2xl font-bold text-text">Create your account</h1>
      <p className="mt-1 text-sm text-text-muted">
        Join the study and start understanding your decisions.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      {message === "check-email" && (
        <div className="mt-4 rounded-xl bg-success-soft px-4 py-3 text-sm text-success">
          Check your inbox to confirm your email, then log in.
        </div>
      )}

      <form action={signup} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Shivani Gupta"
          />
        </div>
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
            minLength={6}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Sign up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </>
  );
}
