import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Platform } from "@/generated/prisma/client";

const PLATFORM_FIELD: Record<string, "spotifyUrl" | "appleUrl" | "youtubeUrl"> = {
  spotify: "spotifyUrl",
  apple: "appleUrl",
  youtube: "youtubeUrl",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ episodeId: string; platform: string }> }
) {
  const { episodeId, platform } = await params;
  const field = PLATFORM_FIELD[platform];

  if (!field) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }

  const episode = await prisma.episode.findUnique({ where: { id: episodeId } });
  const url = episode?.[field];

  if (!episode || !url) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.clickEvent.create({
    data: { episodeId, platform: platform as Platform },
  });

  return NextResponse.redirect(url, { status: 302 });
}
