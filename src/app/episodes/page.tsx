import Link from "next/link";
import { getShow } from "@/lib/show";
import { prisma } from "@/lib/prisma";
import { PlatformButtons } from "@/components/PlatformButtons";

const PAGE_SIZE = 20;

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const show = await getShow();

  if (!show) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-neutral-500">This page isn&apos;t set up yet.</p>
      </div>
    );
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [episodes, episodeCount] = await Promise.all([
    prisma.episode.findMany({
      where: { showId: show.id },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.episode.count({ where: { showId: show.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(episodeCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
        >
          &larr; {show.name}
        </Link>
        <h1 className="mt-4 text-xl font-bold text-neutral-900">All episodes</h1>

        <div className="mt-6 space-y-4">
          {episodes.length === 0 && <p className="text-sm text-neutral-500">No episodes yet.</p>}
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm"
            >
              <p className="text-xs text-neutral-400">{episode.publishedAt.toDateString()}</p>
              <p className="mt-1 font-semibold text-neutral-900">{episode.title}</p>
              {episode.description && (
                <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{episode.description}</p>
              )}
              <div className="mt-3">
                <PlatformButtons episode={episode} color={show.brandColor} />
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-3">
              {page > 1 && (
                <Link href={`/episodes?page=${page - 1}`} className="underline">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/episodes?page=${page + 1}`} className="underline">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
