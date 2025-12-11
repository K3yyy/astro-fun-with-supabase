// /lib/supabase/no-auth.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseNoAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
