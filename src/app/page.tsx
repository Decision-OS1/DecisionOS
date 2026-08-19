import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function RootPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: survey } = await supabase
    .from("profile_survey")
    .select("id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  redirect(survey ? "/home" : "/onboarding");
}
