import { supabaseNoAuth } from "@/lib/supabase/no-auth";
import { cache } from "react";

const getInstruments = cache(async () => {
    const { data, error } = await supabaseNoAuth
        .from("instruments")
        .select("*");

    if (error) throw error;
    return data;
});

export default async function InstrumentsData() {
    const data = await getInstruments();

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}