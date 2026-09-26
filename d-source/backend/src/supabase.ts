import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Service-role client: bypasses RLS. This API is the only thing that ever
// talks to Postgres directly — the storefront and admin apps only ever
// talk to this API, never to Supabase, so RLS policies aren't needed on
// the tables (see the schema migration notes).
export const db = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

// A second client scoped to a specific end-user's access token, used only
// to verify who they are (supabase auth users table), never for data access.
export function authClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
