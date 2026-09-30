import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const user = (await getCurrentUser())!;

  const { data: rows } = await supabase
    .from("leaderboard")
    .select("user_id, name, decisions_made, points")
    .order("points", { ascending: false });

  const rankings = rows ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-text">Leaderboard</h1>
      <p className="mt-1 text-sm text-text-muted">
        Ranked by total points across all participants.
      </p>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold text-text-muted">
              <th className="px-5 py-3">Rank</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Decisions</th>
              <th className="px-5 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((row, i) => (
              <tr
                key={row.user_id}
                className={`border-b border-border last:border-0 ${
                  row.user_id === user.id ? "bg-primary-soft" : ""
                }`}
              >
                <td className="px-5 py-3 font-semibold text-text">
                  {i === 0 ? "🏆" : `#${i + 1}`}
                </td>
                <td className="px-5 py-3 text-text">
                  {row.name ?? "Anonymous"}
                  {row.user_id === user.id && (
                    <span className="ml-1.5 text-xs text-text-muted">(You)</span>
                  )}
                </td>
                <td className="px-5 py-3 text-text-muted">{row.decisions_made}</td>
                <td className="px-5 py-3 text-right font-semibold text-text">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
