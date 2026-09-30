import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

export default async function HistoryPage() {
  const supabase = await createClient();
  const user = (await getCurrentUser())!;

  const { data: rows } = await supabase
    .from("survey_responses")
    .select("day_number, selected_response, confidence_level, inferred_bias, created_at")
    .eq("user_id", user.id)
    .order("day_number", { ascending: false });

  const responses = rows ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text">History</h1>
      <p className="mt-1 text-sm text-text-muted">
        Every decision you&apos;ve made so far.
      </p>

      {responses.length === 0 ? (
        <p className="card mt-6 p-6 text-sm text-text-muted">
          You haven&apos;t made any decisions yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {responses.map((row) => (
            <Link
              key={row.day_number}
              href={`/decision/feedback?day=${row.day_number}`}
              className="card flex items-center justify-between p-5 transition hover:border-primary/30"
            >
              <div>
                <p className="text-sm font-semibold text-text">
                  Scenario {row.day_number} — {row.selected_response}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Confidence: {row.confidence_level}
                  {row.inferred_bias && ` · ${row.inferred_bias}`}
                </p>
              </div>
              <span className="text-xs text-text-muted">
                {new Date(row.created_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
