"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStudentAssignments } from "@/lib/api";

export default function StudentAssignmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStudentAssignments()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">
        Loading assignments…
      </div>
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
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
        My assignments
      </h1>
      {items.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No assignments assigned yet.
        </p>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Assignment
                </th>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Type
                </th>
                <th className="px-4 py-3 font-medium text-zinc-950 dark:text-zinc-50">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/student/assignment?id=${item.assignment.id}`}
                      className="text-zinc-900 dark:text-zinc-100 hover:underline font-medium"
                    >
                      {item.assignment.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 capitalize">
                    {item.assignment.assignment_type}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {item.completed ? "Completed" : "Not started"}
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
