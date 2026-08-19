"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OnboardingData } from "@/lib/types/onboarding";
import type { Sector } from "@/lib/types/database";

export async function submitOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("user_profiles")
    .update({
      gender: data.gender || null,
      age_group: data.ageGroup || null,
      years_investing: data.yearsInvesting ? Number(data.yearsInvesting) : null,
      employed: data.employed ? data.employed === "yes" : null,
      sector: (data.sector || null) as Sector | null,
    })
    .eq("id", user.id);

  const { error } = await supabase.from("profile_survey").insert({
    user_id: user.id,
    portfolio_choices: data.portfolioChoices,
    trust_sources: {
      government: data.trustGovernment,
      social_media: data.trustSocialMedia,
      family: data.trustFamily,
      ai: data.trustAI,
    },
    challenges: [
      ...data.challenges,
      ...(data.challengesOther ? [`Other: ${data.challengesOther}`] : []),
    ],
    challenges_opinion: data.challengesOpinion || null,
    age_branch_answers: data.ageBranch,
  });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}
