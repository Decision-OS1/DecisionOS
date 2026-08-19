import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RobotMascot } from "@/components/RobotMascot";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: rows } = await supabase
    .from("survey_responses")
    .select("day_number, ai_feedback, inferred_bias")
    .eq("user_id", user.id)
    .order("day_number", { ascending: false })
    .limit(10);

  const responses = rows ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-4">
        <RobotMascot size={64} />
        <div>
          <h1 className="text-2xl font-bold text-text">AI Coach</h1>
          <p className="mt-1 text-sm text-text-muted">
            A running log of feedback from your recent decisions.
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <p className="card mt-6 p-6 text-sm text-text-muted">
          Complete your first decision to meet your coach.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {responses.map((row) => (
            <Link
              key={row.day_number}
              href={`/decision/feedback?day=${row.day_number}`}
              className="card block p-5 transition hover:border-primary/30"
            >
              <p className="text-xs font-semibold text-text-muted">
                Scenario {row.day_number}
                {row.inferred_bias && ` · ${row.inferred_bias}`}
              </p>
              <p className="mt-1 text-sm text-text">{row.ai_feedback}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
