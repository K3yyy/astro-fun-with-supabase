
import { Suspense } from "react";
import InstrumentsData from "@/components/component/InstrumentsData";

export default function InstrumentsPage() {
    return (
        <>
            <h1>Instruments</h1>
            <Suspense fallback={<div>Loading instruments...</div>}>
                <InstrumentsData />
            </Suspense>
        </>
    );
}

// Remove this line entirely when cacheComponents is enabled
// export const dynamic = "force-static";