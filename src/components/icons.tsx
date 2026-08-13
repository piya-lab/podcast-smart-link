type IconProps = { className?: string };

export function SpotifyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1DB954" />
      <path
        d="M17.3 16.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.5-.5 10.3 1.2.3.2.4.6.2.9zm1.2-2.7c-.2.4-.7.5-1.1.3-2.9-1.8-7.3-2.3-10.7-1.3-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.9-1.2 8.7-.6 12 1.4.4.2.5.7.3 1.1zm.1-2.8C15.2 8.7 9.5 8.5 6.3 9.5c-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.7-1.1 10-.9 13.9 1.4.5.3.6.9.3 1.4-.3.4-.9.6-1.4.3z"
        fill="#fff"
      />
    </svg>
  );
}

export function ApplePodcastsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="apple-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F452FF" />
          <stop offset="1" stopColor="#832BC1" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#apple-gradient)" />
      <path
        d="M12 5.5a4 4 0 0 0-4 4c0 1.6.9 2.9 2.2 3.6.2.1.3.3.3.5l-.3 3.2a1.8 1.8 0 0 0 1.8 2h0a1.8 1.8 0 0 0 1.8-2l-.3-3.2c0-.2.1-.4.3-.5A4 4 0 0 0 16 9.5a4 4 0 0 0-4-4z"
        fill="#fff"
      />
      <circle cx="12" cy="9.3" r="1.6" fill="url(#apple-gradient)" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <path d="M10 8.5 16 12l-6 3.5v-7z" fill="#fff" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4l7 8.5L4.4 20H6.6l5.6-6.4L16.9 20H20l-7.4-9L20 4h-2.2l-5.2 5.9L8 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 3v10.3a2.6 2.6 0 1 1-2.2-2.6v-2.1a4.7 4.7 0 1 0 4.2 4.7V9.3a6.6 6.6 0 0 0 3.6 1.1V8.3a4.4 4.4 0 0 1-3.4-2.1A4.4 4.4 0 0 1 16 3h-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WebsiteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
