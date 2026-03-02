"use client";

export default function TopicSelector({ topics, selectedIds, onChange }) {
  const toggle = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Select topics
      </p>
      <div className="flex flex-wrap gap-3">
        {topics.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(t.id)}
              onChange={() => toggle(t.id)}
              className="rounded border-zinc-300 dark:border-zinc-600"
            />
            <span className="text-zinc-900 dark:text-zinc-100">{t.name}</span>
            {t.category && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ({t.category})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
