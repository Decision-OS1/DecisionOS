import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface CurrentUser {
  id: string;
  email?: string;
  user_metadata?: { name?: string };
}

// The proxy already validates the session with Supabase on every request, so
// here we only verify the JWT (locally for asymmetric keys) instead of another
// auth round-trip. cache() dedupes the layout + page calls within one render.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return {
    id: claims.sub,
    email: claims.email,
    user_metadata: claims.user_metadata as CurrentUser["user_metadata"],
  };
});
