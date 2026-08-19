import { createClient } from "@/lib/supabase/server";

const CONFIDENCE_SCORE: Record<string, number> = {
  "Very confident": 100,
  "Somewhat confident": 66,
  "Not very confident": 33,
  "Not confident at all": 0,
};

function average(nums: number[]) {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const [{ data: responses }, { data: survey }] = await Promise.all([
    supabase
      .from("survey_responses")
      .select("intervention_type, confidence_level, inferred_bias")
      .eq("user_id", user.id),
    supabase
      .from("profile_survey")
      .select("trust_sources")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const rows = responses ?? [];

  const byIntervention = new Map<string, number[]>();
  for (const r of rows) {
    if (!r.intervention_type) continue;
    const score = CONFIDENCE_SCORE[r.confidence_level] ?? 0;
    const list = byIntervention.get(r.intervention_type) ?? [];
    list.push(score);
    byIntervention.set(r.intervention_type, list);
  }

  const biasCounts = new Map<string, number>();
  for (const r of rows) {
    if (!r.inferred_bias) continue;
    biasCounts.set(r.inferred_bias, (biasCounts.get(r.inferred_bias) ?? 0) + 1);
  }
  const sortedBiases = [...biasCounts.entries()].sort((a, b) => b[1] - a[1]);

  const aiTrust = survey?.trust_sources?.ai as number | undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text">Insights</h1>
      <p className="mt-1 text-sm text-text-muted">
        Personalized patterns from your decisions so far.
      </p>

      <div className="mt-6 space-y-4">
        <div className="card p-6">
          <p className="text-sm font-bold text-text">Confidence by intervention type</p>
          {byIntervention.size === 0 ? (
            <p className="mt-2 text-sm text-text-muted">Not enough data yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {[...byIntervention.entries()].map(([type, scores]) => (
                <li key={type} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{type}</span>
                  <span className="font-semibold text-text">{average(scores)}/100</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <p className="text-sm font-bold text-text">Your bias patterns</p>
          {sortedBiases.length === 0 ? (
            <p className="mt-2 text-sm text-text-muted">Not enough data yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sortedBiases.map(([bias, count]) => (
                <li key={bias} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{bias}</span>
                  <span className="font-semibold text-text">{count}x</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <p className="text-sm font-bold text-text">AI reliance</p>
          <p className="mt-2 text-sm text-text-muted">
            {typeof aiTrust === "number"
              ? `You rated your trust in AI for financial decisions ${aiTrust}/5 during onboarding.`
              : "Complete onboarding to see this insight."}
          </p>
        </div>
      </div>
    </div>
  );
}
