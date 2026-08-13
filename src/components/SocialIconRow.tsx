import { InstagramIcon, XIcon, TikTokIcon, WebsiteIcon, EmailIcon } from "@/components/icons";

const SOCIAL_CONFIG = {
  instagram: {
    Icon: InstagramIcon,
    bg: "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600",
  },
  x: { Icon: XIcon, bg: "bg-black" },
  tiktok: { Icon: TikTokIcon, bg: "bg-black" },
  website: { Icon: WebsiteIcon, bg: "bg-neutral-800" },
} as const;

export function SocialIconRow({ socials }: { socials: Record<string, string | undefined> }) {
  const entries = (Object.keys(SOCIAL_CONFIG) as (keyof typeof SOCIAL_CONFIG)[])
    .filter((key) => socials[key])
    .map((key) => ({ key, url: socials[key]!, ...SOCIAL_CONFIG[key] }));

  const email = socials.email;

  if (entries.length === 0 && !email) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {entries.map(({ key, url, Icon, bg }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105 ${bg}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-white shadow-sm transition-transform hover:scale-105"
        >
          <EmailIcon className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
