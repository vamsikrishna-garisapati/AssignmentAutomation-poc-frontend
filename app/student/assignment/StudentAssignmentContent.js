"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAssignment, submitSubmission, getSubmission } from "@/lib/api";
import FeedbackPanel from "@/components/student/FeedbackPanel";
import EditorSkeleton from "@/components/editors/EditorSkeleton";

const SandpackEditor = dynamic(
  () => import("@/components/editors/SandpackEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);
const SqlEditor = dynamic(
  () => import("@/components/editors/SqlEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);
const PythonEditor = dynamic(
  () => import("@/components/editors/PythonEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);
const HtmlCssEditor = dynamic(
  () => import("@/components/editors/HtmlCssEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

const POLL_INTERVAL_MS = 1500;

export default function StudentAssignmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [grading, setGrading] = useState(false);
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

  // Backend may return 201 with status === 'completed' (sync grading) or e.g. 'grading' (future async); we poll until completed.
  const handleSubmit = (body) => {
    setError(null);
    setGrading(true);
    return submitSubmission(body)
      .then((res) => {
        if (res.status === "completed") {
          setSubmission(res);
          setGrading(false);
          return;
        }
        const submissionId = res.id;
        const poll = () => {
          getSubmission(submissionId)
            .then((next) => {
              if (next.status === "completed") {
                setSubmission(next);
                setGrading(false);
                return;
              }
              setTimeout(poll, POLL_INTERVAL_MS);
            })
            .catch((e) => {
              setError(e.message);
              setGrading(false);
            });
        };
        setTimeout(poll, POLL_INTERVAL_MS);
      })
      .catch((e) => {
        setError(e.message);
        setGrading(false);
      });
  };

  if (!id) {
    return (
      <div className="space-y-4">
        <p className="text-zinc-600 dark:text-zinc-400">
          Missing assignment id.{" "}
          <Link
            href="/student/assignments"
            className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
          >
            Back to My assignments
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

  if (error && !assignment) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
          {error}
        </div>
        <Link
          href="/student/assignments"
          className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
        >
          Back to My assignments
        </Link>
      </div>
    );
  }

  if (!assignment) return null;

  const starterCode = assignment.starter_code || {};
  const sc = typeof starterCode === "string" ? {} : starterCode;

  let editorEl = null;
  switch (assignment.assignment_type) {
    case "react":
      editorEl = (
        <SandpackEditor
          assignmentId={assignment.id}
          starterCode={sc.react ?? sc["/App.js"] ?? ""}
          onSubmit={handleSubmit}
        />
      );
      break;
    case "sql":
      editorEl = (
        <SqlEditor
          assignmentId={assignment.id}
          dbSetup={sc.db_setup ?? ""}
          starterQuery={sc.sql ?? ""}
          onSubmit={handleSubmit}
        />
      );
      break;
    case "python":
      editorEl = (
        <PythonEditor
          assignmentId={assignment.id}
          starterCode={sc.python ?? (typeof starterCode === "string" ? starterCode : "")}
          publicTests={assignment.public_tests}
          onSubmit={handleSubmit}
        />
      );
      break;
    case "html_css":
      editorEl = (
        <HtmlCssEditor
          assignmentId={assignment.id}
          starterHtml={sc.html ?? ""}
          starterCss={sc.css ?? ""}
          onSubmit={handleSubmit}
        />
      );
      break;
    default:
      editorEl = (
        <p className="text-zinc-500 dark:text-zinc-400">
          Unknown assignment type: {assignment.assignment_type}
        </p>
      );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/student/assignments"
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
      >
        ← My assignments
      </Link>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {assignment.title}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {assignment.assignment_type} · {assignment.difficulty}
      </p>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 space-y-2">
        <h2 className="font-medium text-zinc-950 dark:text-zinc-50">
          Description
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {assignment.description}
        </p>
        {(assignment.requirements || []).length > 0 && (
          <>
            <h2 className="font-medium text-zinc-950 dark:text-zinc-50 mt-3">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300">
              {assignment.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      {grading && (
        <p className="text-zinc-600 dark:text-zinc-400">Grading…</p>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
        <h2 className="font-medium text-zinc-950 dark:text-zinc-50 mb-3">
          Your solution
        </h2>
        {editorEl}
      </div>
      {submission && (
        <FeedbackPanel
          submission={submission}
          onRetry={() => setSubmission(null)}
        />
      )}
    </div>
  );
}
