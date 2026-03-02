"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssignments } from "@/lib/api";

export default function MentorDashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssignments()
      .then(setAssignments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading assignments…</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Mentor Dashboard
        </h1>
        <Link
          href="/mentor/generate"
          className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Generate new
        </Link>
      </div>

      {assignments.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No assignments yet. Create one with &quot;Generate new&quot;.
        </p>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Title
                </th>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Type
                </th>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Difficulty
                </th>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/mentor/assignment?id=${a.id}`}
                      className="text-zinc-900 dark:text-zinc-100 hover:underline font-medium"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 capitalize">
                    {a.assignment_type}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 capitalize">
                    {a.difficulty}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-sm">
                    {a.created_at
                      ? new Date(a.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
