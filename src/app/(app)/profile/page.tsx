import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, email, gender, age_group, years_investing, employed, sector")
    .eq("id", user.id)
    .maybeSingle();

  const fields = [
    { label: "Name", value: profile?.name ?? "—" },
    { label: "Email", value: profile?.email ?? user.email ?? "—" },
    { label: "Gender", value: profile?.gender ?? "—" },
    { label: "Age group", value: profile?.age_group ?? "—" },
    {
      label: "Years making financial decisions",
      value: profile?.years_investing?.toString() ?? "—",
    },
    {
      label: "Currently working",
      value:
        profile?.employed === null || profile?.employed === undefined
          ? "—"
          : profile.employed
            ? "Yes"
            : "No",
    },
    { label: "Sector", value: profile?.sector ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-2xl font-bold text-primary">
          {(profile?.name ?? "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">{profile?.name ?? "Participant"}</h1>
          <p className="text-sm text-text-muted">{profile?.email ?? user.email}</p>
        </div>
      </div>

      <div className="card mt-6 divide-y divide-border">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-text-muted">{field.label}</span>
            <span className="text-sm font-medium text-text">{field.value}</span>
          </div>
        ))}
      </div>

      <form action={logout} className="mt-6">
        <button
          type="submit"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text transition hover:border-danger hover:text-danger"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
