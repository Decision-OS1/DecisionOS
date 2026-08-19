import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConfidenceLevel } from "@/lib/types/database";
import { pointsFromDecisions } from "@/lib/gamification";

export const PROGRAM_LENGTH_DAYS = 30;

const CONFIDENCE_SCORE: Record<ConfidenceLevel, number> = {
  "Very confident": 100,
  "Somewhat confident": 66,
  "Not very confident": 33,
  "Not confident at all": 0,
};

export interface DashboardStats {
  decisionsMade: number;
  currentDay: number;
  avgConfidencePercent: number | null;
  mostCommonBias: string | null;
  totalPoints: number;
  completionRatePercent: number;
}

export async function getDashboardStats(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
): Promise<DashboardStats> {
  const { data: responses } = await supabase
    .from("survey_responses")
    .select("confidence_level, inferred_bias")
    .eq("user_id", userId);

  const rows = responses ?? [];
  const decisionsMade = rows.length;
  const currentDay = Math.min(decisionsMade + 1, PROGRAM_LENGTH_DAYS);

  const confidenceScores = rows
    .map((r) => CONFIDENCE_SCORE[r.confidence_level as ConfidenceLevel])
    .filter((score): score is number => typeof score === "number");
  const avgConfidencePercent =
    confidenceScores.length > 0
      ? Math.round(
          confidenceScores.reduce((sum, s) => sum + s, 0) / confidenceScores.length,
        )
      : null;

  const biasCounts = new Map<string, number>();
  for (const row of rows) {
    if (!row.inferred_bias) continue;
    biasCounts.set(row.inferred_bias, (biasCounts.get(row.inferred_bias) ?? 0) + 1);
  }
  let mostCommonBias: string | null = null;
  let topCount = 0;
  for (const [bias, count] of biasCounts) {
    if (count > topCount) {
      mostCommonBias = bias;
      topCount = count;
    }
  }

  return {
    decisionsMade,
    currentDay,
    avgConfidencePercent,
    mostCommonBias,
    totalPoints: pointsFromDecisions(decisionsMade),
    completionRatePercent: Math.round((decisionsMade / PROGRAM_LENGTH_DAYS) * 100),
  };
}
