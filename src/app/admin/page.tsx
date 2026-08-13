import Link from "next/link";
import { getShow } from "@/lib/show";
import { prisma } from "@/lib/prisma";
import { saveSettings, saveEpisodeLinks, logout } from "@/lib/actions";
import { SaveButton } from "./SaveButton";
import { SyncButton } from "./SyncButton";
import { EpisodeRow } from "./EpisodeRow";

const PAGE_SIZE = 20;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const show = await getShow();
  const socials = (show?.socials ?? {}) as Record<string, string | undefined>;

  let episodes: Awaited<ReturnType<typeof prisma.episode.findMany>> = [];
  let episodeCount = 0;

  if (show) {
    [episodes, episodeCount] = await Promise.all([
      prisma.episode.findMany({
        where: { showId: show.id },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.episode.count({ where: { showId: show.id } }),
    ]);
  }

  const totalPages = Math.max(1, Math.ceil(episodeCount / PAGE_SIZE));

  const episodeIds = episodes.map((e) => e.id);
  const [clickCounts, viewCounts] = episodeIds.length
    ? await Promise.all([
        prisma.clickEvent.groupBy({
          by: ["episodeId"],
          where: { episodeId: { in: episodeIds } },
          _count: { _all: true },
        }),
        prisma.pageView.groupBy({
          by: ["episodeId"],
          where: { episodeId: { in: episodeIds } },
          _count: { _all: true },
        }),
      ])
    : [[], []];
  const clicksByEpisode = new Map(clickCounts.map((c) => [c.episodeId, c._count._all]));
  const viewsByEpisode = new Map(viewCounts.map((v) => [v.episodeId, v._count._all]));

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">Admin</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/analytics" className="text-neutral-600 hover:text-neutral-900">
              Analytics
            </Link>
            <form action={logout}>
              <button type="submit" className="text-neutral-600 hover:text-neutral-900">
                Log out
              </button>
            </form>
          </div>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Show settings</h2>
          <form action={saveSettings} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Show name" name="name" defaultValue={show?.name} required />
              <Field label="Public page slug" name="slug" defaultValue={show?.slug} required />
            </div>
            <Field
              label="Podcast RSS feed URL"
              name="rssUrl"
              defaultValue={show?.rssUrl}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Logo URL" name="logoUrl" defaultValue={show?.logoUrl ?? undefined} />
              <Field
                label="Brand color"
                name="brandColor"
                type="color"
                defaultValue={show?.brandColor ?? "#111111"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Instagram URL" name="instagram" defaultValue={socials.instagram} />
              <Field label="TikTok URL" name="tiktok" defaultValue={socials.tiktok} />
              <Field label="X / Twitter URL" name="x" defaultValue={socials.x} />
              <Field label="Website URL" name="website" defaultValue={socials.website} />
            </div>
            <SaveButton>Save settings</SaveButton>
          </form>
        </section>

        {show && (
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">Episodes</h2>
              <SyncButton />
            </div>

            <div className="mt-4">
              {episodes.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No episodes yet — click &quot;Sync new episodes&quot; to pull from the RSS feed.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                        <th className="pb-2 pr-3 font-medium"></th>
                        <th className="pb-2 pr-3 font-medium">Episode</th>
                        <th className="pb-2 pr-3 font-medium">Link</th>
                        <th className="pb-2 pr-3 font-medium">Visits</th>
                        <th className="pb-2 pr-3 font-medium">CTR</th>
                        <th className="pb-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {episodes.map((episode) => (
                        <EpisodeRow
                          key={episode.id}
                          episode={episode}
                          visits={viewsByEpisode.get(episode.id) ?? 0}
                          clicks={clicksByEpisode.get(episode.id) ?? 0}
                          saveAction={saveEpisodeLinks.bind(null, episode.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
                <span>
                  Page {page} of {totalPages} ({episodeCount} episodes)
                </span>
                <div className="flex gap-3">
                  {page > 1 && (
                    <Link href={`/admin?page=${page - 1}`} className="underline">
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link href={`/admin?page=${page + 1}`} className="underline">
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
    </label>
  );
}
