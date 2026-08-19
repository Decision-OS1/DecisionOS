import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, PROGRAM_LENGTH_DAYS } from "@/lib/stats";
import { getScenarioForDay } from "@/lib/scenarios";
import { DecisionForm } from "@/components/decision/DecisionForm";

export default async function DecisionPage({
  searchParams,
}: PageProps<"/decision">) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, age_group")
    .eq("id", user.id)
    .maybeSingle();

  const stats = await getDashboardStats(supabase, user.id);
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  if (stats.decisionsMade >= PROGRAM_LENGTH_DAYS) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-2xl font-bold text-text">
          You&apos;ve completed all 30 scenarios! 🎉
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Thank you for participating. Check My Progress for your full summary.
        </p>
        <Link
          href="/progress"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          View My Progress
        </Link>
      </div>
    );
  }

  const scenario = getScenarioForDay(stats.currentDay, profile?.age_group);
  const userName = profile?.name ?? user.user_metadata?.name ?? "Participant";

  return (
    <div>
      {error && (
        <div className="mx-auto mb-6 max-w-5xl rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      <DecisionForm
        scenario={scenario}
        dayNumber={stats.currentDay}
        totalDays={PROGRAM_LENGTH_DAYS}
        userName={userName}
      />
    </div>
  );
}
