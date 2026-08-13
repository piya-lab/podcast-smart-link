const LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  website: "Website",
};

export function SocialLinks({ socials }: { socials: Record<string, string | undefined> }) {
  const entries = Object.entries(socials).filter(([, url]) => url);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
        >
          {LABELS[key] ?? key}
        </a>
      ))}
    </div>
  );
}
