import Link from "next/link";
import { getShow } from "@/lib/show";
import { prisma } from "@/lib/prisma";
import { ClicksChart } from "./ClicksChart";

export const dynamic = "force-dynamic";

const DAYS = 30;

export default async function AnalyticsPage() {
  const show = await getShow();

  if (!show) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-neutral-500">
          Set up your show first. <Link href="/admin" className="underline">Go to admin</Link>.
        </p>
      </div>
    );
  }

  const episodes = await prisma.episode.findMany({
    where: { showId: show.id },
    orderBy: { publishedAt: "desc" },
  });

  const totals = await prisma.clickEvent.groupBy({
    by: ["episodeId", "platform"],
    where: { episode: { showId: show.id } },
    _count: { _all: true },
  });

  const totalsByEpisode = new Map<string, Record<string, number>>();
  for (const row of totals) {
    const current = totalsByEpisode.get(row.episodeId) ?? {};
    current[row.platform] = row._count._all;
    totalsByEpisode.set(row.episodeId, current);
  }

  const since = new Date();
  since.setDate(since.getDate() - DAYS);

  const recentClicks = await prisma.clickEvent.findMany({
    where: { episode: { showId: show.id }, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const dailyCounts = new Map<string, number>();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyCounts.set(d.toISOString().slice(0, 10), 0);
  }
  for (const click of recentClicks) {
    const key = click.createdAt.toISOString().slice(0, 10);
    if (dailyCounts.has(key)) {
      dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
    }
  }
  const chartData = Array.from(dailyCounts.entries()).map(([date, clicks]) => ({
    date: date.slice(5),
    clicks,
  }));

  const grandTotal = totals.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">Analytics</h1>
          <Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900">
            &larr; Back to admin
          </Link>
        </div>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">
            Clicks in the last {DAYS} days ({grandTotal} total all time)
          </h2>
          <div className="mt-4">
            <ClicksChart data={chartData} />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-900">Clicks by episode</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 pr-4 font-medium">Episode</th>
                  <th className="pb-2 pr-4 font-medium">Spotify</th>
                  <th className="pb-2 pr-4 font-medium">Apple</th>
                  <th className="pb-2 pr-4 font-medium">YouTube</th>
                  <th className="pb-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((episode) => {
                  const t = totalsByEpisode.get(episode.id) ?? {};
                  const spotify = t.spotify ?? 0;
                  const apple = t.apple ?? 0;
                  const youtube = t.youtube ?? 0;
                  return (
                    <tr key={episode.id} className="border-b border-neutral-100">
                      <td className="py-2 pr-4 text-neutral-900">{episode.title}</td>
                      <td className="py-2 pr-4 text-neutral-600">{spotify}</td>
                      <td className="py-2 pr-4 text-neutral-600">{apple}</td>
                      <td className="py-2 pr-4 text-neutral-600">{youtube}</td>
                      <td className="py-2 font-medium text-neutral-900">
                        {spotify + apple + youtube}
                      </td>
                    </tr>
                  );
                })}
                {episodes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-neutral-400">
                      No episodes yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
