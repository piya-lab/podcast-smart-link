"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getShow } from "@/lib/show";
import { syncShowEpisodes } from "@/lib/rss";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function saveSettings(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const rssUrl = String(formData.get("rssUrl") ?? "").trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim() || null;
  const brandColor = String(formData.get("brandColor") ?? "#111111").trim();

  const socials = {
    instagram: String(formData.get("instagram") ?? "").trim() || undefined,
    tiktok: String(formData.get("tiktok") ?? "").trim() || undefined,
    x: String(formData.get("x") ?? "").trim() || undefined,
    website: String(formData.get("website") ?? "").trim() || undefined,
  };

  const existing = await getShow();

  if (existing) {
    await prisma.show.update({
      where: { id: existing.id },
      data: { name, slug, rssUrl, logoUrl, brandColor, socials },
    });
  } else {
    await prisma.show.create({
      data: { name, slug, rssUrl, logoUrl, brandColor, socials },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/episodes");
}

export async function saveEpisodeLinks(episodeId: string, formData: FormData) {
  const spotifyUrl = String(formData.get("spotifyUrl") ?? "").trim() || null;
  const appleUrl = String(formData.get("appleUrl") ?? "").trim() || null;
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim() || null;

  await prisma.episode.update({
    where: { id: episodeId },
    data: { spotifyUrl, appleUrl, youtubeUrl },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/episodes");
}

export async function runSync() {
  const show = await getShow();
  if (!show) return { error: "Set up your show details first." };

  try {
    const result = await syncShowEpisodes(show.id, show.rssUrl);
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/episodes");
    return { result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to sync RSS feed." };
  }
}
