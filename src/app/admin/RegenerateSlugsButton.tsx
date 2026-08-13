"use client";

import { useState, useTransition } from "react";
import { regenerateEpisodeSlugs } from "@/lib/actions";

export function RegenerateSlugsButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const res = await regenerateEpisodeSlugs();
            if (res.error) {
              setMessage(`Error: ${res.error}`);
            } else if (res.count !== undefined) {
              setMessage(`Regenerated ${res.count} links.`);
            }
          });
        }}
        className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
      >
        {isPending ? "Regenerating…" : "Regenerate links"}
      </button>
      {message && <p className="mt-2 text-sm text-neutral-600">{message}</p>}
    </div>
  );
}
