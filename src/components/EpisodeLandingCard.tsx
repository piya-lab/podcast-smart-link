import type { Episode, Show } from "@/generated/prisma/client";
import { getYouTubeVideoId } from "@/lib/youtube";
import {
  SpotifyIcon,
  ApplePodcastsIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
  WebsiteIcon,
} from "@/components/icons";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TikTokIcon,
  website: WebsiteIcon,
} as const;

export function EpisodeLandingCard({ episode, show }: { episode: Episode; show: Show }) {
  const bgImage = episode.artworkUrl ?? show.logoUrl;
  const youtubeId = getYouTubeVideoId(episode.youtubeUrl);
  const socials = (show.socials ?? {}) as Record<string, string | undefined>;

  const platforms = [
    { key: "spotify", label: "Spotify", url: episode.spotifyUrl, Icon: SpotifyIcon },
    { key: "apple", label: "Apple Podcasts", url: episode.appleUrl, Icon: ApplePodcastsIcon },
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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          {bgImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bgImage} alt={episode.title} className="aspect-square w-full object-cover" />
          )}

          <div className="bg-neutral-900 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{show.name}</p>
            <h1 className="mt-1 text-lg font-bold leading-snug text-white">{episode.title}</h1>
          </div>

          {platforms.length > 0 && (
            <div className="divide-y divide-neutral-100">
              {platforms.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={`/api/go/${episode.id}/${key}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-8 w-8 shrink-0" />
                    <span className="font-medium text-neutral-900">{label}</span>
                  </span>
                  <span className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-neutral-900">
                    Listen
                  </span>
                </a>
              ))}
            </div>
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

          {episode.description && (
            <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600 line-clamp-3">
              {episode.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-5 border-t border-neutral-100 bg-neutral-50 px-5 py-4">
            {(Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
              .filter((key) => socials[key])
              .map((key) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={key}
                    href={socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
