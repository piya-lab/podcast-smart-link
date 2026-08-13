import Link from "next/link";
import { getShow } from "@/lib/show";
import { prisma } from "@/lib/prisma";
import { PlatformButtons } from "@/components/PlatformButtons";
import { SocialLinks } from "@/components/SocialLinks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const show = await getShow();

  if (!show) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-neutral-500">
          This page isn&apos;t set up yet.{" "}
          <Link href="/admin" className="underline">
            Go to admin
          </Link>
          .
        </p>
      </div>
    );
  }

  const latest = await prisma.episode.findFirst({
    where: { showId: show.id },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        {show.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={show.logoUrl}
            alt={show.name}
            className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-sm"
          />
        )}
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{show.name}</h1>

        {latest ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Latest episode
            </p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">{latest.title}</p>
            {latest.description && (
              <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{latest.description}</p>
            )}
            <div className="mt-4">
              <PlatformButtons episode={latest} color={show.brandColor} />
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-neutral-500">No episodes yet — check back soon.</p>
        )}

        <Link
          href="/episodes"
          className="mt-6 inline-block text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
        >
          Browse all episodes
        </Link>

        <div className="mt-8">
          <SocialLinks socials={show.socials as Record<string, string | undefined>} />
        </div>
      </div>
    </div>
  );
}
