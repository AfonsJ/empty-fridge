'use client';
import { useRouter } from "next/navigation";

export default function Error() {
    const router = useRouter();

    return (
        <main className="flex justify-center p-24 grid">
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold p-4 m-5 justify-center">Error</h1>
            </div>

            <div className="flex justify-center">
                <p className="text-3xl font-bold p-4 m-5 justify-center">Error getting the recipe :(</p>
            </div>
            <div className="flex justify-center">
                <button className="rounded bg-100 bg-blue-500 p-2 text-black hover:bg-blue-700 w-1/3" onClick={() => router.back()}>Go Back</button>
            </div>
        </main>

    )
}

