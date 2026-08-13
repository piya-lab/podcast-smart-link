import { getShow } from "@/lib/show";
import { prisma } from "@/lib/prisma";
import { EpisodeLandingCard } from "@/components/EpisodeLandingCard";

export const dynamic = "force-dynamic";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ episodeSlug: string }>;
}) {
  const { episodeSlug } = await params;
  const show = await getShow();

  const episode = show
    ? await prisma.episode.findUnique({
        where: { showId_slug: { showId: show.id, slug: episodeSlug } },
      })
    : null;

  if (!show || !episode) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-neutral-500">This link doesn&apos;t exist.</p>
      </div>
    );
  }

  await prisma.pageView.create({ data: { episodeId: episode.id } });

  return <EpisodeLandingCard episode={episode} show={show} />;
}
