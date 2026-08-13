"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from "@/components/icons";

const SPEEDS = [1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), duration || Infinity);
  }

  function cycleSpeed() {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIndex];
  }

  function seekFromClientX(clientX: number) {
    const bar = barRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="px-5 py-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div
        ref={barRef}
        onPointerDown={(e) => {
          seekFromClientX(e.clientX);
          const onMove = (ev: PointerEvent) => seekFromClientX(ev.clientX);
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        }}
        className="relative h-1.5 w-full cursor-pointer rounded-full bg-neutral-200"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-900"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-neutral-900"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-neutral-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={cycleSpeed}
          className="w-9 text-sm font-semibold text-neutral-700"
        >
          {SPEEDS[speedIndex]}x
        </button>
        <button type="button" onClick={() => skip(-30)} className="text-neutral-800">
          <SkipBackIcon className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white"
        >
          {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
        </button>
        <button type="button" onClick={() => skip(30)} className="text-neutral-800">
          <SkipForwardIcon className="h-7 w-7" />
        </button>
        <div className="w-9" />
      </div>
    </div>
  );
}
