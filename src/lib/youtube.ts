export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1] || null;
      return u.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}
