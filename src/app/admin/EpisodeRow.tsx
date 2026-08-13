"use client";

import { useState } from "react";
import { SaveButton } from "./SaveButton";

type Episode = {
  id: string;
  title: string;
  artworkUrl: string | null;
  slug: string | null;
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
};

export function EpisodeRow({
  episode,
  visits,
  clicks,
  saveAction,
}: {
  episode: Episode;
  visits: number;
  clicks: number;
  saveAction: (formData: FormData) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const ctr = visits > 0 ? Math.round((clicks / visits) * 100) : null;

  async function copyLink() {
    const url = `${window.location.origin}/${episode.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <tr className="border-b border-neutral-100">
        <td className="py-3 pr-3">
          {episode.artworkUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={episode.artworkUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-neutral-200" />
          )}
        </td>
        <td className="max-w-[220px] py-3 pr-3">
          <p className="truncate text-sm font-medium text-neutral-900">{episode.title}</p>
        </td>
        <td className="py-3 pr-3">
          {episode.slug ? (
            <button
              type="button"
              onClick={copyLink}
              className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
            >
              /{episode.slug}
              {copied && <span className="ml-1 text-neutral-400">(copied)</span>}
            </button>
          ) : (
            <span className="text-sm text-neutral-400">no link yet</span>
          )}
        </td>
        <td className="py-3 pr-3 text-sm text-neutral-600">{visits}</td>
        <td className="py-3 pr-3 text-sm text-neutral-600">{ctr === null ? "—" : `${ctr}%`}</td>
        <td className="py-3 text-right">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            {expanded ? "Close" : "Edit"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-neutral-100 bg-neutral-50">
          <td colSpan={6} className="p-4">
            <form action={saveAction} className="grid grid-cols-2 gap-3">
              <TextField label="Public link slug" name="slug" defaultValue={episode.slug ?? undefined} />
              <TextField label="Spotify link" name="spotifyUrl" defaultValue={episode.spotifyUrl ?? undefined} />
              <TextField label="Apple Podcasts link" name="appleUrl" defaultValue={episode.appleUrl ?? undefined} />
              <TextField label="YouTube link" name="youtubeUrl" defaultValue={episode.youtubeUrl ?? undefined} />
              <div className="col-span-2">
                <SaveButton>Save</SaveButton>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

function TextField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
    </label>
  );
}
