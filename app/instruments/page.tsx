// app/instruments/page.tsx
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

// Server Action: Create
async function createInstrument(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const name = formData.get("name") as string;

    if (name) {
        const { error } = await supabase.from("instruments").insert({ name });
        if (error) throw error;
    }

    revalidatePath("/instruments"); // Refresh the list
}

// Server Action: Update
async function updateInstrument(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    if (id && name) {
        const { error } = await supabase.from("instruments").update({ name }).eq("id", id);
        if (error) throw error;
    }

    revalidatePath("/instruments");
}

// Server Action: Delete
async function deleteInstrument(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const id = formData.get("id") as string;

    if (id) {
        const { error } = await supabase.from("instruments").delete().eq("id", id);
        if (error) throw error;
    }

    revalidatePath("/instruments");
}

// Fetch data (server component)
async function InstrumentsList() {
    const supabase = await createClient();
    const { data: instruments } = await supabase.from("instruments").select("*");

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Instruments</h2>
            {instruments?.length === 0 ? (
                <p>No instruments yet.</p>
            ) : (
                <ul className="space-y-2">
                    {instruments?.map((inst) => (
                        <li key={inst.id} className="flex items-center gap-4 p-4 border rounded">
                            <span>{inst.name}</span>

                            {/* Inline Update Form */}
                            <form action={updateInstrument} className="flex gap-2">
                                <input type="hidden" name="id" value={inst.id} />
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={inst.name}
                                    className="border px-2"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                                    Update
                                </button>
                            </form>

                            {/* Delete Form */}
                            <form action={deleteInstrument}>
                                <input type="hidden" name="id" value={inst.id} />
                                <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded">
                                    Delete
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function InstrumentsPage() {
    return (
        <div className="p-8">
            {/* Create Form */}
            <form action={createInstrument} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Add New Instrument</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Instrument name"
                    required
                    className="border px-4 py-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Create
                </button>
            </form>

            <Suspense fallback={<div>Loading instruments...</div>}>
                <InstrumentsList />
            </Suspense>
        </div>
    );
}