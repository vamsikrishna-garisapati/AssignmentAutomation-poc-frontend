"use client";

import { useState } from "react";
import { assignStudents } from "@/lib/api";

const POC_STUDENTS = [{ id: 2, name: "Student" }];

export default function StudentAssigner({
  assignmentId,
  students = POC_STUDENTS,
  onAssigned,
}) {
  const [selectedIds, setSelectedIds] = useState(
    students.map((s) => s.id)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    if (!assignmentId || selectedIds.length === 0) return;
    setError(null);
    setLoading(true);
    assignStudents(assignmentId, selectedIds)
      .then(() => {
        setLoading(false);
        onAssigned?.();
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
      <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
        Assign to students
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Select students to assign this assignment to (POC: fixed list).
      </p>
      <div className="flex flex-wrap gap-3">
        {students.map((s) => (
          <label
            key={s.id}
            className="flex items-center gap-2 cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(s.id)}
              onChange={() => toggle(s.id)}
              className="rounded border-zinc-300 dark:border-zinc-600"
            />
            <span className="text-zinc-900 dark:text-zinc-100">
              {s.name ?? `Student ${s.id}`}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={handleAssign}
        disabled={loading || selectedIds.length === 0}
        className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "Assigning…" : "Assign"}
      </button>
    </div>
  );
}
