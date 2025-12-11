// lib/supabase/instrument-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createInstrument(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;

    if (!name) return { error: "Name is required" };

    const { error } = await supabase.from("instruments").insert({ name });
    if (error) throw error;

    revalidatePath("/instruments");
}

export async function updateInstrument(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    if (!id || !name) return { error: "Invalid data" };

    const { error } = await supabase
        .from("instruments")
        .update({ name })
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/instruments");
}

export async function deleteInstrument(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    if (!id) return { error: "ID is required" };

    const { error } = await supabase.from("instruments").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/instruments");
}