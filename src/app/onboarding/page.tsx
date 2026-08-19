import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage({
  searchParams,
}: PageProps<"/onboarding">) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  const { data: survey } = await supabase
    .from("profile_survey")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (survey) {
    redirect("/home");
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="min-h-screen bg-bg px-4">
      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      <OnboardingWizard />
    </div>
  );
}
