import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PROGRAM_LENGTH_DAYS } from "@/lib/stats";
import { FeedbackView } from "@/components/decision/FeedbackView";

export default async function FeedbackPage({
  searchParams,
}: PageProps<"/decision/feedback">) {
  const params = await searchParams;
  const dayNumber = Number(params.day ?? 0);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: response } = await supabase
    .from("survey_responses")
    .select("selected_response, ai_feedback, inferred_bias")
    .eq("user_id", user.id)
    .eq("day_number", dayNumber)
    .maybeSingle();

  if (!response) {
    notFound();
  }

  const { count } = await supabase
    .from("survey_responses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const maxCompletedDay = count ?? dayNumber;

  return (
    <FeedbackView
      dayNumber={dayNumber}
      maxCompletedDay={maxCompletedDay}
      isProgramComplete={maxCompletedDay >= PROGRAM_LENGTH_DAYS}
      selectedResponse={response.selected_response}
      aiFeedback={response.ai_feedback ?? ""}
      inferredBias={response.inferred_bias}
    />
  );
}
