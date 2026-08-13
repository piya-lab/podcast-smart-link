import Link from "next/link";
import type { Episode, Show } from "@/generated/prisma/client";
import { getYouTubeVideoId } from "@/lib/youtube";
import { SocialIconRow } from "@/components/SocialIconRow";
import { AudioPlayer } from "@/components/AudioPlayer";

const PLATFORM_LOGOS = {
  spotify: "/icons/spotify.svg",
  apple: "/icons/apple-podcasts.svg",
} as const;

export function EpisodeLandingCard({ episode, show }: { episode: Episode; show: Show }) {
  const bgImage = episode.artworkUrl ?? show.logoUrl;
  const youtubeId = getYouTubeVideoId(episode.youtubeUrl);
  const socials = (show.socials ?? {}) as Record<string, string | undefined>;

  const platforms = [
    { key: "spotify", label: "Spotify", url: episode.spotifyUrl, logo: PLATFORM_LOGOS.spotify },
    { key: "apple", label: "Apple Podcasts", url: episode.appleUrl, logo: PLATFORM_LOGOS.apple },
  ].filter((p) => p.url);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: show.brandColor }}>
      {bgImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-3xl"
        />
      )}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          {bgImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bgImage} alt={episode.title} className="aspect-square w-full object-cover" />
          )}

          <div className="bg-neutral-900 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{show.name}</p>
            <h1 className="mt-1 text-lg font-bold leading-snug text-white">{episode.title}</h1>
          </div>

          {episode.audioUrl && <AudioPlayer audioUrl={episode.audioUrl} />}

          {episode.description && (
            <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600 line-clamp-3">
              {episode.description}
            </p>
          )}

          {platforms.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {platforms.map(({ key, label, logo }) => (
                <a
                  key={key}
                  href={`/api/go/${episode.id}/${key}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="" className="h-8 w-8 shrink-0" />
                    <span className="font-medium text-neutral-900">{label}</span>
                  </span>
                  <span className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-neutral-900">
                    Listen
                  </span>
                </a>
              ))}
            </div>
          )}

          {show.tagline && (
            <p className="border-t border-neutral-100 px-5 py-3 text-center text-xs font-bold leading-relaxed text-neutral-500">
              {show.tagline}
            </p>
          )}

          {youtubeId && (
            <div className="border-t border-neutral-100 p-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={episode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-5">
            <SocialIconRow socials={socials} />
          </div>
        </div>

        <Link
          href="/episodes"
          className="mt-4 inline-block text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
        >
          Browse all episodes
        </Link>
      </div>
    </div>
  );
}
