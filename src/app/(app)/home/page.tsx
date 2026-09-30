import Link from "next/link";
import { Bell, PiggyBank, TrendingUp, Home as HomeIcon, GraduationCap, Users, Brain, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { getDashboardStats, PROGRAM_LENGTH_DAYS } from "@/lib/stats";
import { getLevelInfo } from "@/lib/gamification";
import { RobotMascot } from "@/components/RobotMascot";
import { StatCard } from "@/components/StatCard";
import { Sparkline } from "@/components/Sparkline";
import { DonutRing } from "@/components/DonutRing";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const supabase = await createClient();
  const user = (await getCurrentUser())!;

  const [{ data: profile }, stats, { data: recentResponses }] = await Promise.all([
    supabase.from("user_profiles").select("name").eq("id", user.id).maybeSingle(),
    getDashboardStats(supabase, user.id),
    supabase
      .from("survey_responses")
      .select("day_number, confidence_level")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })
      .limit(30),
  ]);

  const firstName = (profile?.name ?? user.user_metadata?.name ?? "there").split(
    " ",
  )[0];

  const level = getLevelInfo(stats.totalPoints);

  const rows = recentResponses ?? [];
  const last7 = rows.slice(-7);
  const decisionsTrend = last7.map((_, i) => i + 1);
  const confidenceScoreMap: Record<string, number> = {
    "Very confident": 100,
    "Somewhat confident": 66,
    "Not very confident": 33,
    "Not confident at all": 0,
  };
  const confidenceTrend = last7.map(
    (r) => confidenceScoreMap[r.confidence_level] ?? 0,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {greeting(new Date().getHours())}, {firstName}! 👋
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Ready to make today&apos;s decision?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="card flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20 text-warning">
              <Star size={16} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text">
                Level {level.level}
              </p>
              <p className="text-[11px] text-text-muted">{level.label}</p>
            </div>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${level.progressPercent}%` }}
              />
            </div>
          </div>
          <button className="card flex h-10 w-10 items-center justify-center text-text-muted">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card relative overflow-hidden p-8">
          <div className="relative z-10 max-w-sm">
            <h2 className="text-xl font-bold text-text">
              Scenario {stats.currentDay} of your journey
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Consistency helps us understand patterns better.
            </p>
            <Link
              href="/decision"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Start Today&apos;s Decision
              <span aria-hidden>→</span>
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/50">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(stats.currentDay / PROGRAM_LENGTH_DAYS) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-text-muted">
                {stats.currentDay} / {PROGRAM_LENGTH_DAYS} scenarios
              </span>
            </div>
          </div>

          <div
            className="absolute inset-y-0 right-0 w-2/5"
            style={{
              background:
                "linear-gradient(160deg, #6C5DD3 0%, #A66BD9 45%, #F0A75E 100%)",
            }}
          >
            <div className="absolute right-10 top-6 h-14 w-14 rounded-full bg-white/30 blur-sm" />
            <PiggyBank className="absolute left-6 top-10 text-white/90" size={22} />
            <TrendingUp className="absolute left-2 top-1/2 text-white/90" size={22} />
            <HomeIcon className="absolute left-10 bottom-16 text-white/90" size={22} />
            <GraduationCap className="absolute left-4 bottom-6 text-white/90" size={22} />
          </div>
        </div>

        <div className="card relative overflow-hidden p-6">
          <RobotMascot size={72} className="absolute -right-2 -top-2" />
          <h3 className="text-base font-bold text-text">Your Impact</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Your participation helps researchers build better interventions to
            improve financial decision-making for thousands of young adults.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Users size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          title="Decisions Made"
          value={stats.decisionsMade}
          subtitle="Scenarios completed"
          visual={
            decisionsTrend.length > 1 ? (
              <Sparkline data={decisionsTrend} />
            ) : undefined
          }
        />
        <StatCard
          title="Average Confidence"
          value={
            stats.avgConfidencePercent !== null
              ? `${stats.avgConfidencePercent}%`
              : "—"
          }
          subtitle="Across all decisions"
          visual={
            confidenceTrend.length > 1 ? (
              <Sparkline data={confidenceTrend} color="#38BDF8" />
            ) : undefined
          }
        />
        <StatCard
          title="Most Common Bias"
          value={stats.mostCommonBias ?? "—"}
          subtitle={
            stats.mostCommonBias
              ? "You tend to favor immediate rewards."
              : "Complete decisions to find out."
          }
          visual={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger">
              <Brain size={20} />
            </div>
          }
        />
        <StatCard
          title="Total Points"
          value={stats.totalPoints}
          subtitle="Keep it up!"
          visual={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 text-warning">
              <Star size={20} fill="currentColor" />
            </div>
          }
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRatePercent}%`}
          subtitle="You're on track!"
          visual={<DonutRing percent={stats.completionRatePercent} />}
        />
      </div>
    </div>
  );
}
