"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { runTests } from "@/lib/api";
import TestResults from "@/components/student/TestResults";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export default function PythonEditor({
  assignmentId,
  starterCode,
  publicTests,
  onSubmit,
}) {
  const [code, setCode] = useState(starterCode || "");
  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRunTests = () => {
    setRunLoading(true);
    setRunResult(null);
    runTests({ code, assignment_id: assignmentId })
      .then((data) => {
        setRunResult(
          data.results
            ? {
                results: data.results,
                passed_tests: data.passed_tests ?? 0,
                total_tests: data.total_tests ?? (data.results?.length || 0),
                error: data.error,
              }
            : data
        );
      })
      .catch((e) => {
        setRunResult({
          error: e.message || "Run failed",
          passed_tests: 0,
          total_tests: 0,
          results: [],
        });
      })
      .finally(() => setRunLoading(false));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    onSubmit({
      assignment_id: assignmentId,
      code,
    }).finally(() => setSubmitting(false));
  };

  return (
    <div className="space-y-3 min-h-[300px]">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <MonacoEditor
          height="280px"
          language="python"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="light"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRunTests}
          disabled={runLoading}
          className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          {runLoading ? "Running…" : "Run tests"}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
      {runResult && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900">
          <TestResults testResults={runResult} />
        </div>
      )}
    </div>
  );
}
