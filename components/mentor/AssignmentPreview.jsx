"use client";

import { useState } from "react";

function formatJson(obj) {
  if (obj === null || obj === undefined) return "";
  if (typeof obj === "string") return obj;
  return JSON.stringify(obj, null, 2);
}

export default function AssignmentPreview({
  assignment,
  onSave,
  editable,
  topicIds = [],
}) {
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [description, setDescription] = useState(
    assignment?.description ?? ""
  );
  const [requirements, setRequirements] = useState(
    Array.isArray(assignment?.requirements)
      ? assignment.requirements.join("\n")
      : formatJson(assignment?.requirements ?? [])
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!onSave) return;
    setError(null);
    setSaving(true);
    const reqList = requirements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      title: title || assignment?.title || "Untitled",
      assignment_type: assignment.assignment_type,
      difficulty: assignment.difficulty,
      description: description || assignment?.description || "",
      requirements: reqList,
      starter_code: assignment.starter_code ?? {},
      public_tests: assignment.public_tests ?? [],
      hidden_tests: assignment.hidden_tests ?? [],
      grading_rubric: assignment.grading_rubric ?? {
        correctness: 60,
        code_quality: 20,
        edge_cases: 20,
      },
      topic_ids: topicIds.length
      ? topicIds
      : (assignment.topics || []).map((t) => t.id),
    };
    onSave(payload)
      .then(() => setSaving(false))
      .catch((e) => {
        setError(e.message);
        setSaving(false);
      });
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
      <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
        Preview &amp; save
      </h3>

      {editable && onSave ? (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Requirements (one per line)
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={3}
              className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save assignment"}
          </button>
        </>
      ) : (
        <>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Title
            </span>
            <p className="text-zinc-950 dark:text-zinc-50">{assignment?.title}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Description
            </span>
            <p className="text-zinc-950 dark:text-zinc-50 whitespace-pre-wrap">
              {assignment?.description}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Requirements
            </span>
            <ul className="list-disc list-inside text-zinc-950 dark:text-zinc-50 mt-1">
              {(assignment?.requirements || []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          {assignment?.starter_code &&
            Object.keys(assignment.starter_code).length > 0 && (
              <div>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Starter code
                </span>
                <pre className="mt-1 p-3 rounded bg-zinc-100 dark:bg-zinc-800 text-sm overflow-x-auto">
                  {formatJson(assignment.starter_code)}
                </pre>
              </div>
            )}
          {(assignment?.public_tests?.length ?? 0) > 0 && (
            <div>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Public tests
              </span>
              <pre className="mt-1 p-3 rounded bg-zinc-100 dark:bg-zinc-800 text-sm overflow-x-auto">
                {formatJson(assignment.public_tests)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
