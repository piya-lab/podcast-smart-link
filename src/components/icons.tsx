type IconProps = { className?: string };

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

export function EmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 6.5 12 13l8.5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4.5" width="4.5" height="15" rx="1" fill="currentColor" />
      <rect x="13.5" y="4.5" width="4.5" height="15" rx="1" fill="currentColor" />
    </svg>
  );
}

export function SkipBackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12a7 7 0 1 1 2.2 5.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M5 8v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">
        30
      </text>
    </svg>
  );
}

export function SkipForwardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 12a7 7 0 1 0-2.2 5.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M19 8v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">
        30
      </text>
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
