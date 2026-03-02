"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAssignment } from "@/lib/api";
import AssignmentPreview from "@/components/mentor/AssignmentPreview";
import StudentAssigner from "@/components/mentor/StudentAssigner";

export default function MentorAssignmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getAssignment(id)
      .then(setAssignment)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="space-y-4">
        <p className="text-zinc-600 dark:text-zinc-400">
          Missing assignment id.{" "}
          <Link
            href="/mentor/dashboard"
            className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
          >
            Back to dashboard
          </Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">
        Loading assignment…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
          {error}
        </div>
        <Link
          href="/mentor/dashboard"
          className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/mentor/dashboard"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
        >
          ← Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {assignment.title}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Type: {assignment.assignment_type} · Difficulty: {assignment.difficulty}
      </p>
      <AssignmentPreview assignment={assignment} editable={false} />
      <StudentAssigner assignmentId={assignment.id} onAssigned={() => {}} />
    </div>
  );
}
