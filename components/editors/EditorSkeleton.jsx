"use client";

export default function EditorSkeleton() {
  return (
    <div
      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center min-h-[320px]"
      aria-hidden
    >
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
        Loading editor…
      </p>
    </div>
  );
}
