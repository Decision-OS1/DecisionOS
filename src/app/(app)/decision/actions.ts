"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SCENARIOS, generateAiFeedback } from "@/lib/scenarios";
import type { ConfidenceLevel } from "@/lib/types/database";

interface SubmitDecisionInput {
  dayNumber: number;
  scenarioId: string;
  interventionType: string;
  selectedOptionId: string;
  confidenceLevel: ConfidenceLevel;
  latencyMs: number;
}

export async function submitDecision(input: SubmitDecisionInput) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    redirect("/login");
  }

  const scenario = SCENARIOS.find((s) => s.id === input.scenarioId);
  if (!scenario) {
    redirect("/decision");
  }

  const option = scenario.options.find((o) => o.id === input.selectedOptionId);
  const { bias, feedback } = generateAiFeedback(scenario, input.selectedOptionId);

  const { error } = await supabase.from("survey_responses").insert({
    user_id: user.id,
    day_number: input.dayNumber,
    scenario_id: input.scenarioId,
    scenario_prompt: scenario.prompt,
    scenario_question: scenario.question,
    intervention_type: input.interventionType,
    selected_response: option?.label ?? input.selectedOptionId,
    confidence_level: input.confidenceLevel,
    response_latency_ms: input.latencyMs,
    inferred_bias: bias,
    ai_feedback: feedback,
  });

  if (error) {
    redirect(`/decision?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/decision/feedback?day=${input.dayNumber}`);
}
