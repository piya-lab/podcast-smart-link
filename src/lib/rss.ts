import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { slugify, uniqueSlugForShow, extractGuestName } from "@/lib/slug";

type ItunesImageField = { $?: { href?: string } };

const parser = new Parser<Record<string, unknown>, { "itunes:image"?: ItunesImageField }>({
  customFields: {
    item: ["itunes:image"],
  },
});

export async function syncShowEpisodes(showId: string, rssUrl: string) {
  const feed = await parser.parseURL(rssUrl);
  const feedArtwork = feed.itunes?.image ?? feed.image?.url;
  const feedDescription = feed.itunes?.summary ?? feed.description;

  if (feedDescription) {
    const show = await prisma.show.findUnique({ where: { id: showId }, select: { tagline: true } });
    if (show && !show.tagline) {
      await prisma.show.update({ where: { id: showId }, data: { tagline: feedDescription } });
    }
  }

  let created = 0;
  let updated = 0;

  for (const item of feed.items) {
    const guid = item.guid ?? item.link ?? item.title;
    if (!guid || !item.title) continue;

    const artworkUrl = item["itunes:image"]?.$?.href ?? feedArtwork ?? null;
    const publishedAt = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : new Date();
    const description = item.contentSnippet ?? item.content ?? null;

    const existing = await prisma.episode.findUnique({
      where: { showId_guid: { showId, guid } },
    });

    if (existing) {
      const slug =
        existing.slug ?? (await uniqueSlugForShow(showId, slugify(extractGuestName(item.title))));
      await prisma.episode.update({
        where: { id: existing.id },
        data: { title: item.title, description, artworkUrl, publishedAt, slug },
      });
      updated++;
    } else {
      const slug = await uniqueSlugForShow(showId, slugify(extractGuestName(item.title)));
      await prisma.episode.create({
        data: {
          showId,
          guid,
          slug,
          title: item.title,
          description,
          artworkUrl,
          publishedAt,
        },
      });
      created++;
    }
  }

  return { created, updated, total: feed.items.length };
}
