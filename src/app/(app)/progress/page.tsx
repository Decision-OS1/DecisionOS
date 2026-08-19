import Link from "next/link";
import { Sparkles, TrendingUp, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toDateKey } from "@/lib/date";
import { StatCard } from "@/components/StatCard";
import { ScoreLineChart } from "@/components/charts/ScoreLineChart";
import { BiasDonutChart } from "@/components/charts/BiasDonutChart";

const CONFIDENCE_SCORE: Record<string, number> = {
  "Very confident": 100,
  "Somewhat confident": 66,
  "Not very confident": 33,
  "Not confident at all": 0,
};

const BIAS_COLORS: Record<string, string> = {
  "Present Bias": "#6C5DD3",
  "Loss Aversion": "#F59E0B",
  Overconfidence: "#22C55E",
  "Status Quo Bias": "#38BDF8",
  Others: "#CBD5E1",
};

function average(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: rows } = await supabase
    .from("survey_responses")
    .select("day_number, confidence_level, inferred_bias, intervention_type, created_at")
    .eq("user_id", user.id)
    .order("day_number", { ascending: true });

  const responses = rows ?? [];
  const decisionsMade = responses.length;
  const daysActive = new Set(responses.map((r) => toDateKey(r.created_at))).size;
  const scores = responses.map((r) => CONFIDENCE_SCORE[r.confidence_level] ?? 0);
  const scoreData = responses.map((r, i) => ({ day: r.day_number, score: scores[i] }));

  const last7Scores = scores.slice(-7);
  const prev7Scores = scores.slice(-14, -7);
  const recentAvg = average(last7Scores);
  const earlierAvg = average(prev7Scores);
  const avgScore = Math.round(average(scores));
  const weekDelta = prev7Scores.length > 0 ? Math.round(recentAvg - earlierAvg) : null;
  const trendLabel =
    weekDelta === null ? "Not enough data" : weekDelta > 0 ? "Improving" : weekDelta < 0 ? "Declining" : "Steady";

  const topStrength =
    avgScore >= 70 ? "Confident Decision-Making" : decisionsMade >= 15 ? "Consistency" : "Steady Progress";

  const biasBuckets: Record<string, number> = {
    "Present Bias": 0,
    "Loss Aversion": 0,
    Overconfidence: 0,
    "Status Quo Bias": 0,
    Others: 0,
  };
  let biasTotal = 0;
  for (const r of responses) {
    if (!r.inferred_bias) continue;
    biasTotal += 1;
    if (r.inferred_bias in biasBuckets) {
      biasBuckets[r.inferred_bias] += 1;
    } else {
      biasBuckets.Others += 1;
    }
  }
  const biasData = Object.entries(biasBuckets)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      value: biasTotal > 0 ? Math.round((count / biasTotal) * 100) : 0,
      color: BIAS_COLORS[name],
    }));

  const interventionAverages = new Map<string, number[]>();
  responses.forEach((r, i) => {
    if (!r.intervention_type) return;
    const list = interventionAverages.get(r.intervention_type) ?? [];
    list.push(scores[i]);
    interventionAverages.set(r.intervention_type, list);
  });
  let bestIntervention: string | null = null;
  let bestInterventionAvg = -1;
  for (const [type, list] of interventionAverages) {
    const avg = average(list);
    if (avg > bestInterventionAvg) {
      bestInterventionAvg = avg;
      bestIntervention = type;
    }
  }

  const insights: string[] = [];
  if (bestIntervention) {
    insights.push(`You perform better when you receive ${bestIntervention}.`);
  }
  if (weekDelta !== null) {
    insights.push(
      weekDelta >= 0
        ? `Your confidence is up ${weekDelta}% compared to last week.`
        : `Your confidence dipped ${Math.abs(weekDelta)}% compared to last week.`,
    );
  }
  if (insights.length === 0) {
    insights.push("Complete a few more decisions to unlock personalized insights.");
  }

  const { data: leaderboardRows } = await supabase
    .from("leaderboard")
    .select("user_id, name, points")
    .order("points", { ascending: false });

  const allRankings = leaderboardRows ?? [];
  const myRankIndex = allRankings.findIndex((r) => r.user_id === user.id);
  const topThree = allRankings.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-text">My Progress</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Consistency"
          value={daysActive}
          subtitle="Days active"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}/100`}
          subtitle={
            weekDelta !== null
              ? `${weekDelta >= 0 ? "↑" : "↓"} ${Math.abs(weekDelta)}% from last week`
              : "Not enough data yet"
          }
        />
        <StatCard
          title="Decisions Trend"
          value={trendLabel}
          subtitle="Based on recent scores"
          visual={<TrendingUp size={22} className="text-success" />}
        />
        <StatCard
          title="Top Strength"
          value={topStrength}
          subtitle="Keep leaning into it"
          visual={<Crown size={22} className="text-warning" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card p-6">
          <p className="text-sm font-bold text-text">Your Decisions Over Time</p>
          <p className="text-xs text-text-muted">
            Higher scores indicate better long-term outcomes
          </p>
          {scoreData.length > 0 ? (
            <ScoreLineChart data={scoreData} />
          ) : (
            <p className="mt-8 text-center text-sm text-text-muted">
              Complete your first decision to see your trend line.
            </p>
          )}
        </div>

        <div className="card p-6">
          <p className="text-sm font-bold text-text">Bias Distribution</p>
          <p className="text-xs text-text-muted">This month</p>
          {biasData.length > 0 ? (
            <div className="mt-4">
              <BiasDonutChart data={biasData} />
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-text-muted">
              No bias data yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-bold text-text">Recent Insights</p>
          <ul className="mt-3 space-y-3">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-text">Leaderboard</p>
            <Link href="/leaderboard" className="text-xs font-semibold text-primary">
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {topThree.map((row, i) => (
              <li
                key={row.user_id}
                className="flex items-center justify-between rounded-xl px-2 py-1.5"
              >
                <span className="flex items-center gap-2 text-sm text-text">
                  <span className="text-text-muted">{i + 1}</span>
                  {row.name ?? "Anonymous"}
                  {row.user_id === user.id && (
                    <span className="text-xs text-text-muted">(You)</span>
                  )}
                  {i === 0 && <span aria-hidden>🏆</span>}
                </span>
                <span className="text-sm font-semibold text-text">{row.points} pts</span>
              </li>
            ))}
          </ul>
          {myRankIndex >= 3 && (
            <p className="mt-3 border-t border-border pt-3 text-xs text-text-muted">
              You&apos;re ranked #{myRankIndex + 1}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
