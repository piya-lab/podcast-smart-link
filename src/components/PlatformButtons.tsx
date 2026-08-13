import type { Episode } from "@/generated/prisma/client";

const PLATFORMS: { key: "spotify" | "apple" | "youtube"; label: string; field: keyof Episode }[] = [
  { key: "spotify", label: "Spotify", field: "spotifyUrl" },
  { key: "apple", label: "Apple Podcasts", field: "appleUrl" },
  { key: "youtube", label: "YouTube", field: "youtubeUrl" },
];

export function PlatformButtons({ episode, color }: { episode: Episode; color: string }) {
  const available = PLATFORMS.filter((p) => episode[p.field]);

  if (available.length === 0) {
    return <p className="text-sm text-neutral-400">Links coming soon.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {available.map((p) => (
        <a
          key={p.key}
          href={`/api/go/${episode.id}/${p.key}`}
          className="block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          Listen on {p.label}
        </a>
      ))}
    </div>
  );
}
