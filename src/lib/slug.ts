import { prisma } from "@/lib/prisma";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function uniqueSlugForShow(
  showId: string,
  base: string,
  excludeEpisodeId?: string
): Promise<string> {
  const cleanBase = slugify(base) || "episode";

  const existing = await prisma.episode.findMany({
    where: {
      showId,
      slug: { startsWith: cleanBase },
      ...(excludeEpisodeId ? { id: { not: excludeEpisodeId } } : {}),
    },
    select: { slug: true },
  });

  const taken = new Set(existing.map((e) => e.slug));
  if (!taken.has(cleanBase)) return cleanBase;

  let n = 2;
  while (taken.has(`${cleanBase}-${n}`)) n++;
  return `${cleanBase}-${n}`;
}
